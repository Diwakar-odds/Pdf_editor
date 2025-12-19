import { useState } from 'react';
import { Page } from 'react-pdf';
import { usePDFStore } from '../../store/usePDFStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ThumbnailSidebar() {
    const { numPages, currentPage, actions } = usePDFStore();
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) {
        return (
            <div className="w-12 bg-slate-50 border-r border-slate-200 flex items-start justify-center pt-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(true)}
                    className="h-8 w-8"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        );
    }

    return (
        <aside className="w-48 bg-slate-50 border-r border-slate-200 overflow-y-auto shrink-0">
            <div className="p-2 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-slate-50 z-10">
                <h3 className="text-xs font-semibold text-slate-600">Pages</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6"
                >
                    <ChevronLeft className="w-3 h-3" />
                </Button>
            </div>

            <div className="p-2 space-y-2">
                {Array.from({ length: numPages }, (_, i) => i + 1).map(pageNum => (
                    <div
                        key={pageNum}
                        className={`
                            relative cursor-pointer rounded border-2 transition-all overflow-hidden
                            ${currentPage === pageNum
                                ? 'border-primary-500 shadow-md'
                                : 'border-slate-200 hover:border-slate-300'
                            }
                        `}
                        onClick={() => actions.setCurrentPage(pageNum)}
                    >
                        <div className="bg-white">
                            <Page
                                pageNumber={pageNum}
                                width={130}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            />
                        </div>
                        <div className={`
                            absolute bottom-0 left-0 right-0 text-center py-1 text-xs font-medium
                            ${currentPage === pageNum
                                ? 'bg-primary-500 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }
                        `}>
                            Page {pageNum}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
