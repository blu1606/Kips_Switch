'use client';

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WriteAssistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUseDraft: (draft: string) => void;
}

const TONES = ['Sentimental', 'Direct', 'Humorous', 'Philosophical', 'Apologetic'];

export const WriteAssistModal: FC<WriteAssistModalProps> = ({ isOpen, onClose, onUseDraft }) => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1:Relation, 2:Context, 3:Tone, 4:Result
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-dark-800 w-full max-w-lg rounded-2xl border border-dark-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">✨</span>
                        <div>
                            <h3 className="font-bold text-white">Ghostwriter AI</h3>
                            <p className="text-[10px] text-primary-400 font-mono flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                PRIVACY SEAL: EPHEMERAL PROCESSING ONLY
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-dark-400 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <label className="block text-sm font-medium text-dark-300">
                                    Who is this message for?
                                </label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={relation}
                                    onChange={(e) => setRelation(e.target.value)}
                                    placeholder="e.g. My Daughter, My Wife, My Best Friend..."
                                    className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                                    onKeyDown={(e) => e.key === 'Enter' && relation && setStep(2)}
                                />
                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!relation}
                                        className="btn-primary"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <label className="block text-sm font-medium text-dark-300">
                                    What is the key memory or sentiment?
                                </label>
                                <textarea
                                    autoFocus
                                    rows={3}
                                    value={sentiment}
                                    onChange={(e) => setSentiment(e.target.value)}
                                    placeholder="e.g. I'm proud of her career choice, or seeking forgiveness for..."
                                    className="w-full bg-dark-900 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors resize-none"
                                />
                                <div className="flex justify-between pt-2">
                                    <button onClick={() => setStep(1)} className="text-dark-400 hover:text-white">
                                        ← Back
                                    </button>
                                    <button
                                        onClick={() => setStep(3)}
                                        disabled={!sentiment}
                                        className="btn-primary"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <label className="block text-sm font-medium text-dark-300">
                                    Choose a Tone
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {TONES.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTone(t)}
                                            className={`p-3 rounded-lg border text-sm font-medium transition-all ${tone === t
                                                ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20'
                                                : 'bg-dark-900 border-dark-600 text-dark-300 hover:border-dark-500 hover:text-white'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between pt-4">
                                    <button onClick={() => setStep(2)} className="text-dark-400 hover:text-white">
                                        ← Back
                                    </button>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isLoading}
                                        className="btn-primary relative"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                Generating... <span className="animate-spin">⏳</span>
                                            </span>
                                        ) : (
                                            '✨ Generate Draft'
                                        )}
                                    </button>
                                </div>
                                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-4"
                            >
                                <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-600 relative group">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => navigator.clipboard.writeText(draft)}
                                            className="p-1.5 bg-dark-800 rounded-md hover:bg-dark-700 text-xs text-dark-400"
                                            title="Copy to clipboard"
                                        >
                                            📋
                                        </button>
                                    </div>
                                    <p className="text-white whitespace-pre-wrap leading-relaxed min-h-[100px]">
                                        {draft}
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleReset}
                                        className="flex-1 btn-secondary"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={() => onUseDraft(draft)}
                                        className="flex-[2] btn-primary bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500"
                                    >
                                        Use This Draft
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};
