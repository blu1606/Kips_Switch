'use client';

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepRecipient } from './wizard/StepRecipient';
import { StepContext } from './wizard/StepContext';
import { StepTone } from './wizard/StepTone';
import { StepResult } from './wizard/StepResult';

// Reusable breathing background style
const BreathingBackground = () => (
    <>
        <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
                background: 'radial-gradient(ellipse at 30% 20%, rgba(139, 92, 246, 0.3), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(59, 130, 246, 0.2), transparent 50%)',
                animation: 'breathe 8s ease-in-out infinite',
            }}
        />
        <style jsx>{`
            @keyframes breathe {
                0%, 100% { 
                    opacity: 0.2;
                    transform: scale(1);
                }
                50% { 
                    opacity: 0.4;
                    transform: scale(1.05);
                }
            }
        `}</style>
    </>
);

interface WriteAssistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUseDraft: (draft: string) => void;
}

export const WriteAssistModal: FC<WriteAssistModalProps> = ({ isOpen, onClose, onUseDraft }) => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [relation, setRelation] = useState('');
    const [sentiment, setSentiment] = useState('');
    const [tone, setTone] = useState('Sentimental');
    const [draft, setDraft] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/ai/write-assist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ relation, sentiment, tone }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setDraft(data.draft);
            setStep(4);
        } catch (err) {
            setError('Failed to generate draft. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setStep(1);
        setDraft('');
        setError(null);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-dark-800 w-full max-w-lg rounded-2xl border border-dark-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <BreathingBackground />

                {/* Header */}
                <div className="relative p-4 border-b border-dark-700 flex justify-between items-center bg-dark-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-primary-500/30">
                            ✨
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Ghostwriter AI</h3>
                            <p className="text-[10px] text-primary-400 font-mono flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                PRIVACY SEAL: EPHEMERAL PROCESSING
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-lg bg-dark-700 hover:bg-dark-600 flex items-center justify-center text-dark-400 hover:text-white transition-all"
                    >
                        ✕
                    </button>
                </div>

                {/* Step Indicator */}
                <div className="relative px-6 pt-4">
                    <div className="flex items-center justify-between mb-2">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                    : 'bg-dark-700 text-dark-500'
                                    }`}>
                                    {s === 4 ? '✓' : s}
                                </div>
                                {s < 4 && (
                                    <div className={`w-12 h-0.5 mx-1 transition-colors ${step > s ? 'bg-primary-500' : 'bg-dark-700'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-dark-500 text-center">
                        {step === 1 && 'Recipient'}
                        {step === 2 && 'Context'}
                        {step === 3 && 'Tone'}
                        {step === 4 && 'Your Draft'}
                    </p>
                </div>

                {/* Content */}
                <div className="relative p-6 overflow-y-auto custom-scrollbar flex-1">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <StepRecipient
                                value={relation}
                                onChange={setRelation}
                                onNext={() => setStep(2)}
                            />
                        )}

                        {step === 2 && (
                            <StepContext
                                value={sentiment}
                                onChange={setSentiment}
                                onNext={() => setStep(3)}
                                onBack={() => setStep(1)}
                            />
                        )}

                        {step === 3 && (
                            <StepTone
                                value={tone}
                                onChange={setTone}
                                onGenerate={handleGenerate}
                                onBack={() => setStep(2)}
                                isLoading={isLoading}
                                error={error}
                            />
                        )}

                        {step === 4 && (
                            <StepResult
                                draft={draft}
                                onUse={(d) => { onUseDraft(d); handleClose(); }}
                                onRetry={handleReset}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};
