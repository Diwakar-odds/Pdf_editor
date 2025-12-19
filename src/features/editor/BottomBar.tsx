import React from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { usePDFStore } from '../../store/usePDFStore';
import { Button } from '../../components/ui/Button';

export function BottomBar() {
    const { currentPage, numPages, scale, actions } = usePDFStore();

    const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const page = parseInt(e.target.value);
        if (!isNaN(page) && page >= 1 && page <= numPages) {
            actions.setCurrentPage(page);
        }
    };

    return (
        <footer className="h-10 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 flex items-center justify-between z-10 shrink-0 transition-colors duration-300">
            <div className="flex items-center gap-2 w-1/3">
                {/* Status Stub */}
                <span className="text-xs text-slate-400">Ready</span>
            </div>

            <div className="flex items-center gap-2 justify-center w-1/3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={actions.prevPage}
                    disabled={currentPage <= 1}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1 text-sm text-slate-600 font-medium">
                    <input
                        type="number"
                        value={currentPage}
                        onChange={handlePageChange}
                        className="w-12 h-6 text-center border border-slate-200 rounded text-xs no-spinner"
                        min={1}
                        max={numPages}
                    />
                    <span className="text-slate-400">/ {numPages}</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={actions.nextPage}
                    disabled={currentPage >= numPages}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex items-center gap-2 justify-end w-1/3">
                <select
                    value={Math.round(scale * 100)}
                    onChange={(e) => actions.setScale(parseInt(e.target.value) / 100)}
                    className="h-7 px-2 text-xs border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                    <option value="50">50%</option>
                    <option value="75">75%</option>
                    <option value="100">100%</option>
                    <option value="125">125%</option>
                    <option value="150">150%</option>
                    <option value="200">200%</option>
                    <option value="300">300%</option>
                </select>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-600 mx-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => actions.fitToPage()}
                    className="h-7 px-2 text-xs"
                    title="Fit to Page"
                >
                    Fit Page
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => actions.fitToWidth()}
                    className="h-7 px-2 text-xs"
                    title="Fit to Width"
                >
                    Fit Width
                </Button>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-600 mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => actions.setScale(Math.max(0.5, scale - 0.1))}>
                    <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xs font-medium w-10 text-center dark:text-slate-200">{Math.round(scale * 100)}%</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => actions.setScale(Math.min(3, scale + 0.1))}>
                    <Plus className="w-3 h-3" />
                </Button>
            </div>
        </footer>
    );
}
