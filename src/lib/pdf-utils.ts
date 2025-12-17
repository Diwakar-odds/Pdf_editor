import { PDFDocument, rgb } from 'pdf-lib';
import type { Annotation } from '../store/usePDFStore';

export async function exportPDF(file: File, annotations: Annotation[]): Promise<Uint8Array> {
    const fileArrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileArrayBuffer);
    const pages = pdfDoc.getPages();

    for (const annotation of annotations) {
        const pageIndex = annotation.page - 1; // 1-based to 0-based
        if (pageIndex < 0 || pageIndex >= pages.length) continue;

        const page = pages[pageIndex];
        const { height } = page.getSize();

        // Coordinates in PDF-lib are from bottom-left
        // Coordinates in browser (layer) are from top-left
        // y_pdf = height - y_browser - annotation_height (or approximation)
        // Adjust based on how we rendered.

        // Text
        if (annotation.type === 'text' && annotation.content) {
            const fontSize = annotation.fontSize || 16;
            // Approximate Y: text baseline is tricky. 
            // Browser Y is top-left of box.
            const y = height - annotation.y - fontSize; // Simple approximation

            page.drawText(annotation.content, {
                x: annotation.x,
                y: y,
                size: fontSize,
                color: rgb(0, 0, 0), // Parse hex to rgb later if needed
            });
        }

        // Drawing
        if (annotation.type === 'draw' && annotation.points && annotation.points.length > 0) {
            const pathData = annotation.points;
            if (pathData.length < 4) continue;

            // PDF-lib doesn't support complex SVG paths easily on existing pages without embedding SVG.
            // But we can draw lines.
            // Move to first point
            const points: { x: number, y: number }[] = [];
            for (let i = 0; i < pathData.length; i += 2) {
                points.push({ x: pathData[i], y: height - pathData[i + 1] });
            }

            if (points.length > 1) {
                // Draw simplified path as connected lines
                for (let i = 0; i < points.length - 1; i++) {
                    page.drawLine({
                        start: points[i],
                        end: points[i + 1],
                        thickness: (annotation.fontSize || 12) / 4, // stroke width proxy
                        color: rgb(0, 0, 0),
                    });
                }
            }
        }

        // Image
        if (annotation.type === 'image' && annotation.image) {
            try {
                const imageBytes = await fetch(annotation.image).then(res => res.arrayBuffer());
                let pdfImage;
                if (annotation.image.startsWith('data:image/png')) {
                    pdfImage = await pdfDoc.embedPng(imageBytes);
                } else {
                    pdfImage = await pdfDoc.embedJpg(imageBytes);
                }

                // Keep aspect ratio
                // const dims = pdfImage.scale(0.5); 

                page.drawImage(pdfImage, {
                    x: annotation.x,
                    y: height - annotation.y - (annotation.height || 200),
                    width: annotation.width || 200,
                    height: annotation.height || 200,
                });
            } catch (e) {
                console.error('Failed to embed image', e);
            }
        }
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}

export function downloadFile(data: Uint8Array, filename: string) {
    const blob = new Blob([data as unknown as BlobPart], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}
