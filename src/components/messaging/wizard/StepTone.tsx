import { FC } from 'react';
import { motion } from 'framer-motion';
import { TONE_CARDS } from '@/constants/ai';

interface StepToneProps {
    value: string;
    onChange: (value: string) => void;
    onGenerate: () => void;
    onBack: () => void;
    isLoading: boolean;
    error: string | null;
}

export const StepTone: FC<StepToneProps> = ({ value, onChange, onGenerate, onBack, isLoading, error }) => {
    return (
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
                        onClick={() => onChange(t.id)}
                        className={`group relative p-4 rounded-xl border text-left transition-all duration-300 ${value === t.id
                            ? `bg-gradient-to-br ${t.gradient} ${t.border} shadow-lg ${t.glow}`
                            : 'bg-dark-900/50 border-dark-600 hover:border-dark-500'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <span className={`text-2xl transition-transform duration-300 ${value === t.id ? 'scale-110' : 'group-hover:scale-110'
                                }`}>
                                {t.emoji}
                            </span>
                            <div>
                                <div className={`font-medium ${value === t.id ? 'text-white' : 'text-dark-200'}`}>
                                    {t.label}
                                </div>
                                <div className="text-[10px] text-dark-500 mt-0.5">
                                    {t.desc}
                                </div>
                            </div>
                        </div>
                        {value === t.id && (
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
                <button onClick={onBack} className="text-dark-400 hover:text-white transition-colors">
                    ← Back
                </button>
                <button
                    onClick={onGenerate}
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
    );
};
