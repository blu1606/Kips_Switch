import { FC } from 'react';
import { motion } from 'framer-motion';
import { useTypewriter } from '@/hooks/useTypewriter';

interface StepResultProps {
    draft: string;
    onUse: (draft: string) => void;
    onRetry: () => void;
}

export const StepResult: FC<StepResultProps> = ({ draft, onUse, onRetry }) => {
    // Typewriter effect triggered when this component mounts/receives draft
    const { displayedText, isTyping } = useTypewriter(draft, 18);

    return (
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
                    onClick={onRetry}
                    className="flex-1 btn-secondary"
                >
                    ↺ Try Again
                </button>
                <button
                    onClick={() => onUse(draft)}
                    disabled={isTyping}
                    className="flex-[2] btn-primary bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 disabled:opacity-50 shadow-lg shadow-primary-500/20"
                >
                    {isTyping ? 'Writing...' : 'Use This Draft'}
                </button>
            </div>
        </motion.div>
    );
};
