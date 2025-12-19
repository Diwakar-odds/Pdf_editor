import { usePDFStore } from '../../store/usePDFStore';
import { Type, Palette, Trash2, Copy, Layers, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';
import { smoothPath } from '../../lib/path-utils';
import { OCRPanel } from './OCRPanel';
import { ProtectPanel } from './ProtectPanel';

export function PropertiesPanel() {
    const { selectedId, annotations, actions } = usePDFStore();
    const activeTool = usePDFStore(state => state.activeTool);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showFillColorPicker, setShowFillColorPicker] = useState(false);

    const selectedAnnotation = annotations.find(a => a.id === selectedId);

    // Show OCR panel when OCR tool is active
    if (activeTool === 'ocr') {
        return (
            <aside className="w-80 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-y-auto shrink-0">
                <OCRPanel />
            </aside>
        );
    }

    // Show Protect panel when Protect tool is active
    if (activeTool === 'protect') {
        return (
            <aside className="w-80 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-y-auto shrink-0">
                <ProtectPanel />
            </aside>
        );
    }

    if (!selectedId) {
        return (
            <aside className="w-64 bg-white border-l border-slate-200 p-4 shrink-0">
                <div className="text-center text-slate-400 mt-8">
                    <Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Select an annotation to edit properties</p>
                </div>
            </aside>
        );
    }

    if (!selectedAnnotation) {
        return (
            <aside className="w-64 bg-white border-l border-slate-200 p-4 shrink-0">
                <div className="text-center text-slate-400 mt-8">
                    <p className="text-sm">Annotation not found</p>
                </div>
            </aside>
        );
    }

    const isText = selectedAnnotation.type === 'text';
    const isHighlight = selectedAnnotation.type === 'highlight';
    const isShape = selectedAnnotation.type === 'shape';
    const isDraw = selectedAnnotation.type === 'draw';

    return (
        <aside className="w-64 bg-white border-l border-slate-200 p-4 shrink-0 overflow-y-auto">
            <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Type className="w-4 h-4" />
                {selectedAnnotation.type.charAt(0).toUpperCase() + selectedAnnotation.type.slice(1)} Properties
            </h2>

            <div className="space-y-4">
                {/* Text-specific controls */}
                {isText && (
                    <>
                        <div>
                            <label className="text-xs font-medium text-slate-600 mb-2 block">Font Size</label>
                            <input
                                type="range"
                                min="8"
                                max="72"
                                value={selectedAnnotation.fontSize || 16}
                                onChange={(e) => actions.updateAnnotation(selectedId!, { fontSize: parseInt(e.target.value) })}
                                className="w-full"
                            />
                            <div className="text-xs text-slate-500 mt-1">{selectedAnnotation.fontSize || 16}px</div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-600 mb-2 block">Font Family</label>
                            <select
                                value={selectedAnnotation.fontFamily || 'Inter'}
                                onChange={(e) => actions.updateAnnotation(selectedId!, { fontFamily: e.target.value })}
                                className="w-full px-2 py-1 border border-slate-200 rounded text-sm"
                            >
                                <option value="Inter">Inter</option>
                                <option value="Arial">Arial</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Courier New">Courier New</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Verdana">Verdana</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-600 mb-2 block">Text Align</label>
                            <div className="flex gap-1">
                                <Button
                                    variant={selectedAnnotation.textAlign === 'left' ? 'primary' : 'ghost'}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => actions.updateAnnotation(selectedId!, { textAlign: 'left' })}
                                >
                                    <AlignLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={selectedAnnotation.textAlign === 'center' ? 'primary' : 'ghost'}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => actions.updateAnnotation(selectedId!, { textAlign: 'center' })}
                                >
                                    <AlignCenter className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={selectedAnnotation.textAlign === 'right' ? 'primary' : 'ghost'}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => actions.updateAnnotation(selectedId!, { textAlign: 'right' })}
                                >
                                    <AlignRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-slate-600 mb-2 block">Text Style</label>
                            <div className="flex gap-1">
                                <Button
                                    variant={selectedAnnotation.fontWeight === 'bold' ? 'primary' : 'ghost'}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => actions.updateAnnotation(selectedId!, {
                                        fontWeight: selectedAnnotation.fontWeight === 'bold' ? 'normal' : 'bold'
                                    })}
                                >
                                    <Bold className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={selectedAnnotation.fontStyle === 'italic' ? 'primary' : 'ghost'}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => actions.updateAnnotation(selectedId!, {
                                        fontStyle: selectedAnnotation.fontStyle === 'italic' ? 'normal' : 'italic'
                                    })}
                                >
                                    <Italic className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={selectedAnnotation.textDecoration === 'underline' ? 'primary' : 'ghost'}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => actions.updateAnnotation(selectedId!, {
                                        textDecoration: selectedAnnotation.textDecoration === 'underline' ? 'none' : 'underline'
                                    })}
                                >
                                    <Underline className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {/* Color picker for text, shapes, and drawings */}
                {(isText || isShape || isDraw || isHighlight) && (
                    <div>
                        <label className="text-xs font-medium text-slate-600 mb-2 block">
                            {isHighlight ? 'Highlight Color' : 'Color'}
                        </label>
                        <div className="relative">
                            <button
                                onClick={() => setShowColorPicker(!showColorPicker)}
                                className="w-full h-10 rounded border border-slate-200 flex items-center gap-2 px-3"
                            >
                                <div
                                    className="w-6 h-6 rounded border border-slate-300"
                                    style={{ backgroundColor: selectedAnnotation.color || '#000000' }}
                                />
                                <span className="text-sm">{selectedAnnotation.color || '#000000'}</span>
                            </button>
                            {showColorPicker && (
                                <div className="absolute z-10 mt-2">
                                    <div
                                        className="fixed inset-0"
                                        onClick={() => setShowColorPicker(false)}
                                    />
                                    <HexColorPicker
                                        color={selectedAnnotation.color || '#000000'}
                                        onChange={(color) => actions.updateAnnotation(selectedId!, { color })}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Opacity for highlights */}
                {isHighlight && (
                    <div>
                        <label className="text-xs font-medium text-slate-600 mb-2 block">Opacity</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={selectedAnnotation.opacity || 0.3}
                            onChange={(e) => actions.updateAnnotation(selectedId!, { opacity: parseFloat(e.target.value) })}
                            className="w-full"
                        />
                        <div className="text-xs text-slate-500 mt-1">{Math.round((selectedAnnotation.opacity || 0.3) * 100)}%</div>
                    </div>
                )}

                {/* Stroke width for shapes and drawings */}
                {(isShape || isDraw) && (
                    <div>
                        <label className="text-xs font-medium text-slate-600 mb-2 block">Stroke Width</label>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={selectedAnnotation.strokeWidth || selectedAnnotation.fontSize || 2}
                            onChange={(e) => {
                                const key = isDraw ? 'fontSize' : 'strokeWidth';
                                actions.updateAnnotation(selectedId!, { [key]: parseInt(e.target.value) });
                            }}
                            className="w-full"
                        />
                        <div className="text-xs text-slate-500 mt-1">
                            {selectedAnnotation.strokeWidth || selectedAnnotation.fontSize || 2}px
                        </div>
                    </div>
                )}

                {/* Smoothing for drawings */}
                {isDraw && selectedAnnotation.points && (
                    <div>
                        <label className="text-xs font-medium text-slate-600 mb-2 block">Path Smoothing</label>
                        <button
                            onClick={() => {
                                const smoothed = smoothPath(selectedAnnotation.points!, 0.3);
                                actions.updateAnnotation(selectedId!, { points: smoothed });
                            }}
                            className="w-full px-3 py-2 text-sm bg-primary-50 hover:bg-primary-100 text-primary-700 rounded border border-primary-200 transition-colors"
                        >
                            Apply Smoothing
                        </button>
                    </div>
                )}

                {/* Fill color for shapes */}
                {isShape && (
                    <div>
                        <label className="text-xs font-medium text-slate-600 mb-2 block">Fill Color</label>
                        <div className="relative">
                            <button
                                onClick={() => setShowFillColorPicker(!showFillColorPicker)}
                                className="w-full h-10 rounded border border-slate-200 flex items-center gap-2 px-3"
                            >
                                <div
                                    className="w-6 h-6 rounded border border-slate-300"
                                    style={{ backgroundColor: selectedAnnotation.fillColor || 'transparent' }}
                                />
                                <span className="text-sm">{selectedAnnotation.fillColor || 'None'}</span>
                            </button>
                            {showFillColorPicker && (
                                <div className="absolute z-10 mt-2">
                                    <div
                                        className="fixed inset-0"
                                        onClick={() => setShowFillColorPicker(false)}
                                    />
                                    <div className="bg-white p-2 rounded shadow-lg">
                                        <button
                                            onClick={() => {
                                                actions.updateAnnotation(selectedId!, { fillColor: 'none' });
                                                setShowFillColorPicker(false);
                                            }}
                                            className="w-full text-left px-2 py-1 hover:bg-slate-100 rounded text-sm mb-2"
                                        >
                                            None
                                        </button>
                                        <HexColorPicker
                                            color={selectedAnnotation.fillColor || '#ffffff'}
                                            onChange={(color) => actions.updateAnnotation(selectedId!, { fillColor: color })}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Layer management */}
                <div className="pt-4 border-t border-slate-100">
                    <label className="text-xs font-medium text-slate-600 mb-2 block flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        Layer Order
                    </label>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onClick={() => actions.bringToFront(selectedId!)}
                        >
                            Bring Front
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onClick={() => actions.sendToBack(selectedId!)}
                        >
                            Send Back
                        </Button>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={() => actions.duplicateAnnotation(selectedId!)}
                    >
                        <Copy className="w-4 h-4" />
                        Duplicate
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 justify-start gap-2"
                        onClick={() => actions.removeAnnotation(selectedId!)}
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </Button>
                </div>
            </div>
        </aside>
    );
}
