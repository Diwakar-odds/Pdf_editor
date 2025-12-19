import {
    Download,
    Share2,
    Printer,
    Search,
    Undo,
    Redo,
    ChevronLeft,
    ChevronRight,
    Moon,
    Sun
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { useState } from 'react';
import { useTextSearch } from '../../hooks/useTextSearch';
import { useTheme } from '../../context/ThemeContext';
import { usePDFStore } from '../../store/usePDFStore';
import { exportPDF, downloadFile } from '../../lib/pdf-utils';

interface TopBarProps {
    fileName: string;
}

export function TopBar({ fileName }: TopBarProps) {
    const navigate = useNavigate();
    const { file, annotations, history, historyIndex, actions } = usePDFStore();
    const { search, results, currentIndex, currentResult, next, prev, hasResults, isSearching } = useTextSearch();
    const { theme, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.length >= 2) {
            search(query);
        }
    };

    const handleSearchNavigation = (direction: 'next' | 'prev') => {
        if (direction === 'next') {
            next();
        } else {
            prev();
        }
        if (currentResult) {
            actions.setCurrentPage(currentResult.pageNumber);
        }
    };

    const handleExport = async () => {
        if (!file) return;
        try {
            const pdfBytes = await exportPDF(file, annotations);
            downloadFile(pdfBytes, `edited_${fileName}`);
        } catch (e) {
            console.error('Export failed', e);
            alert('Export failed. Check console.');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        if (!file) return;

        if (navigator.share) {
            try {
                const pdfBytes = await exportPDF(file, annotations);
                const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
                const filesArray = [new File([blob], `edited_${fileName}`, { type: 'application/pdf' })];

                await navigator.share({
                    files: filesArray,
                    title: fileName,
                    text: 'Check out this edited PDF'
                });
            } catch (error) {
                console.error('Share failed:', error);
            }
        } else {
            alert('Sharing is not supported on this browser. Use Export instead.');
        }
    };

    return (
        <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 z-20 shrink-0">
            <div className="flex items-center gap-4 w-1/3">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </Button>
                <div className="flex items-center gap-2">
                    <div>
                        <h1 className="text-sm font-semibold text-slate-800 leading-tight">{fileName}</h1>
                        <span className="text-xs text-slate-400">Saved locally</span>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => actions.undo()}
                            disabled={!canUndo}
                            title="Undo (Ctrl+Z)"
                            className="h-8 w-8"
                        >
                            <Undo className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => actions.redo()}
                            disabled={!canRedo}
                            title="Redo (Ctrl+Y)"
                            className="h-8 w-8"
                        >
                            <Redo className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center w-1/3">
                <div className="relative w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-24 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                        placeholder="Search document..."
                    />
                    {hasResults && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <span className="text-[10px] text-slate-500">
                                {currentIndex + 1}/{results.length}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleSearchNavigation('prev')}
                            >
                                <ChevronLeft className="w-3 h-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleSearchNavigation('next')}
                            >
                                <ChevronRight className="w-3 h-3" />
                            </Button>
                        </div>
                    )}
                    {isSearching && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 w-1/3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </Button>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-600 mx-1" />
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" onClick={handlePrint}>
                    <Printer className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" onClick={handleShare}>
                    <Share2 className="w-5 h-5" />
                </Button>
                <Button onClick={handleExport} className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                </Button>
                <div className="w-px h-6 bg-slate-200 mx-2" />
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 bg-gradient-to-tr from-primary-500 to-primary-400 text-white">
                    <User className="w-4 h-4" />
                </Button>
            </div>
        </header>
    );
}
