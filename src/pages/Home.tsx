import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    UploadCloud,
    FileText,
    Shield,
    Zap,
    PenTool
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';

import { usePDFStore } from '../store/usePDFStore';

export default function HomePage() {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const { actions } = usePDFStore();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                actions.setFile(file);
                navigate('/editor/local');
            } else {
                alert('Please upload a PDF file');
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === 'application/pdf') {
                actions.setFile(file);
                navigate('/editor/local');
            }
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans text-slate-900">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 flex items-center justify-between px-6 lg:px-12">
                <div className="flex items-center gap-2 font-bold text-xl text-primary-600">
                    <FileText className="w-6 h-6" />
                    <span>PDFPro</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
                    <a href="#pricing" className="hover:text-primary-600 transition-colors">Pricing</a>
                    <a href="#docs" className="hover:text-primary-600 transition-colors">Docs</a>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="hidden sm:flex">Log in</Button>
                    <Button size="sm">Sign up</Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 lg:px-12 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-200/30 rounded-full blur-3xl -z-10 animate-fade-in" />

                <div className="animate-slide-up">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Edit PDFs <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Like a Pro</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
                        The all-in-one platform for editing, converting, signing, and organizing your PDF documents.
                        Fast, secure, and powered by AI.
                    </p>
                </div>

                {/* Upload Zone */}
                <div
                    className={cn(
                        "w-full max-w-2xl bg-white rounded-2xl shadow-xl border-2 border-dashed transition-all duration-200 p-10 flex flex-col items-center justify-center cursor-pointer animate-slide-up delay-100",
                        isDragging ? "border-primary-500 bg-primary-50 scale-[1.02]" : "border-slate-200 hover:border-primary-400 hover:bg-slate-50"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => navigate('/editor/new')}
                >
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                        <UploadCloud className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Click to upload or drag and drop</h3>
                    <p className="text-slate-500 mb-6">PDF files, max 50MB</p>
                    <div className="flex gap-4">
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileSelect}
                        />
                        <Button onClick={() => document.getElementById('file-upload')?.click()}>Select File</Button>
                        <Button variant="secondary" onClick={(e: React.MouseEvent) => { e.stopPropagation(); navigate('/editor/sample'); }}>Try Sample Doc</Button>
                    </div>
                    <div className="mt-8 flex items-center gap-6 text-sm text-slate-400 font-medium">
                        <span>Google Drive</span>
                        <span>Dropbox</span>
                        <span>OneDrive</span>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-surface-50 px-6 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
                        <p className="text-slate-500">Powerful tools to help you work with documents.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <PenTool />, title: "Editor", desc: "Edit text and images directly in your PDF." },
                            { icon: <FileText />, title: "Forms", desc: "Fill out forms and sign documents digitally." },
                            { icon: <Zap />, title: "AI Tools", desc: "Summarize and chat with your documents using AI." },
                            { icon: <Shield />, title: "Security", desc: "Protect your PDFs with passwords and encryption." }
                        ].map((feature, i) => (
                            <Card key={i} className="p-6 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-slate-500 text-sm">{feature.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20 px-6 lg:px-12 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16 h-8">How it works</h2>
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Stub) */}
                        <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-slate-100 -z-10" />

                        {[
                            { step: 1, title: "Upload", desc: "Drag & drop your file." },
                            { step: 2, title: "Edit", desc: "Use our advanced tools." },
                            { step: 3, title: "Export", desc: "Download high-quality PDFs." }
                        ].map((item) => (
                            <div key={item.step} className="text-center bg-white">
                                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 border-4 border-white">
                                    {item.step}
                                </div>
                                <h3 className="font-semibold mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-slate-50 border-t border-slate-200 text-center text-slate-500 text-sm">
                <p>&copy; 2024 PDFPro Inc. All rights reserved.</p>
            </footer>
        </div>
    );
}
