import { useState, useCallback } from 'react';
import { usePDFStore } from '../store/usePDFStore';

export type TransformMode = 'drag' | 'resize-nw' | 'resize-ne' | 'resize-sw' | 'resize-se' | 'resize-n' | 'resize-s' | 'resize-e' | 'resize-w';

export function useAnnotationTransform(annotationId: string) {
    const { actions } = usePDFStore();
    const [isTransforming, setIsTransforming] = useState(false);
    const [mode, setMode] = useState<TransformMode | null>(null);
    const [initialBounds, setInitialBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const handleMouseDown = useCallback((e: React.MouseEvent, transformMode: TransformMode, annotation: any) => {
        e.stopPropagation();
        setIsTransforming(true);
        setMode(transformMode);
        setInitialBounds({
            x: annotation.x,
            y: annotation.y,
            width: annotation.width || 100,
            height: annotation.height || 50
        });

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - e.clientX;
            const deltaY = moveEvent.clientY - e.clientY;

            if (transformMode === 'drag') {
                actions.updateAnnotation(annotationId, {
                    x: annotation.x + deltaX,
                    y: annotation.y + deltaY
                });
            } else if (transformMode.startsWith('resize')) {
                let newBounds = { ...initialBounds };

                if (transformMode.includes('e')) {
                    newBounds.width = Math.max(50, initialBounds.width + deltaX);
                }
                if (transformMode.includes('w')) {
                    newBounds.width = Math.max(50, initialBounds.width - deltaX);
                    newBounds.x = initialBounds.x + deltaX;
                }
                if (transformMode.includes('s')) {
                    newBounds.height = Math.max(30, initialBounds.height + deltaY);
                }
                if (transformMode.includes('n')) {
                    newBounds.height = Math.max(30, initialBounds.height - deltaY);
                    newBounds.y = initialBounds.y + deltaY;
                }

                actions.updateAnnotation(annotationId, newBounds);
            }
        };

        const handleMouseUp = () => {
            setIsTransforming(false);
            setMode(null);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [annotationId, actions]);

    return { handleMouseDown, isTransforming, mode };
}
