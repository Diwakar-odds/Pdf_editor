import { useEffect } from 'react';
import { usePDFStore } from '../store/usePDFStore';

export function useKeyboardShortcuts() {
    const { selectedId, actions } = usePDFStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent shortcuts when typing in input/textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifier = isMac ? e.metaKey : e.ctrlKey;

            // Undo/Redo
            if (modifier && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                actions.undo();
            } else if (modifier && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                actions.redo();
            }

            // Copy/Paste/Duplicate
            else if (modifier && e.key === 'c' && selectedId) {
                e.preventDefault();
                actions.copyAnnotation(selectedId);
            } else if (modifier && e.key === 'v') {
                e.preventDefault();
                actions.pasteAnnotation();
            } else if (modifier && e.key === 'd' && selectedId) {
                e.preventDefault();
                actions.duplicateAnnotation(selectedId);
            }

            // Delete
            else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
                e.preventDefault();
                actions.removeAnnotation(selectedId);
            }

            // Deselect
            else if (e.key === 'Escape') {
                e.preventDefault();
                actions.selectAnnotation(null);
            }

            // Tool shortcuts
            else if (e.key === 't' && !modifier) {
                e.preventDefault();
                actions.setActiveTool('text');
            } else if (e.key === 'd' && !modifier) {
                e.preventDefault();
                actions.setActiveTool('draw');
            } else if (e.key === 'h' && !modifier) {
                e.preventDefault();
                actions.setActiveTool('highlight');
            } else if (e.key === 's' && !modifier) {
                e.preventDefault();
                actions.setActiveTool('select');
            }

            // Layer management
            else if (modifier && e.key === ']' && selectedId) {
                e.preventDefault();
                actions.bringToFront(selectedId);
            } else if (modifier && e.key === '[' && selectedId) {
                e.preventDefault();
                actions.sendToBack(selectedId);
            }

            // Arrow keys to move annotation
            else if (selectedId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                const store = usePDFStore.getState();
                const annotation = store.annotations.find(a => a.id === selectedId);
                if (annotation) {
                    const step = e.shiftKey ? 10 : 1;
                    const updates: any = {};

                    if (e.key === 'ArrowUp') updates.y = annotation.y - step;
                    if (e.key === 'ArrowDown') updates.y = annotation.y + step;
                    if (e.key === 'ArrowLeft') updates.x = annotation.x - step;
                    if (e.key === 'ArrowRight') updates.x = annotation.x + step;

                    actions.updateAnnotation(selectedId, updates);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, actions]);
}
