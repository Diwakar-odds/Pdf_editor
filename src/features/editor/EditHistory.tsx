import { usePDFStore } from '../../store/usePDFStore';
import { Clock } from 'lucide-react';

export function EditHistory() {
    const { history, historyIndex } = usePDFStore();

    const getActionDescription = (index: number) => {
        if (index === 0) return 'Initial state';
        return `Action ${index}`;
    };

    const getTimeAgo = (index: number) => {
        const minutesAgo = historyIndex - index;
        if (minutesAgo === 0) return 'Current state';
        if (minutesAgo === 1) return '1 action ago';
        return `${minutesAgo} actions ago`;
    };

    return (
        <div className="p-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                Edit History
            </h3>

            {history.length === 0 ? (
                <div className="text-center text-slate-400 dark:text-slate-500 py-8">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No edit history yet</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {history.slice().reverse().map((_, idx) => {
                        const actualIndex = history.length - 1 - idx;
                        const isCurrent = actualIndex === historyIndex;

                        return (
                            <div
                                key={actualIndex}
                                className={`p-3 rounded border ${isCurrent
                                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
                                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                <p className={`text-sm font-medium ${isCurrent
                                        ? 'text-primary-700 dark:text-primary-400'
                                        : 'text-slate-700 dark:text-slate-300'
                                    }`}>
                                    {getActionDescription(actualIndex)}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {getTimeAgo(actualIndex)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
