
import { usePDFStore } from '../../../store/usePDFStore';

interface TextLayerProps {
    pageNumber: number;
}

export function TextLayer({ pageNumber }: TextLayerProps) {
    const { annotations, selectedId, actions } = usePDFStore();

    // Filter annotations for this page and text type
    const pageAnnotations = annotations.filter(
        a => a.page === pageNumber && a.type === 'text'
    );

    return (
        <div className="absolute inset-0 pointer-events-none z-10">
            {pageAnnotations.map(annotation => (
                <div
                    key={annotation.id}
                    className={`absolute pointer-events-auto border ${selectedId === annotation.id ? 'border-primary-500 bg-primary-50/10' : 'border-transparent hover:border-blue-200'}`}
                    style={{
                        left: `${annotation.x}px`,
                        top: `${annotation.y}px`,
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        actions.selectAnnotation(annotation.id);
                    }}
                >
                    <textarea
                        value={annotation.content || ''}
                        onChange={(e) => actions.updateAnnotation(annotation.id, { content: e.target.value })}
                        className="bg-transparent outline-none resize-none overflow-hidden"
                        style={{
                            fontSize: `${annotation.fontSize || 16}px`,
                            color: annotation.color || 'black',
                            width: annotation.width ? `${annotation.width}px` : 'auto',
                            minWidth: '50px'
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
