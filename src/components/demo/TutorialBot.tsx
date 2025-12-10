'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { DemoState } from '@/hooks/useDemoVault';
import { useEffect, useState } from 'react';
import { KIP_MESSAGES, getRandomMessage } from '@/data/messages/kip';

interface TutorialBotProps {
    state: DemoState;
    timer: number;
    createStep?: number;
}

// Context-based expressions with colors for variety
const CONTEXT_CONFIG: Record<string, { expression: string; color: string; glow: string }> = {
    // CLAIMING states
    'CLAIMING': { expression: '◉‿◉', color: 'from-cyan-400 to-blue-500', glow: 'cyan' },

    // CREATING steps
    'CREATING_1': { expression: '✦‿✦', color: 'from-violet-400 to-purple-500', glow: 'violet' },
    'CREATING_2': { expression: '◠‿◠', color: 'from-amber-400 to-orange-500', glow: 'amber' },
    'CREATING_3': { expression: 'ಠ_ಠ', color: 'from-red-400 to-rose-500', glow: 'red' },
    'CREATING_4': { expression: '⌐■_■', color: 'from-blue-400 to-indigo-500', glow: 'blue' },
    'CREATING_5': { expression: '◕‿◕', color: 'from-green-400 to-emerald-500', glow: 'green' },

    // LIVE states
    'LIVE': { expression: '◠‿◠', color: 'from-emerald-400 to-green-500', glow: 'emerald' },
    'LIVE_LOW': { expression: '•︿•', color: 'from-yellow-400 to-amber-500', glow: 'yellow' },

    // Critical states
    'DYING': { expression: '>﹏<', color: 'from-red-500 to-rose-600', glow: 'red' },
    'RELEASED': { expression: '★‿★', color: 'from-fuchsia-400 to-pink-500', glow: 'pink' },
};

const getContextKey = (state: DemoState, timer: number, createStep: number): string => {
    if (state === 'CREATING') return `CREATING_${createStep}`;
    if (state === 'LIVE' && timer < 5) return 'LIVE_LOW';
    return state;
};


// Educational messages
const getKipMessage = (state: DemoState, timer: number, createStep: number) => {
    if (state === 'CREATING') {
        const stepKey = `STEP_${createStep}` as keyof typeof KIP_MESSAGES.CREATING;
        // Fallback if step is out of bounds
        if (!KIP_MESSAGES.CREATING[stepKey]) return "Setting up your vault...";

        return getRandomMessage('CREATING', stepKey);
    }

    if (state === 'LIVE' && timer <= 5 && timer > 0) {
        return `⚡ Hurry! Only ${timer}s left! Check in now or the protocol executes!`;
    }

    // Default states
    switch (state) {
        case 'IDLE': return getRandomMessage('IDLE');
        case 'CLAIMING': return getRandomMessage('CLAIMING');
        case 'LIVE': return getRandomMessage('LIVE', 'HEALTHY'); // Default health for demo
        case 'DYING': return getRandomMessage('DYING');
        case 'RELEASED': return getRandomMessage('RELEASED');
        default: return "System ready.";
    }
};


export default function TutorialBot({ state, timer, createStep = 1 }: TutorialBotProps) {
    const [currentMessage, setCurrentMessage] = useState(getKipMessage(state, timer, createStep));
    const contextKey = getContextKey(state, timer, createStep);
    const config = CONTEXT_CONFIG[contextKey] || CONTEXT_CONFIG['LIVE'];

    useEffect(() => {
        setCurrentMessage(getKipMessage(state, timer, createStep));
    }, [state, createStep, timer]);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 pb-6 px-4 pointer-events-none flex justify-center bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/80 to-transparent pt-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${state}-${createStep}`}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden w-full max-w-2xl"
                >
                    <div className="flex items-center gap-5 p-5">
                        {/* Kip Avatar - Contextual */}
                        <motion.div
                            className={`relative shrink-0 w-[72px] h-[72px] rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}
                            animate={{
                                scale: state === 'DYING' ? [1, 1.1, 1] : 1,
                                rotate: state === 'RELEASED' ? [0, -5, 5, 0] : 0
                            }}
                            transition={{
                                duration: state === 'DYING' ? 0.5 : 1,
                                repeat: state === 'DYING' ? Infinity : 0
                            }}
                            style={{
                                boxShadow: `0 0 20px rgba(var(--${config.glow}-rgb, 100,200,255), 0.4)`
                            }}
                        >
                            {/* Inner highlight */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                            <div className="absolute top-3 left-3 w-4 h-4 bg-white/40 rounded-full blur-[1px]" />

                            {/* Expression */}
                            <span className="text-white font-bold text-xl select-none z-10" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                {config.expression}
                            </span>

                            {/* Glow ring */}
                            <motion.div
                                className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.color} opacity-50 blur-md -z-10`}
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>

                        {/* Message Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">Kip Guide</span>
                                {state === 'CREATING' && (
                                    <span className="text-[10px] text-slate-500 font-mono">STEP {createStep}/5</span>
                                )}
                            </div>
                            <p className="text-sm md:text-base text-white leading-relaxed">
                                {currentMessage}
                            </p>
                        </div>
                    </div>

                    {/* Progress indicator for CREATING state */}
                    {state === 'CREATING' && (
                        <div className="h-1 bg-slate-800">
                            <motion.div
                                className={`h-full bg-gradient-to-r ${config.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(createStep / 5) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
