import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Annotation {
    id: string;
    type: 'text' | 'image' | 'draw' | 'highlight';
    x: number;
    y: number;
    page: number;
    content?: string;
    width?: number;
    height?: number;
    color?: string;
    fontSize?: number;
    opacity?: number;
    points?: number[]; // For drawing
    image?: string; // Data URL for image
}

interface PDFState {
    file: File | null;
    numPages: number;
    currentPage: number;
    scale: number;
    rotation: number;
    annotations: Annotation[];
    activeTool: string;
    selectedId: string | null;

    actions: {
        setFile: (file: File) => void;
        setNumPages: (num: number) => void;
        setCurrentPage: (page: number) => void;
        nextPage: () => void;
        prevPage: () => void;
        setScale: (scale: number) => void;
        setRotation: (rotation: number) => void;
        setActiveTool: (tool: string) => void;
        selectAnnotation: (id: string | null) => void;
        appendPathPoint: (x: number, y: number) => void;

        addAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
        updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
        removeAnnotation: (id: string) => void;
        reset: () => void;
        loadSample: () => Promise<void>;
    };
}

export const usePDFStore = create<PDFState>((set) => ({
    file: null,
    numPages: 0,
    currentPage: 1,
    scale: 1,
    rotation: 0,
    annotations: [],
    activeTool: 'select',
    selectedId: null,

    actions: {
        setFile: (file) => set({ file, currentPage: 1, numPages: 0, annotations: [], selectedId: null }),
        setNumPages: (numPages) => set({ numPages }),
        setCurrentPage: (currentPage) => set({ currentPage, selectedId: null }),
        nextPage: () => set((state) => ({ currentPage: Math.min(state.currentPage + 1, state.numPages), selectedId: null })),
        prevPage: () => set((state) => ({ currentPage: Math.max(state.currentPage - 1, 1), selectedId: null })),
        setScale: (scale) => set({ scale }),
        setRotation: (rotation) => set({ rotation }),
        setActiveTool: (activeTool) => set({ activeTool, selectedId: null }),
        selectAnnotation: (selectedId) => set({ selectedId }),

        appendPathPoint: (x, y) => set((state) => {
            const last = state.annotations[state.annotations.length - 1];
            if (last && last.type === 'draw') {
                const newPoints = [...(last.points || []), x, y];
                const newAnnotations = [...state.annotations];
                newAnnotations[newAnnotations.length - 1] = { ...last, points: newPoints };
                return { annotations: newAnnotations };
            }
            return {};
        }),

        addAnnotation: (annotation) => set((state) => ({
            annotations: [...state.annotations, { ...annotation, id: uuidv4() }]
        })),
        updateAnnotation: (id, updates) => set((state) => ({
            annotations: state.annotations.map(a => a.id === id ? { ...a, ...updates } : a)
        })),
        removeAnnotation: (id) => set((state) => ({
            annotations: state.annotations.filter(a => a.id !== id)
        })),
        reset: () => set({
            file: null,
            numPages: 0,
            currentPage: 1,
            scale: 1,
            annotations: []
        }),
        loadSample: async () => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf');
                const blob = await response.blob();
                const file = new File([blob], 'Sample_Document.pdf', { type: 'application/pdf' });
                set({ file, currentPage: 1, numPages: 0, annotations: [] });
            } catch (error) {
                console.error('Failed to load sample PDF', error);
            }
        }
    },
}));
