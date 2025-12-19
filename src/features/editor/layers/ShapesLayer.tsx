import { usePDFStore } from '../../../store/usePDFStore';

interface ShapesLayerProps {
    pageNumber: number;
}

export function ShapesLayer({ pageNumber }: ShapesLayerProps) {
    const { annotations, selectedId, actions } = usePDFStore();

    // Filter shape annotations for this page
    const shapes = annotations.filter(
        a => a.page === pageNumber && a.type === 'shape'
    );

    return (
        <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full">
            {shapes.map(shape => {
                const strokeWidth = shape.strokeWidth || 2;
                const color = shape.color || '#000000';
                const fillColor = shape.fillColor || 'none';
                const isSelected = selectedId === shape.id;

                const commonProps = {
                    stroke: color,
                    strokeWidth: strokeWidth,
                    fill: fillColor,
                    className: `pointer-events-auto cursor-pointer ${isSelected ? 'drop-shadow-md' : ''}`,
                    onClick: (e: React.MouseEvent) => {
                        e.stopPropagation();
                        actions.selectAnnotation(shape.id);
                    },
                    style: {
                        filter: isSelected ? 'drop-shadow(0 0 3px cornflowerblue)' : 'none'
                    }
                };

                switch (shape.shapeType) {
                    case 'rectangle':
                        return (
                            <rect
                                key={shape.id}
                                x={shape.x}
                                y={shape.y}
                                width={shape.width || 100}
                                height={shape.height || 100}
                                {...commonProps}
                            />
                        );

                    case 'circle':
                        const rx = (shape.width || 100) / 2;
                        const ry = (shape.height || 100) / 2;
                        return (
                            <ellipse
                                key={shape.id}
                                cx={shape.x + rx}
                                cy={shape.y + ry}
                                rx={rx}
                                ry={ry}
                                {...commonProps}
                            />
                        );

                    case 'line':
                        return (
                            <line
                                key={shape.id}
                                x1={shape.x}
                                y1={shape.y}
                                x2={shape.endX || shape.x + 100}
                                y2={shape.endY || shape.y}
                                {...commonProps}
                            />
                        );

                    case 'arrow':
                        const endX = shape.endX || shape.x + 100;
                        const endY = shape.endY || shape.y;
                        const angle = Math.atan2(endY - shape.y, endX - shape.x);
                        const arrowSize = 10;

                        return (
                            <g key={shape.id}>
                                <line
                                    x1={shape.x}
                                    y1={shape.y}
                                    x2={endX}
                                    y2={endY}
                                    {...commonProps}
                                />
                                <polygon
                                    points={`
                                        ${endX},${endY}
                                        ${endX - arrowSize * Math.cos(angle - Math.PI / 6)},${endY - arrowSize * Math.sin(angle - Math.PI / 6)}
                                        ${endX - arrowSize * Math.cos(angle + Math.PI / 6)},${endY - arrowSize * Math.sin(angle + Math.PI / 6)}
                                    `}
                                    fill={color}
                                    className="pointer-events-auto cursor-pointer"
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        actions.selectAnnotation(shape.id);
                                    }}
                                />
                            </g>
                        );

                    default:
                        return null;
                }
            })}
        </svg>
    );
}
