/**
 * Smooths a path of points using Bezier curve interpolation
 * @param points Array of [x, y] coordinates
 * @param smoothing Smoothing factor (0-1, default 0.3)
 * @returns Smoothed path as array of numbers [x1, y1, x2, y2, ...]
 */
export function smoothPath(points: number[], smoothing: number = 0.3): number[] {
    if (points.length < 4) return points; // Need at least 2 points

    const smoothed: number[] = [];

    // Convert flat array to point pairs
    const pts: [number, number][] = [];
    for (let i = 0; i < points.length; i += 2) {
        pts.push([points[i], points[i + 1]]);
    }

    if (pts.length < 2) return points;

    // Start with first point
    smoothed.push(pts[0][0], pts[0][1]);

    // Smooth intermediate points
    for (let i = 1; i < pts.length - 1; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const next = pts[i + 1];

        // Calculate control points for Bezier curve
        const cp1x = curr[0] - (next[0] - prev[0]) * smoothing;
        const cp1y = curr[1] - (next[1] - prev[1]) * smoothing;
        const cp2x = curr[0] + (next[0] - prev[0]) * smoothing;
        const cp2y = curr[1] + (next[1] - prev[1]) * smoothing;

        // Add interpolated points
        const steps = 5; // Number of interpolation steps
        for (let t = 0; t <= steps; t++) {
            const ratio = t / steps;
            const x = bezier(prev[0], cp1x, cp2x, next[0], ratio);
            const y = bezier(prev[1], cp1y, cp2y, next[1], ratio);
            smoothed.push(x, y);
        }
    }

    // End with last point
    smoothed.push(pts[pts.length - 1][0], pts[pts.length - 1][1]);

    return smoothed;
}

/**
 * Cubic Bezier curve calculation
 */
function bezier(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;

    return p0 * mt3 + 3 * p1 * mt2 * t + 3 * p2 * mt * t2 + p3 * t3;
}

/**
 * Simplifies a path by removing redundant points
 * @param points Array of coordinates
 * @param tolerance Distance tolerance for point removal
 */
export function simplifyPath(points: number[], tolerance: number = 2): number[] {
    if (points.length < 6) return points; // Need at least 3 points

    const simplified: number[] = [points[0], points[1]]; // Start point

    for (let i = 2; i < points.length - 2; i += 2) {
        const lastX = simplified[simplified.length - 2];
        const lastY = simplified[simplified.length - 1];
        const currX = points[i];
        const currY = points[i + 1];

        const distance = Math.sqrt((currX - lastX) ** 2 + (currY - lastY) ** 2);

        if (distance > tolerance) {
            simplified.push(currX, currY);
        }
    }

    // Always include last point
    simplified.push(points[points.length - 2], points[points.length - 1]);

    return simplified;
}
