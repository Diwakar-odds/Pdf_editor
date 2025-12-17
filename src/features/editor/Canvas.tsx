import React from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import { usePDFStore } from '../../store/usePDFStore';
import { Loader2 } from 'lucide-react';
import { TextLayer } from './layers/TextLayer';
import { DrawingLayer } from './layers/DrawingLayer';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export function Canvas() {
    const { file, scale, currentPage, activeTool, selectedId, annotations, actions } = usePDFStore();

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        actions.setNumPages(numPages);
        console.log(`Loaded PDF with ${numPages} pages`);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (activeTool === 'draw') {
            const targetX = e.nativeEvent.offsetX;
            const targetY = e.nativeEvent.offsetY;

            // Create new drawing annotation
            actions.addAnnotation({
                type: 'draw',
                page: currentPage,
                x: 0, y: 0, // Not used for path, but required type
                points: [targetX, targetY],
                color: '#000000',
                fontSize: 12 // Stroke width
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (activeTool === 'draw' && e.buttons === 1) { // Check buttons for drag
            const targetX = e.nativeEvent.offsetX;
            const targetY = e.nativeEvent.offsetY;
            actions.appendPathPoint(targetX, targetY);
        }
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (activeTool === 'draw') return; // Handled by mouse down/move

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
                color: '#000000'
            });
            actions.setActiveTool('select');
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
                                onClick={handleCanvasClick}
                                className={`relative ${activeTool === 'text' ? 'cursor-text' : activeTool === 'draw' ? 'cursor-crosshair' : 'cursor-default'}`}
                            >
                                <Page
                                    pageNumber={currentPage}
                                    scale={scale}
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                    className="shadow-sm"
                                />
                                <TextLayer pageNumber={currentPage} />
                                <DrawingLayer pageNumber={currentPage} />
                                {/* Image Layer */}
                                {annotations.filter(a => a.page === currentPage && a.type === 'image' && a.image).map(annotation => (
                                    <div
                                        key={annotation.id}
                                        className={`absolute pointer-events-auto cursor-move ${selectedId === annotation.id ? 'ring-2 ring-primary-500' : ''}`}
                                        style={{
                                            left: annotation.x,
                                            top: annotation.y,
                                            width: annotation.width || 200,
                                            height: annotation.height || 200,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            actions.selectAnnotation(annotation.id);
                                        }}
                                    >
                                        <img src={annotation.image} alt="User inserted" className="w-full h-full object-contain" />
                                    </div>
                                ))}
                            </div>
                        </Document>
                    )}
                </div>
            </div>
        </main>
    );
}
