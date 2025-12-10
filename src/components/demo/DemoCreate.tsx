'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Upload, User, Clock, Shield, AlertTriangle, Loader2, FileText, Image as ImageIcon, File } from 'lucide-react';
import Image from 'next/image';
import { UploadedFileInfo } from '@/hooks/useDemoVault';

interface DemoCreateProps {
    onCreate: (params: { email: string; amount: string; asset: string; duration: number }) => void;
    onFileUpload: (file: File) => void;
    onStepChange: (step: number) => void;
    uploadedFile: UploadedFileInfo | null;
}

const TOTAL_STEPS = 5;

export default function DemoCreate({ onCreate, onFileUpload, onStepChange, uploadedFile }: DemoCreateProps) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [duration] = useState(10); // Seconds for demo

    const progress = (step / TOTAL_STEPS) * 100;

    const handleNext = () => {
        if (step < TOTAL_STEPS) {
            const newStep = step + 1;
            setStep(newStep);
            onStepChange(newStep);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            const newStep = step - 1;
            setStep(newStep);
            onStepChange(newStep);
        }
    };

    const handleSubmit = () => {
        setIsLoading(true);
        setTimeout(() => {
            onCreate({ email: email || 'demo@example.com', amount: '100', asset: 'USDC', duration });
        }, 1500);
    };

    // File handling
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            onFileUpload(file);
        }
    }, [onFileUpload]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    }, [onFileUpload]);

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8" />;
        if (type.startsWith('text/')) return <FileText className="w-8 h-8" />;
        return <File className="w-8 h-8" />;
    };

    const stepTitles: Record<number, string> = {
        1: 'Upload Secret',
        2: 'Set Beneficiary',
        3: 'Security Protocol',
        4: 'Set Timer',
        5: 'Deploy Vault',
    };

    return (
        <div className="fixed inset-0 z-[100] bg-dark-900 overflow-y-auto overflow-x-hidden flex flex-col overscroll-none">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-800 bg-dark-900/50 backdrop-blur-sm fixed top-0 w-full z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-bold text-white">
                        DS
                    </div>
                    <span className="font-mono text-sm text-dark-300 hidden md:inline-block">/ CREATE VAULT</span>
                </div>

                <h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-white tracking-widest text-sm uppercase">
                    {stepTitles[step]}
                </h1>

                <span className="text-xs font-mono text-dark-400">STEP {step}/{TOTAL_STEPS}</span>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-16">
                <div className="w-full max-w-xl animate-fade-in-up">
                    <AnimatePresence mode="wait">
                        {/* Step 1: File Upload */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center mx-auto mb-4">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Upload Your Secret</h2>
                                    <p className="text-dark-400 mt-2">This will be encrypted with AES-256 - military grade.</p>
                                </div>

                                {/* Drag & Drop Zone */}
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    className={`
                                        border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
                                        ${isDragging ? 'border-primary-500 bg-primary-500/10' : 'border-dark-600 hover:border-dark-500'}
                                        ${uploadedFile ? 'border-green-500/50 bg-green-500/5' : ''}
                                    `}
                                >
                                    {uploadedFile ? (
                                        <div className="space-y-4">
                                            <div className="w-16 h-16 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                                                {getFileIcon(uploadedFile.type)}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{uploadedFile.name}</p>
                                                <p className="text-dark-400 text-sm">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                            {uploadedFile.type.startsWith('image/') && (
                                                <Image
                                                    src={uploadedFile.dataUrl}
                                                    alt="Preview"
                                                    width={200}
                                                    height={200}
                                                    className="max-h-32 w-auto mx-auto rounded-lg object-contain"
                                                    unoptimized
                                                />
                                            )}
                                            <p className="text-green-400 text-sm">✓ Ready to encrypt</p>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <div className="w-16 h-16 rounded-xl bg-dark-700 text-dark-400 flex items-center justify-center mx-auto mb-4">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <p className="text-white font-medium">Drop file here or click to browse</p>
                                            <p className="text-dark-500 text-sm mt-1">Images, text, documents - anything</p>
                                        </label>
                                    )}
                                </div>

                                {/* Security Note */}
                                <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 text-center">
                                    <p className="text-primary-400 text-sm">
                                        🔐 Your file will be encrypted locally before upload. Even we can&apos;t read it.
                                    </p>
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={!uploadedFile}
                                    className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    Continue <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Beneficiary */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Who Inherits This?</h2>
                                    <p className="text-dark-400 mt-2">The decryption key is locked in a smart contract. Only they can unlock it.</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-dark-300 uppercase tracking-wider">
                                        Recipient Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="someone@example.com"
                                        className="w-full bg-dark-800 border border-dark-600 rounded-xl px-4 py-4 text-white text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-dark-500"
                                    />
                                    <p className="text-xs text-dark-500">
                                        They receive the key ONLY after the timer expires. Trustless. Automatic.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleBack} className="flex-1 btn-secondary py-4">Back</button>
                                    <button onClick={handleNext} className="flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-2">
                                        Continue <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Anti-Theft */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 animate-pulse">
                                        <Shield className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Anti-Theft Protocol</h2>
                                    <p className="text-dark-400 mt-2">What if someone forces you to check in?</p>
                                </div>

                                <div className="bg-gradient-to-br from-red-900/30 to-dark-800/50 border border-red-500/30 rounded-2xl p-6 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-1">
                                            <AlertTriangle className="w-5 h-5 text-red-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">Silent Alarm (Duress Mode)</h3>
                                            <p className="text-dark-300 text-sm mt-1 leading-relaxed">
                                                Hold the check-in button for <strong className="text-red-400">5 seconds</strong> instead of the normal tap.
                                            </p>
                                            <ul className="mt-4 space-y-2 text-sm text-dark-400">
                                                <li className="flex items-center gap-2">
                                                    <span className="text-green-400">✓</span> Timer resets (attacker sees nothing suspicious)
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="text-green-400">✓</span> Secret alert sent to emergency contacts
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <span className="text-green-400">✓</span> Location & timestamp recorded securely
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleBack} className="flex-1 btn-secondary py-4">Back</button>
                                    <button onClick={handleNext} className="flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-2">
                                        Got It <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Timer */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
                                        <Clock className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">The Deadman&apos;s Switch</h2>
                                    <p className="text-dark-400 mt-2">If you don&apos;t check in, the vault opens automatically.</p>
                                </div>

                                <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6 text-center">
                                    <p className="text-dark-400 text-sm mb-4">Demo Timer (Real vaults: 30-365 days)</p>
                                    <div className="text-6xl font-mono font-bold text-white mb-2">
                                        {duration}s
                                    </div>
                                    <p className="text-dark-500 text-xs">
                                        Pure trustless protocol. No company. No admin. Just code.
                                    </p>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                                    <p className="text-blue-400 text-sm text-center">
                                        ⛓️ Powered by Solana blockchain - immutable and unstoppable.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleBack} className="flex-1 btn-secondary py-4">Back</button>
                                    <button onClick={handleNext} className="flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-2">
                                        Continue <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 5: Review & Deploy */}
                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4">
                                        🚀
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Ready to Deploy</h2>
                                    <p className="text-dark-400 mt-2">Your vault will be created on-chain.</p>
                                </div>

                                <div className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6 space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-dark-700">
                                        <span className="text-dark-400">Secret File</span>
                                        <span className="text-white font-medium truncate max-w-[200px]">{uploadedFile?.name || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-dark-700">
                                        <span className="text-dark-400">Encryption</span>
                                        <span className="text-green-400 font-mono">AES-256-GCM</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-dark-700">
                                        <span className="text-dark-400">Beneficiary</span>
                                        <span className="text-white font-medium truncate max-w-[200px]">{email || 'demo@example.com'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-dark-700">
                                        <span className="text-dark-400">Timer</span>
                                        <span className="text-white font-mono font-bold">{duration}s (demo)</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-dark-400">Network</span>
                                        <span className="text-primary-400 font-mono">Solana Devnet</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleBack} className="flex-1 btn-secondary py-4" disabled={isLoading}>Back</button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Deploying...</>
                                        ) : (
                                            <>🚀 Deploy Vault</>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Progress Bar */}
            <div className="fixed bottom-0 left-0 w-full h-1.5 bg-dark-800">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary-600 to-primary-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}
