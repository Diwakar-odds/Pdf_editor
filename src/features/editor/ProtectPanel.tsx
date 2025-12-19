import { useState } from 'react';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { usePDFStore } from '../../store/usePDFStore';
import { exportPDF, downloadFile } from '../../lib/pdf-utils';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export function ProtectPanel() {
    const { file, annotations } = usePDFStore();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isProtecting, setIsProtecting] = useState(false);

    const handleProtectPDF = async () => {
        if (!file) return;

        if (password.length < 4) {
            alert('Password must be at least 4 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        setIsProtecting(true);
        try {
            // Export PDF with annotations first
            const pdfBytes = await exportPDF(file, annotations);

            // Load the PDF and add password protection
            const pdfDoc = await PDFDocument.load(pdfBytes);

            // Note: pdf-lib doesn't support encryption directly
            // This is a placeholder for the protection logic
            // In a real implementation, you'd use a library that supports PDF encryption

            // For now, we'll add a watermark indicating it should be protected
            const pages = pdfDoc.getPages();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            pages.forEach(page => {
                const { width, height } = page.getSize();
                page.drawText('PROTECTED', {
                    x: width / 2 - 50,
                    y: height - 30,
                    size: 12,
                    font,
                    opacity: 0.3,
                });
            });

            const protectedBytes = await pdfDoc.save();
            downloadFile(protectedBytes, 'protected_document.pdf');

            alert('PDF protected! Note: Full encryption requires server-side processing.');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Protection failed:', error);
            alert('Failed to protect PDF. Please try again.');
        } finally {
            setIsProtecting(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary-600" />
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Password Protection
                </h3>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 pr-10 text-sm border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                            placeholder="Enter password"
                        />
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                        Confirm Password
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                        placeholder="Confirm password"
                    />
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-3">
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                        <strong>Note:</strong> Full PDF encryption requires server-side processing.
                        This feature adds a protection watermark. For production use, implement
                        server-side encryption with libraries like PyPDF2 or qpdf.
                    </p>
                </div>

                <Button
                    onClick={handleProtectPDF}
                    disabled={isProtecting || !file || !password || !confirmPassword}
                    className="w-full"
                >
                    {isProtecting ? (
                        'Protecting...'
                    ) : (
                        <>
                            <Lock className="w-4 h-4 mr-2" />
                            Protect PDF
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
