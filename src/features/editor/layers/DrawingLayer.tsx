
import { usePDFStore } from '../../../store/usePDFStore';

interface DrawingLayerProps {
    pageNumber: number;
}

export function DrawingLayer({ pageNumber }: DrawingLayerProps) {
    const { annotations, selectedId, actions } = usePDFStore();

    // Filter drawing annotations for this page
    const pageDrawings = annotations.filter(
        a => a.page === pageNumber && a.type === 'draw' && a.points
    );

    // Convert points array [x1, y1, x2, y2, ...] to SVG path "M x1 y1 L x2 y2 ..."
    const getPathString = (points: number[]) => {
        if (points.length < 2) return '';
        let d = `M ${points[0]} ${points[1]}`;
        for (let i = 2; i < points.length; i += 2) {
            d += ` L ${points[i]} ${points[i + 1]}`;
        }
        return d;
    };

    return (
        <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full"> // z-10 same as text? Maybe lower?
            {pageDrawings.map(annotation => (
                <path
                    key={annotation.id}
                    d={getPathString(annotation.points!)}
                    stroke={annotation.color || 'black'}
                    strokeWidth={annotation.fontSize ? annotation.fontSize / 4 : 2} // Reuse fontSize as strokeWidth proxy
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`pointer-events-auto cursor-pointer ${selectedId === annotation.id ? 'opacity-80 drop-shadow-md' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        actions.selectAnnotation(annotation.id);
                    }}
                    style={{
                        filter: selectedId === annotation.id ? 'drop-shadow(0 0 2px cornflowerblue)' : 'none'
                    }}
                />
            ))}
        </svg>
    );
}
