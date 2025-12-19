import React, { useRef } from 'react';
import { MousePointer2, Type, Image as ImageIcon, PenTool, Highlighter, MessageSquare, Square, Circle, ArrowRight, Minus, Eraser, FileText, Shield } from 'lucide-react';
import { cn } from '../../lib/utils';
import { usePDFStore } from '../../store/usePDFStore';

export type ToolType = 'select' | 'text' | 'image' | 'draw' | 'eraser' | 'highlight' | 'rectangle' | 'circle' | 'arrow' | 'line' | 'comment' | 'form' | 'ocr' | 'protect' | 'crop';

interface ToolsSidebarProps {
    activeTool: ToolType;
    onSelectTool: (tool: ToolType) => void;
}

export function ToolsSidebar({ activeTool, onSelectTool }: ToolsSidebarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { actions, currentPage } = usePDFStore();

    const tools = [
        { id: 'select', icon: MousePointer2, label: 'Select' },
        { id: 'text', icon: Type, label: 'Text' },
        { id: 'image', icon: ImageIcon, label: 'Image', onClick: () => fileInputRef.current?.click() },
        { id: 'draw', icon: PenTool, label: 'Draw' },
        { id: 'eraser', icon: Eraser, label: 'Eraser' },
        { id: 'highlight', icon: Highlighter, label: 'Highlight' },
        { id: 'rectangle', icon: Square, label: 'Rectangle' },
        { id: 'circle', icon: Circle, label: 'Circle' },
        { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
        { id: 'line', icon: Minus, label: 'Line' },
        { id: 'comment', icon: MessageSquare, label: 'Comment' },
        { id: 'ocr', icon: FileText, label: 'OCR' },
        { id: 'protect', icon: Shield, label: 'Protect' },
    ] as const;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                actions.addAnnotation({
                    type: 'image',
                    x: 100, // Default position
                    y: 100,
                    page: currentPage, // Add to current page
                    width: 200,
                    height: 200,
                    image: dataUrl
                });
                onSelectTool('select'); // Switch visual state back
            };
            reader.readAsDataURL(file);
        }
        // Reset input
        e.target.value = '';
    };

    return (
        <aside className="w-16 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col items-center py-4 z-20 shrink-0 overflow-y-auto">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                aria-label="Upload image to PDF"
            />
            <div className="flex flex-col items-center gap-4 w-full">
                {tools.map((tool) => {
                    const IconComponent = tool.icon;
                    return (
                        <button
                            key={tool.id}
                            onClick={() => 'onClick' in tool ? tool.onClick() : onSelectTool(tool.id as ToolType)}
                            className={cn(
                                "p-2.5 rounded-xl transition-all duration-200 group relative",
                                activeTool === tool.id
                                    ? "bg-primary-50 text-primary-600 shadow-sm dark:bg-primary-900 dark:text-primary-400"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:text-slate-300 dark:hover:bg-slate-800"
                            )}
                            title={tool.label}
                        >
                            <IconComponent className="w-5 h-5" />

                            {/* Tooltip */}
                            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                {tool.label}
                                {/* Arrow */}
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                            </div>
                        </button>
                    );
                })}
            </div>
        </aside>
    );
}
