import { usePDFStore } from '../../../store/usePDFStore';
import { useAnnotationTransform } from '../../../hooks/useAnnotationTransform';

interface TextLayerProps {
    pageNumber: number;
}

export function TextLayer({ pageNumber }: TextLayerProps) {
    const { annotations, selectedId } = usePDFStore();

    // Filter annotations for this page and text type
    const pageAnnotations = annotations.filter(
        a => a.page === pageNumber && a.type === 'text'
    );

    return (
        <div className="absolute inset-0 pointer-events-none z-10">
            {pageAnnotations.map(annotation => {
                const isSelected = selectedId === annotation.id;

                return (
                    <TextAnnotation
                        key={annotation.id}
                        annotation={annotation}
                        isSelected={isSelected}
                    />
                );
            })}
        </div>
    );
}

function TextAnnotation({ annotation, isSelected }: { annotation: any; isSelected: boolean }) {
    const { actions } = usePDFStore();
    const { handleMouseDown } = useAnnotationTransform(annotation.id);

    const resizeHandles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'] as const;

    return (
        <div
            className={`absolute pointer-events-auto group ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
            style={{
                left: `${annotation.x}px`,
                top: `${annotation.y}px`,
                width: annotation.width ? `${annotation.width}px` : 'auto',
                minWidth: '100px',
            }}
            onMouseDown={(e) => handleMouseDown(e, 'drag', annotation)}
            onClick={(e) => {
                e.stopPropagation();
                actions.selectAnnotation(annotation.id);
            }}
        >
            <textarea
                value={annotation.content || ''}
                onChange={(e) => actions.updateAnnotation(annotation.id, { content: e.target.value })}
                className="bg-transparent outline-none resize-none overflow-hidden w-full"
                style={{
                    fontSize: `${annotation.fontSize || 16}px`,
                    color: annotation.color || 'black',
                    fontFamily: annotation.fontFamily || 'Inter',
                    textAlign: annotation.textAlign || 'left',
                    fontWeight: annotation.fontWeight || 'normal',
                    fontStyle: annotation.fontStyle || 'normal',
                    textDecoration: annotation.textDecoration || 'none',
                    minHeight: '30px',
                }}
                onMouseDown={(e) => e.stopPropagation()} // Prevent drag when typing
            />

            {/* Resize handles - only show when selected */}
            {isSelected && resizeHandles.map(handle => (
                <div
                    key={handle}
                    className={`absolute w-2 h-2 bg-primary-500 border border-white rounded-full cursor-${getCursor(handle)}-resize opacity-0 group-hover:opacity-100 transition-opacity`}
                    style={getHandlePosition(handle)}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        handleMouseDown(e, `resize-${handle}` as any, annotation);
                    }}
                />
            ))}
        </div>
    );
}

function getHandlePosition(handle: string): React.CSSProperties {
    const positions: Record<string, React.CSSProperties> = {
        nw: { top: '-4px', left: '-4px' },
        ne: { top: '-4px', right: '-4px' },
        sw: { bottom: '-4px', left: '-4px' },
        se: { bottom: '-4px', right: '-4px' },
        n: { top: '-4px', left: '50%', transform: 'translateX(-50%)' },
        s: { bottom: '-4px', left: '50%', transform: 'translateX(-50%)' },
        e: { top: '50%', right: '-4px', transform: 'translateY(-50%)' },
        w: { top: '50%', left: '-4px', transform: 'translateY(-50%)' },
    };
    return positions[handle] || {};
}

function getCursor(handle: string): string {
    const cursors: Record<string, string> = {
        nw: 'nw', ne: 'ne', sw: 'sw', se: 'se',
        n: 'n', s: 's', e: 'e', w: 'w',
    };
    return cursors[handle] || 'move';
}
