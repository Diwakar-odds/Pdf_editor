import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Annotation {
    id: string;
    type: 'text' | 'image' | 'draw' | 'highlight' | 'shape' | 'comment';
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
    rotation?: number; // Rotation in degrees

    // Shape-specific
    shapeType?: 'rectangle' | 'circle' | 'arrow' | 'line';
    strokeWidth?: number;
    fillColor?: string;
    endX?: number;
    endY?: number;

    // Text formatting
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline';

    // Comments
    author?: string;
    timestamp?: number;
    replies?: CommentReply[];
}

export interface CommentReply {
    id: string;
    author: string;
    content: string;
    timestamp: number;
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

    // History for undo/redo
    history: Annotation[][];
    historyIndex: number;
    clipboard: Annotation | null;

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

        // History actions
        undo: () => void;
        redo: () => void;
        pushHistory: () => void;

        // Annotation management
        copyAnnotation: (id: string) => void;
        pasteAnnotation: () => void;
        duplicateAnnotation: (id: string) => void;
        bringToFront: (id: string) => void;
        sendToBack: (id: string) => void;

        // Zoom helpers
        fitToWidth: () => void;
        fitToPage: () => void;

        reset: () => void;
        loadSample: () => Promise<void>;
    };
}

export const usePDFStore = create<PDFState>((set, get) => ({
    file: null,
    numPages: 0,
    currentPage: 1,
    scale: 1,
    rotation: 0,
    annotations: [],
    activeTool: 'select',
    selectedId: null,
    history: [[]],
    historyIndex: 0,
    clipboard: null,

    actions: {
        setFile: (file) => set({
            file,
            currentPage: 1,
            numPages: 0,
            annotations: [],
            selectedId: null,
            history: [[]],
            historyIndex: 0
        }),
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

        addAnnotation: (annotation) => {
            const state = get();
            const newAnnotations = [...state.annotations, { ...annotation, id: uuidv4() }];
            set({ annotations: newAnnotations });
            get().actions.pushHistory();
        },
        updateAnnotation: (id, updates) => {
            const state = get();
            const newAnnotations = state.annotations.map(a => a.id === id ? { ...a, ...updates } : a);
            set({ annotations: newAnnotations });
            get().actions.pushHistory();
        },
        removeAnnotation: (id) => {
            const state = get();
            const newAnnotations = state.annotations.filter(a => a.id !== id);
            set({ annotations: newAnnotations, selectedId: null });
            get().actions.pushHistory();
        },

        // History management
        pushHistory: () => {
            const state = get();
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push(JSON.parse(JSON.stringify(state.annotations)));

            // Limit history to 50 steps
            if (newHistory.length > 50) {
                newHistory.shift();
            } else {
                set({ historyIndex: state.historyIndex + 1 });
            }

            set({ history: newHistory });
        },

        undo: () => {
            const state = get();
            if (state.historyIndex > 0) {
                const newIndex = state.historyIndex - 1;
                set({
                    annotations: JSON.parse(JSON.stringify(state.history[newIndex])),
                    historyIndex: newIndex,
                    selectedId: null
                });
            }
        },

        redo: () => {
            const state = get();
            if (state.historyIndex < state.history.length - 1) {
                const newIndex = state.historyIndex + 1;
                set({
                    annotations: JSON.parse(JSON.stringify(state.history[newIndex])),
                    historyIndex: newIndex,
                    selectedId: null
                });
            }
        },

        // Annotation management
        copyAnnotation: (id) => {
            const state = get();
            const annotation = state.annotations.find(a => a.id === id);
            if (annotation) {
                set({ clipboard: JSON.parse(JSON.stringify(annotation)) });
            }
        },

        pasteAnnotation: () => {
            const state = get();
            if (state.clipboard) {
                const newAnnotation = {
                    ...state.clipboard,
                    id: uuidv4(),
                    x: state.clipboard.x + 20,
                    y: state.clipboard.y + 20,
                };
                set({ annotations: [...state.annotations, newAnnotation] });
                get().actions.pushHistory();
            }
        },

        duplicateAnnotation: (id) => {
            const state = get();
            const annotation = state.annotations.find(a => a.id === id);
            if (annotation) {
                const newAnnotation = {
                    ...annotation,
                    id: uuidv4(),
                    x: annotation.x + 20,
                    y: annotation.y + 20,
                };
                set({ annotations: [...state.annotations, newAnnotation] });
                get().actions.pushHistory();
            }
        },

        bringToFront: (id) => {
            const state = get();
            const annotation = state.annotations.find(a => a.id === id);
            if (annotation) {
                const filtered = state.annotations.filter(a => a.id !== id);
                set({ annotations: [...filtered, annotation] });
                get().actions.pushHistory();
            }
        },

        sendToBack: (id) => {
            const state = get();
            const annotation = state.annotations.find(a => a.id === id);
            if (annotation) {
                const filtered = state.annotations.filter(a => a.id !== id);
                set({ annotations: [annotation, ...filtered] });
                get().actions.pushHistory();
            }
        },

        // Zoom helpers
        fitToWidth: () => {
            // Will be calculated based on container width
            set({ scale: 1.2 });
        },

        fitToPage: () => {
            set({ scale: 1 });
        },
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
