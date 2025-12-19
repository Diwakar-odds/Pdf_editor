import { useEffect } from 'react';
import { usePDFStore } from '../store/usePDFStore';

const AUTOSAVE_KEY = 'pdf-editor-autosave';
const AUTOSAVE_INTERVAL = 5000; // 5 seconds

export function useAutoSave() {
    const { annotations, file } = usePDFStore();

    useEffect(() => {
        if (!file) return;

        const timer = setTimeout(() => {
            try {
                const saveData = {
                    annotations,
                    fileName: file.name,
                    timestamp: Date.now(),
                };
                localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(saveData));
                console.log('Auto-saved annotations');
            } catch (error) {
                console.error('Auto-save failed:', error);
            }
        }, AUTOSAVE_INTERVAL);

        return () => clearTimeout(timer);
    }, [annotations, file]);
}

export function loadAutoSave() {
    try {
        const saved = localStorage.getItem(AUTOSAVE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Failed to load auto-save:', error);
    }
    return null;
}

export function clearAutoSave() {
    localStorage.removeItem(AUTOSAVE_KEY);
}
