'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, Loader2, Download, RefreshCw, Sparkles } from 'lucide-react';
import NewspaperBorder from './NewspaperBorder';

export default function Blackification() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [transformedImage, setTransformedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError('Image must be less than 10MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            setUploadedImage(base64);
            setTransformedImage(null);
            setError(null);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    }, [handleFileSelect]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    }, [handleFileSelect]);

    const handleTransform = async () => {
        if (!uploadedImage) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/blackification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: uploadedImage })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to transform image');
            }

            if (data.transformedImage) {
                setTransformedImage(data.transformedImage);
            } else if (data.message) {
                // Grok returned analysis instead of transformed image
                setError(data.message);
            } else if (data.error) {
                setError(data.error);
            }
        } catch (err) {
            console.error('Transform error:', err);
            setError(err instanceof Error ? err.message : 'Failed to transform image');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setUploadedImage(null);
        setTransformedImage(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDownload = () => {
        if (!transformedImage) return;

        const link = document.createElement('a');
        link.href = transformedImage;
        link.download = 'blackification-result.png';
        link.click();
    };

    return (
        <NewspaperBorder title="Blackification">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Side - Photo Upload Area */}
                <div className="space-y-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="hidden"
                    />

                    {/* Upload Zone */}
                    {!uploadedImage ? (
                        <motion.div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`
                relative cursor-pointer border-[4px] border-dashed transition-all
                aspect-[4/3] flex flex-col items-center justify-center
                ${isDragOver
                                    ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10'
                                    : 'border-[var(--ink-black)] bg-[var(--paper-aged)] hover:bg-[var(--paper-cream)]'
                                }
              `}
                        >
                            <Upload size={48} className="mb-4 text-[var(--ink-faded)]" />
                            <p className="headline text-lg mb-2">UPLOAD YOUR PHOTO</p>
                            <p className="body-text text-sm text-[var(--ink-faded)] text-center px-4">
                                Drag & drop an image here, or click to browse
                            </p>
                            <p className="text-xs typewriter text-[var(--ink-faded)] mt-4">
                                Supports JPG, PNG, WebP (Max 10MB)
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {/* Before/After Comparison */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Original Image */}
                                <div className="relative">
                                    <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-[var(--ink-black)] text-[var(--paper-cream)] text-xs font-bold">
                                        BEFORE
                                    </div>
                                    <div className="border-[3px] border-[var(--ink-black)] overflow-hidden aspect-square">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={uploadedImage}
                                            alt="Original"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Transformed Image */}
                                <div className="relative">
                                    <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-[var(--accent-green)] text-white text-xs font-bold">
                                        AFTER
                                    </div>
                                    <div className="border-[3px] border-[var(--ink-black)] overflow-hidden aspect-square bg-[var(--paper-aged)]">
                                        {transformedImage ? (
                                            <div className="relative w-full h-full">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={transformedImage}
                                                    alt="Transformed"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                {isLoading ? (
                                                    <div className="text-center">
                                                        <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                                                        <p className="text-sm typewriter">Transforming...</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-center text-[var(--ink-faded)]">
                                                        <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                                                        <p className="text-sm">Click transform to see result</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <motion.button
                                    onClick={handleReset}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 border-[3px] border-[var(--ink-black)] bg-[var(--paper-cream)] hover:bg-[var(--paper-aged)] transition-colors"
                                >
                                    <RefreshCw size={18} />
                                    <span className="font-bold">Reset</span>
                                </motion.button>

                                {transformedImage && (
                                    <motion.button
                                        onClick={handleDownload}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 border-[3px] border-[var(--ink-black)] bg-[var(--accent-green)] text-white hover:bg-green-600 transition-colors"
                                    >
                                        <Download size={18} />
                                        <span className="font-bold">Download</span>
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-3 bg-red-100 border-2 border-red-500 text-red-700 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Side - Heading, Description, CTA */}
                <div className="flex flex-col justify-center space-y-6">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="headline text-4xl md:text-5xl lg:text-6xl mb-4"
                        >
                            BLACKIFICATION
                        </motion.h2>
                        <div className="w-24 h-1 bg-[var(--accent-gold)] mb-6"></div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="body-text text-lg leading-relaxed"
                    >
                        Ever wondered what you&apos;d look like a little more black? Upload your photo and let our AI work its magic. Warning: Results may cause extreme swag, uncontrollable confidence, and a sudden urge to say &quot;periodt&quot;.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="body-text text-base text-[var(--ink-faded)]"
                    >
                        Powered by advanced AI technology, your image is processed securely and the transformation happens in seconds.
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        {uploadedImage ? (
                            <motion.button
                                onClick={handleTransform}
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full md:w-auto px-8 py-4 bg-[var(--accent-gold)] text-[var(--ink-black)] border-[4px] border-[var(--ink-black)] font-bold text-lg flex items-center justify-center gap-3 hover:bg-[var(--ink-black)] hover:text-[var(--paper-cream)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ boxShadow: '6px 6px 0px var(--ink-black)' }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        TRANSFORMING...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={24} />
                                        TRANSFORM MY PHOTO
                                    </>
                                )}
                            </motion.button>
                        ) : (
                            <motion.button
                                onClick={() => fileInputRef.current?.click()}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full md:w-auto px-8 py-4 bg-[var(--accent-gold)] text-[var(--ink-black)] border-[4px] border-[var(--ink-black)] font-bold text-lg flex items-center justify-center gap-3 hover:bg-[var(--ink-black)] hover:text-[var(--paper-cream)] transition-colors"
                                style={{ boxShadow: '6px 6px 0px var(--ink-black)' }}
                            >
                                <Upload size={24} />
                                UPLOAD YOUR PHOTO
                            </motion.button>
                        )}
                    </motion.div>

                    {/* Features List */}
                    <div className="pt-6 border-t-2 border-dashed border-[var(--ink-faded)]">
                        <p className="typewriter text-xs text-[var(--ink-faded)] mb-3">★ FEATURES:</p>
                        <ul className="space-y-2 text-sm body-text">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full"></span>
                                AI-powered background transformation
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-[var(--accent-gold)] rounded-full"></span>
                                Instant processing
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-[var(--accent-red)] rounded-full"></span>
                                Download your creation
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </NewspaperBorder>
    );
}
