import React, { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import { usePDFStore } from '../../store/usePDFStore';
import { Loader2 } from 'lucide-react';
import { TextLayer } from './layers/TextLayer';
import { DrawingLayer } from './layers/DrawingLayer';
import { HighlightLayer } from './layers/HighlightLayer';
import { ShapesLayer } from './layers/ShapesLayer';
import { useAnnotationTransform } from '../../hooks/useAnnotationTransform';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export function Canvas() {
    const { file, scale, currentPage, activeTool, selectedId, annotations, actions } = usePDFStore();
    const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        actions.setNumPages(numPages);
        console.log(`Loaded PDF with ${numPages} pages`);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const targetX = e.nativeEvent.offsetX;
        const targetY = e.nativeEvent.offsetY;

        if (activeTool === 'draw') {
            // Create new drawing annotation
            actions.addAnnotation({
                type: 'draw',
                page: currentPage,
                x: 0, y: 0, // Not used for path, but required type
                points: [targetX, targetY],
                color: '#000000',
                fontSize: 2 // Stroke width
            });
        } else if (activeTool === 'highlight') {
            // Start highlight selection
            setShapeStart({ x: targetX, y: targetY });
        } else if (['rectangle', 'circle', 'arrow', 'line'].includes(activeTool)) {
            // Start shape drawing
            setShapeStart({ x: targetX, y: targetY });
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const targetX = e.nativeEvent.offsetX;
        const targetY = e.nativeEvent.offsetY;

        if (activeTool === 'draw' && e.buttons === 1) {
            // Continue drawing
            actions.appendPathPoint(targetX, targetY);
        } else if (activeTool === 'eraser' && e.buttons === 1) {
            // Erase: find and remove drawing annotations near cursor
            const eraseRadius = 10;
            const drawingsToRemove = annotations.filter(a => {
                if (a.type !== 'draw' || a.page !== currentPage || !a.points) return false;

                // Check if any point in the path is within erase radius
                for (let i = 0; i < a.points.length; i += 2) {
                    const px = a.points[i];
                    const py = a.points[i + 1];
                    const distance = Math.sqrt((px - targetX) ** 2 + (py - targetY) ** 2);
                    if (distance < eraseRadius) return true;
                }
                return false;
            });

            drawingsToRemove.forEach(a => actions.removeAnnotation(a.id));
        }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        const targetX = e.nativeEvent.offsetX;
        const targetY = e.nativeEvent.offsetY;

        if (shapeStart) {
            const width = Math.abs(targetX - shapeStart.x);
            const height = Math.abs(targetY - shapeStart.y);
            const x = Math.min(targetX, shapeStart.x);
            const y = Math.min(targetY, shapeStart.y);

            if (activeTool === 'highlight') {
                actions.addAnnotation({
                    type: 'highlight',
                    page: currentPage,
                    x,
                    y,
                    width: Math.max(width, 20),
                    height: Math.max(height, 10),
                    color: '#ffff00',
                    opacity: 0.3
                });
            } else if (['rectangle', 'circle'].includes(activeTool)) {
                actions.addAnnotation({
                    type: 'shape',
                    page: currentPage,
                    shapeType: activeTool as 'rectangle' | 'circle',
                    x,
                    y,
                    width: Math.max(width, 20),
                    height: Math.max(height, 20),
                    strokeColor: '#000000',
                    strokeWidth: 2,
                    fillColor: 'none'
                });
                actions.setActiveTool('select');
            } else if (['arrow', 'line'].includes(activeTool)) {
                actions.addAnnotation({
                    type: 'shape',
                    page: currentPage,
                    shapeType: activeTool as 'arrow' | 'line',
                    x: shapeStart.x,
                    y: shapeStart.y,
                    width: targetX - shapeStart.x,
                    height: targetY - shapeStart.y,
                    strokeColor: '#000000',
                    strokeWidth: 2,
                    fillColor: 'none'
                });
                actions.setActiveTool('select');
            }

            setShapeStart(null);
        }
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Don't handle if we're in a drawing/shape mode
        if (['draw', 'highlight', 'rectangle', 'circle', 'arrow', 'line'].includes(activeTool)) {
            return;
        }

        // Deselect if not handled by propagation stop in annotation
        actions.selectAnnotation(null);

        if (activeTool === 'text') {
            const targetX = e.nativeEvent.offsetX;
            const targetY = e.nativeEvent.offsetY;

            actions.addAnnotation({
                type: 'text',
                x: targetX,
                y: targetY,
                page: currentPage,
                content: 'New Text',
                fontSize: 16,
                color: '#000000',
                width: 200
            });
            actions.setActiveTool('select');
        }
    };

    const getCursorClass = () => {
        switch (activeTool) {
            case 'text': return 'cursor-text';
            case 'draw': return 'cursor-crosshair';
            case 'eraser': return 'cursor-not-allowed';
            case 'highlight':
            case 'rectangle':
            case 'circle':
            case 'arrow':
            case 'line':
                return 'cursor-crosshair';
            default: return 'cursor-default';
        }
    };

    return (
        <main className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col transition-color duration-300">
            <div className="flex-1 overflow-auto flex items-start justify-center p-8 custom-scrollbar">
                <div className="relative group bg-white shadow-2xl transition-transform duration-200 ease-out origin-top min-h-[842px]">
                    {!file ? (
                        <div className="flex items-center justify-center w-[595px] h-[842px] text-slate-400">
                            No PDF loaded
                        </div>
                    ) : (
                        <Document
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={
                                <div className="flex items-center justify-center w-[595px] h-[842px]">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                                </div>
                            }
                            error={
                                <div className="flex items-center justify-center w-[595px] h-[842px] text-rose-500">
                                    Error loading PDF
                                </div>
                            }
                        >
                            {/* Interaction Layer */}
                            <div
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onClick={handleCanvasClick}
                                className={`relative ${getCursorClass()}`}
                            >
                                <Page
                                    pageNumber={currentPage}
                                    scale={scale}
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                    className="shadow-sm"
                                />
                                <HighlightLayer pageNumber={currentPage} />
                                <ShapesLayer pageNumber={currentPage} />
                                <TextLayer pageNumber={currentPage} />
                                <DrawingLayer pageNumber={currentPage} />

                                {/* Image Layer */}
                                {annotations.filter(a => a.page === currentPage && a.type === 'image' && a.image).map(annotation => (
                                    <ImageAnnotation
                                        key={annotation.id}
                                        annotation={annotation}
                                        isSelected={selectedId === annotation.id}
                                    />
                                ))}
                            </div>
                        </Document>
                    )}
                </div>
            </div>
        </main>
    );
}

function ImageAnnotation({ annotation, isSelected }: { annotation: any; isSelected: boolean }) {
    const { actions } = usePDFStore();
    const { handleMouseDown } = useAnnotationTransform(annotation.id);

    return (
        <div
            className={`absolute pointer-events-auto cursor-move group ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
            style={{
                left: annotation.x,
                top: annotation.y,
                width: annotation.width || 200,
                height: annotation.height || 200,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'drag', annotation)}
            onClick={(e) => {
                e.stopPropagation();
                actions.selectAnnotation(annotation.id);
            }}
        >
            <img src={annotation.image} alt="User inserted" className="w-full h-full object-contain" />

            {/* Resize handles */}
            {isSelected && ['nw', 'ne', 'sw', 'se'].map(handle => (
                <div
                    key={handle}
                    className={`absolute w-2 h-2 bg-primary-500 border border-white rounded-full cursor-${handle}-resize opacity-0 group-hover:opacity-100 transition-opacity`}
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
    };
    return positions[handle] || {};
}
