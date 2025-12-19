import { usePDFStore } from '../../../store/usePDFStore';

interface HighlightLayerProps {
    pageNumber: number;
}

export function HighlightLayer({ pageNumber }: HighlightLayerProps) {
    const { annotations, selectedId, actions } = usePDFStore();

    // Filter highlight annotations for this page
    const highlights = annotations.filter(
        a => a.page === pageNumber && a.type === 'highlight'
    );

    return (
        <div className="absolute inset-0 pointer-events-none z-5">
            {highlights.map(highlight => (
                <div
                    key={highlight.id}
                    className={`absolute pointer-events-auto cursor-pointer ${selectedId === highlight.id ? 'ring-2 ring-primary-500' : ''
                        }`}
                    style={{
                        left: `${highlight.x}px`,
                        top: `${highlight.y}px`,
                        width: `${highlight.width || 100}px`,
                        height: `${highlight.height || 20}px`,
                        backgroundColor: highlight.color || '#ffff00',
                        opacity: highlight.opacity || 0.3,
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        actions.selectAnnotation(highlight.id);
                    }}
                />
            ))}
        </div>
    );
}
