import { FC } from 'react';
import { motion } from 'framer-motion';

interface StepRecipientProps {
    value: string;
    onChange: (value: string) => void;
    onNext: () => void;
}

export const StepRecipient: FC<StepRecipientProps> = ({ value, onChange, onNext }) => {
    return (
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
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="e.g. My Daughter, My Wife, My Best Friend..."
                className="w-full bg-dark-900/80 border border-dark-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && value && onNext()}
            />
            <div className="flex justify-end pt-2">
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
