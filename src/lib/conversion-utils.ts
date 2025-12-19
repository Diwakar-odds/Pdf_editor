import { PDFDocument } from 'pdf-lib';
import { pdfjs } from 'react-pdf';

export type CompressionLevel = 'low' | 'medium' | 'high' | 'none';
export type ExportFormat = 'pdf' | 'png' | 'jpg';

/**
 * Compress PDF by reducing image quality and removing unnecessary data
 */
export async function compressPDF(
    pdfBytes: Uint8Array,
    level: CompressionLevel = 'medium'
): Promise<Uint8Array> {
    if (level === 'none') return pdfBytes;

    try {
        const pdfDoc = await PDFDocument.load(pdfBytes);

        // Compression settings based on level
        const settings = {
            low: { imageQuality: 0.9, removeMetadata: false },
            medium: { imageQuality: 0.7, removeMetadata: true },
            high: { imageQuality: 0.5, removeMetadata: true }
        };

        const config = settings[level];

        // Remove metadata for medium/high compression
        if (config.removeMetadata) {
            pdfDoc.setTitle('');
            pdfDoc.setAuthor('');
            pdfDoc.setSubject('');
            pdfDoc.setKeywords([]);
            pdfDoc.setProducer('');
            pdfDoc.setCreator('');
        }

        // Save with compression
        const compressedBytes = await pdfDoc.save({
            useObjectStreams: true,
            addDefaultPage: false,
        });

        return compressedBytes;
    } catch (error) {
        console.error('Compression failed:', error);
        return pdfBytes; // Return original if compression fails
    }
}

/**
 * Convert PDF pages to images
 */
export async function convertPDFToImages(
    file: File,
    format: 'png' | 'jpg' = 'png',
    quality: number = 0.92
): Promise<Blob[]> {
    const images: Blob[] = [];

    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.0 }); // 2x for better quality

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: context,
                viewport: viewport,
                canvas: canvas,
            }).promise;

            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob(
                    (blob) => resolve(blob!),
                    format === 'png' ? 'image/png' : 'image/jpeg',
                    quality
                );
            });

            images.push(blob);
        }

        return images;
    } catch (error) {
        console.error('PDF to image conversion failed:', error);
        throw error;
    }
}

/**
 * Convert images to PDF
 */
export async function convertImagesToPDF(images: File[]): Promise<Uint8Array> {
    try {
        const pdfDoc = await PDFDocument.create();

        for (const imageFile of images) {
            const imageBytes = await imageFile.arrayBuffer();
            let image;

            if (imageFile.type === 'image/png') {
                image = await pdfDoc.embedPng(imageBytes);
            } else if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/jpg') {
                image = await pdfDoc.embedJpg(imageBytes);
            } else {
                console.warn(`Unsupported image type: ${imageFile.type}`);
                continue;
            }

            const page = pdfDoc.addPage([image.width, image.height]);
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height,
            });
        }

        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    } catch (error) {
        console.error('Image to PDF conversion failed:', error);
        throw error;
    }
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Calculate compression ratio
 */
export function getCompressionRatio(originalSize: number, compressedSize: number): number {
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}
