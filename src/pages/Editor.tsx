import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePDFStore } from '../store/usePDFStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useAutoSave } from '../hooks/useAutoSave';
import { TopBar } from '../features/editor/TopBar';
import { ToolsSidebar, type ToolType } from '../features/editor/ToolsSidebar';
import { ThumbnailSidebar } from '../features/editor/ThumbnailSidebar';
import { PropertiesPanel } from '../features/editor/PropertiesPanel';
import { Canvas } from '../features/editor/Canvas';
import { BottomBar } from '../features/editor/BottomBar';
import { UploadCloud } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Document } from 'react-pdf';

export default function EditorPage() {
    useKeyboardShortcuts(); // Enable global keyboard shortcuts
    useAutoSave(); // Enable auto-save
    const { id } = useParams();
    const navigate = useNavigate();
    const { file, actions } = usePDFStore();
    const [activeTool, setActiveTool] = useState<ToolType>('select');

    useEffect(() => {
        if (!file) {
            if (id === 'sample') {
                actions.loadSample();
            }
            // Don't redirect for 'new' or 'local' routes - show upload prompt instead
        }
    }, [file, id, actions]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'application/pdf') {
                actions.setFile(selectedFile);
            } else {
                alert('Please upload a PDF file');
            }
        }
    };

    const fileName = file ? file.name : (id === 'sample' ? 'Sample.pdf' : 'Untitled.pdf');

    // Show upload prompt if no file is loaded
    if (!file && id !== 'sample') {
        return (
            <div className="h-screen w-screen bg-surface flex items-center justify-center font-sans">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <UploadCloud className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">No PDF Loaded</h2>
                    <p className="text-slate-500 mb-8">Upload a PDF file to start editing</p>
                    <input
                        type="file"
                        id="editor-file-upload"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        aria-label="Upload PDF file"
                    />
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => document.getElementById('editor-file-upload')?.click()}>
                            Upload PDF
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/')}>
                            Go Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-surface overflow-hidden flex flex-col font-sans">
            <TopBar fileName={fileName} />

            <div className="flex-1 flex overflow-hidden">
                <ToolsSidebar
                    activeTool={activeTool}
                    onSelectTool={(tool) => { setActiveTool(tool); actions.setActiveTool(tool); }}
                />

                {file && (
                    <Document file={file}>
                        <ThumbnailSidebar />
                    </Document>
                )}

                <Canvas />

                <PropertiesPanel />
            </div>
            <BottomBar />
        </div>
    );
}
