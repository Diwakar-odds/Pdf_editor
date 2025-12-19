import { useState } from 'react';
import { FileText, Download, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { usePDFStore } from '../../store/usePDFStore';

export function OCRPanel() {
    const { file, currentPage } = usePDFStore();
    const [extractedText, setExtractedText] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleExtractText = async () => {
        if (!file) return;

        setIsExtracting(true);
        try {
            // Use pdf.js to extract text from current page
            const { pdfjs } = await import('react-pdf');
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            const page = await pdf.getPage(currentPage);
            const textContent = await page.getTextContent();

            const text = textContent.items
                .map((item: any) => item.str)
                .join(' ');

            setExtractedText(text);
        } catch (error) {
            console.error('Text extraction failed:', error);
            alert('Text extraction failed. This PDF may not contain extractable text.');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleExtractAllPages = async () => {
        if (!file) return;

        setIsExtracting(true);
        try {
            const { pdfjs } = await import('react-pdf');
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;

            let allText = '';
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(' ');
                allText += `\n\n--- Page ${i} ---\n\n${pageText}`;
            }

            setExtractedText(allText);
        } catch (error) {
            console.error('Text extraction failed:', error);
            alert('Text extraction failed.');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleDownloadText = () => {
        const blob = new Blob([extractedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted_text.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleCopyText = async () => {
        try {
            await navigator.clipboard.writeText(extractedText);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Copy failed:', error);
            alert('Failed to copy text to clipboard.');
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Text Extraction (OCR)
            </h3>

            <div className="flex gap-2">
                <Button
                    onClick={handleExtractText}
                    disabled={isExtracting || !file}
                    className="flex-1"
                    size="sm"
                >
                    {isExtracting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Extracting...
                        </>
                    ) : (
                        <>
                            <FileText className="w-4 h-4 mr-2" />
                            Current Page
                        </>
                    )}
                </Button>

                <Button
                    onClick={handleExtractAllPages}
                    disabled={isExtracting || !file}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                >
                    All Pages
                </Button>
            </div>

            {extractedText && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                            Extracted Text
                        </span>
                        <div className="flex gap-1">
                            <Button
                                onClick={handleCopyText}
                                variant="ghost"
                                size="sm"
                                className="h-7"
                            >
                                {isCopied ? (
                                    <>
                                        <Check className="w-3 h-3 mr-1 text-green-600" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3 h-3 mr-1" />
                                        Copy
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={handleDownloadText}
                                variant="ghost"
                                size="sm"
                                className="h-7"
                            >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                            </Button>
                        </div>
                    </div>

                    <textarea
                        value={extractedText}
                        onChange={(e) => setExtractedText(e.target.value)}
                        className="w-full h-64 p-3 text-sm border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono resize-none"
                        placeholder="Extracted text will appear here..."
                    />
                </div>
            )}
        </div>
    );
}
