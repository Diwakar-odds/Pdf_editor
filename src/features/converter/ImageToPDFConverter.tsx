import { useState } from 'react';
import { Upload, X, FileImage } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { convertImagesToPDF } from '../../lib/conversion-utils';
import { downloadFile } from '../../lib/pdf-utils';

export function ImageToPDFConverter() {
    const [images, setImages] = useState<File[]>([]);
    const [isConverting, setIsConverting] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const imageFiles = files.filter(f => f.type.startsWith('image/'));
        setImages(prev => [...prev, ...imageFiles]);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleConvert = async () => {
        if (images.length === 0) return;

        setIsConverting(true);
        try {
            const pdfBytes = await convertImagesToPDF(images);
            downloadFile(pdfBytes, 'converted_images.pdf');
            setImages([]); // Clear after successful conversion
        } catch (error) {
            console.error('Conversion failed:', error);
            alert('Conversion failed. Please try again.');
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                Convert Images to PDF
            </h2>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center mb-4">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                        Click to upload images or drag and drop
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                        PNG, JPG, JPEG supported
                    </p>
                </label>
            </div>

            {images.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Selected Images ({images.length})
                    </h3>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700"
                            >
                                <div className="flex items-center gap-3">
                                    <FileImage className="w-5 h-5 text-slate-500" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        {image.name}
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeImage(index)}
                                    className="text-slate-400 hover:text-red-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={handleConvert}
                        disabled={isConverting}
                        className="w-full"
                    >
                        {isConverting ? 'Converting...' : 'Convert to PDF'}
                    </Button>
                </div>
            )}
        </div>
    );
}
