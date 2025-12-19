import { usePDFStore } from '../../store/usePDFStore';
import { Eye, EyeOff, GripVertical } from 'lucide-react';
import { useState } from 'react';

export function DocumentLayers() {
    const { annotations, currentPage } = usePDFStore();
    const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());

    // Group annotations by type
    const layers = [
        { id: 'text', name: 'Text Layer', type: 'text' },
        { id: 'image', name: 'Image Layer', type: 'image' },
        { id: 'draw', name: 'Drawing Layer', type: 'draw' },
        { id: 'shape', name: 'Shape Layer', type: 'shape' },
        { id: 'highlight', name: 'Highlight Layer', type: 'highlight' },
    ];

    const getLayerCount = (type: string) => {
        return annotations.filter(a => a.type === type && a.page === currentPage).length;
    };

    const toggleLayerVisibility = (layerId: string) => {
        const newHidden = new Set(hiddenLayers);
        if (newHidden.has(layerId)) {
            newHidden.delete(layerId);
        } else {
            newHidden.add(layerId);
        }
        setHiddenLayers(newHidden);
    };

    return (
        <div className="p-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                Document Layers
            </h3>

            <div className="space-y-2">
                {layers.map(layer => {
                    const count = getLayerCount(layer.type);
                    const isHidden = hiddenLayers.has(layer.id);

                    return (
                        <div
                            key={layer.id}
                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                                <input
                                    type="checkbox"
                                    checked={!isHidden}
                                    onChange={() => toggleLayerVisibility(layer.id)}
                                    className="w-4 h-4 text-primary-600 rounded"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-200 flex-1">
                                    {layer.name}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    ({count})
                                </span>
                            </div>
                            <button
                                onClick={() => toggleLayerVisibility(layer.id)}
                                className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                {isHidden ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                    Current page: {currentPage}
                </p>
            </div>
        </div>
    );
}
