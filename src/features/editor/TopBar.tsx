import {
    Download,
    Share2,
    Printer,
    Search
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { usePDFStore } from '../../store/usePDFStore';
import { exportPDF, downloadFile } from '../../lib/pdf-utils';

interface TopBarProps {
    fileName: string;
}

export function TopBar({ fileName }: TopBarProps) {
    const navigate = useNavigate();
    const { file, annotations } = usePDFStore();

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

    return (
        <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 z-20 shrink-0">
            <div className="flex items-center gap-4 w-1/3">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </Button>
                <div>
                    <h1 className="text-sm font-semibold text-slate-800 leading-tight">{fileName}</h1>
                    <span className="text-xs text-slate-400">Saved locally</span>
                </div>
            </div>

            <div className="flex items-center justify-center w-1/3">
                <div className="relative w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
                        placeholder="Search document..."
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1.5 rounded-md">⌘ K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 w-1/3">
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
                    <Printer className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
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
