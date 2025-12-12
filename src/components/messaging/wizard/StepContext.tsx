import { FC } from 'react';
import { motion } from 'framer-motion';

interface StepContextProps {
    value: string;
    onChange: (value: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export const StepContext: FC<StepContextProps> = ({ value, onChange, onNext, onBack }) => {
    return (
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
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="e.g. I'm proud of her career choice, or seeking forgiveness for..."
                className="w-full bg-dark-900/80 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
            />
            <div className="flex justify-between pt-2">
                <button onClick={onBack} className="text-dark-400 hover:text-white transition-colors">
                    ← Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!value}
                    className="btn-primary px-6"
                >
                    Next →
                </button>
            </div>
        </motion.div>
    );
};
