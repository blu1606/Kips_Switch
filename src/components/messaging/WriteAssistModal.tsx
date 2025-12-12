'use client';

import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WriteAssistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUseDraft: (draft: string) => void;
}

// Rich tone cards with emojis and color schemes
const TONE_CARDS = [
    { id: 'Sentimental', emoji: '😢', label: 'Sentimental', desc: 'Heartfelt & emotional', gradient: 'from-pink-500/20 to-purple-500/20', border: 'border-pink-500/50', glow: 'shadow-pink-500/30' },
    { id: 'Direct', emoji: '📝', label: 'Direct', desc: 'Clear & straightforward', gradient: 'from-blue-500/20 to-slate-500/20', border: 'border-blue-500/50', glow: 'shadow-blue-500/30' },
    { id: 'Humorous', emoji: '😎', label: 'Humorous', desc: 'Light & playful', gradient: 'from-orange-500/20 to-yellow-500/20', border: 'border-orange-500/50', glow: 'shadow-orange-500/30' },
    { id: 'Philosophical', emoji: '🌌', label: 'Philosophical', desc: 'Deep & reflective', gradient: 'from-indigo-500/20 to-violet-500/20', border: 'border-indigo-500/50', glow: 'shadow-indigo-500/30' },
    { id: 'Apologetic', emoji: '🙏', label: 'Apologetic', desc: 'Sincere & remorseful', gradient: 'from-red-500/20 to-rose-500/20', border: 'border-red-500/50', glow: 'shadow-red-500/30' },
];

// Typewriter hook for streaming effect
const useTypewriter = (text: string, speed: number = 20) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!text) {
            setDisplayedText('');
            return;
        }

        setIsTyping(true);
        setDisplayedText('');
        let index = 0;

        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1));
                index++;
            } else {
                setIsTyping(false);
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return { displayedText, isTyping };
};

export const WriteAssistModal: FC<WriteAssistModalProps> = ({ isOpen, onClose, onUseDraft }) => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [relation, setRelation] = useState('');
    const [sentiment, setSentiment] = useState('');
    const [tone, setTone] = useState('Sentimental');
    const [draft, setDraft] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Typewriter effect for the draft
    const { displayedText, isTyping } = useTypewriter(step === 4 ? draft : '', 18);

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
                {/* Breathing Gradient Background */}
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
                                    className="w-full bg-dark-900/80 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                                    onKeyDown={(e) => e.key === 'Enter' && relation && setStep(2)}
                                />
                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!relation}
                                        className="btn-primary px-6"
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
                                    className="w-full bg-dark-900/80 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                                />
                                <div className="flex justify-between pt-2">
                                    <button onClick={() => setStep(1)} className="text-dark-400 hover:text-white transition-colors">
                                        ← Back
                                    </button>
                                    <button
                                        onClick={() => setStep(3)}
                                        disabled={!sentiment}
                                        className="btn-primary px-6"
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
                                <div className="grid grid-cols-2 gap-3">
                                    {TONE_CARDS.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTone(t.id)}
                                            className={`group relative p-4 rounded-xl border text-left transition-all duration-300 ${tone === t.id
                                                    ? `bg-gradient-to-br ${t.gradient} ${t.border} shadow-lg ${t.glow}`
                                                    : 'bg-dark-900/50 border-dark-600 hover:border-dark-500'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className={`text-2xl transition-transform duration-300 ${tone === t.id ? 'scale-110' : 'group-hover:scale-110'
                                                    }`}>
                                                    {t.emoji}
                                                </span>
                                                <div>
                                                    <div className={`font-medium ${tone === t.id ? 'text-white' : 'text-dark-200'}`}>
                                                        {t.label}
                                                    </div>
                                                    <div className="text-[10px] text-dark-500 mt-0.5">
                                                        {t.desc}
                                                    </div>
                                                </div>
                                            </div>
                                            {tone === t.id && (
                                                <motion.div
                                                    layoutId="tone-check"
                                                    className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs"
                                                >
                                                    ✓
                                                </motion.div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between pt-4">
                                    <button onClick={() => setStep(2)} className="text-dark-400 hover:text-white transition-colors">
                                        ← Back
                                    </button>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isLoading}
                                        className="btn-primary relative overflow-hidden group"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Channeling...
                                            </span>
                                        ) : (
                                            <>
                                                <span className="relative z-10">✨ Generate Draft</span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </>
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
                                <div className="bg-gradient-to-br from-dark-900/80 to-dark-800/50 p-5 rounded-xl border border-dark-600 relative group">
                                    {/* Ambient glow */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-xl blur-sm opacity-50" />

                                    <div className="relative">
                                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => navigator.clipboard.writeText(draft)}
                                                className="p-2 bg-dark-800 rounded-lg hover:bg-dark-700 text-xs text-dark-400 hover:text-white transition-all"
                                                title="Copy to clipboard"
                                            >
                                                📋 Copy
                                            </button>
                                        </div>

                                        {/* Typewriter text with cursor */}
                                        <p className="text-white whitespace-pre-wrap leading-relaxed min-h-[120px] pr-16">
                                            {displayedText}
                                            {isTyping && (
                                                <span className="inline-block w-0.5 h-4 bg-primary-400 ml-0.5 animate-pulse" />
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleReset}
                                        className="flex-1 btn-secondary"
                                    >
                                        ↺ Try Again
                                    </button>
                                    <button
                                        onClick={() => onUseDraft(draft)}
                                        disabled={isTyping}
                                        className="flex-[2] btn-primary bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 disabled:opacity-50 shadow-lg shadow-primary-500/20"
                                    >
                                        {isTyping ? 'Writing...' : 'Use This Draft'}
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
