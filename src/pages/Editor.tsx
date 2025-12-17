import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePDFStore } from '../store/usePDFStore';
import { TopBar } from '../features/editor/TopBar';
import { ToolsSidebar, type ToolType } from '../features/editor/ToolsSidebar';
import { PropertiesPanel } from '../features/editor/PropertiesPanel';
import { Canvas } from '../features/editor/Canvas';
import { BottomBar } from '../features/editor/BottomBar';

export default function EditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { file, actions } = usePDFStore();
    const [activeTool, setActiveTool] = useState<ToolType>('select');

    useEffect(() => {
        if (!file) {
            if (id === 'sample') {
                actions.loadSample();
            } else if (id !== 'new') {
                // If no file in store and not a special route, redirect home
                navigate('/');
            }
        }
    }, [file, id, navigate, actions]);

    const fileName = file ? file.name : (id === 'sample' ? 'Sample.pdf' : 'Untitled.pdf');

    return (
        <div className="h-screen w-screen bg-surface overflow-hidden flex flex-col font-sans">
            <TopBar fileName={fileName} />

            <div className="flex-1 flex overflow-hidden">
                <ToolsSidebar
                    activeTool={activeTool}
                    onSelectTool={(tool) => { setActiveTool(tool); actions.setActiveTool(tool); }}
                />

                <Canvas />

                <PropertiesPanel />
            </div>
            <BottomBar />
        </div>
    );
}
