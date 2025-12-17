
import { usePDFStore } from '../../store/usePDFStore';
import { Type, Palette, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function PropertiesPanel() {
    const { annotations, selectedId, actions } = usePDFStore();
    const selectedAnnotation = annotations.find(a => a.id === selectedId);

    if (!selectedAnnotation) {
        return (
            <aside className="w-64 bg-white border-l border-slate-200 flex flex-col p-4">
                <div className="text-center text-slate-400 mt-10">
                    <p>Select an element to edit properties</p>
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-64 bg-white border-l border-slate-200 flex flex-col">
            <div className="h-14 border-b border-slate-100 flex items-center px-4 font-semibold text-slate-700">
                Properties
            </div>

            <div className="p-4 space-y-6">
                {/* Text Properties */}
                {selectedAnnotation.type === 'text' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Text Size</label>
                            <div className="flex items-center gap-2">
                                <Type className="w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    value={selectedAnnotation.fontSize || 16}
                                    onChange={(e) => actions.updateAnnotation(selectedAnnotation.id, { fontSize: parseInt(e.target.value) })}
                                    className="flex-1 border border-slate-200 rounded px-2 py-1 text-sm"
                                />
                                <span className="text-xs text-slate-400">px</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Color</label>
                            <div className="flex items-center gap-2">
                                <Palette className="w-4 h-4 text-slate-400" />
                                <input
                                    type="color"
                                    value={selectedAnnotation.color || '#000000'}
                                    onChange={(e) => actions.updateAnnotation(selectedAnnotation.id, { color: e.target.value })}
                                    className="w-full h-8 border border-slate-200 rounded cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t border-slate-100">
                    <Button
                        variant="ghost"
                        className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 justify-start gap-2"
                        onClick={() => actions.removeAnnotation(selectedAnnotation.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Element
                    </Button>
                </div>
            </div>
        </aside>
    );
}
