'use client';

import { motion, AnimatePresence } from 'framer-motion';
import KipAvatar from '@/components/brand/KipAvatar';

type KipMood = 'neutral' | 'happy' | 'sad' | 'excited' | 'scared';

interface PaperMarioKipProps {
    mood: KipMood;
    className?: string;
}

export default function PaperMarioKip({ mood, className = '' }: PaperMarioKipProps) {
    // Map mood to KipAvatar props
    const getAvatarProps = (m: KipMood) => {
        switch (m) {
            case 'happy': return { health: 100, isCelebrating: true };
            case 'excited': return { health: 100, isCelebrating: true };
            case 'sad': return { health: 20 }; // Critical state looks sad/scared
            case 'scared': return { health: 10 };
            default: return { health: 100 };
        }
    };

    const avatarProps = getAvatarProps(mood);

    // Animation variants for the "Paper" effect
    // We want a slight parallax or "breathing" in Z-space
    const paperVariants = {
        idle: {
            y: [0, -15, 0],
            rotate: [0, 2, -2, 0],
            transition: {
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" as const }
            }
        },
        excited: {
            y: [0, -30, 0],
            rotate: [0, -10, 10, 0],
            scale: [1, 1.1, 1],
            transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse" as const }
        },
        scared: {
            x: [-5, 5, -5],
            y: [0, 5, 0],
            transition: { duration: 0.2, repeat: Infinity }
        }
    };

    const currentVariant = mood === 'excited' || mood === 'happy' ? 'excited' : mood === 'scared' || mood === 'sad' ? 'scared' : 'idle';

    return (
        <div className={`relative perspective-1000 ${className}`}>
            <div className="relative preserve-3d w-64 h-64 flex items-center justify-center">

                {/* 1. The Shadow (Ground Plane) */}
                <motion.div
                    className="absolute bottom-4 w-32 h-8 bg-black/20 rounded-[100%] blur-sm"
                    animate={{
                        scale: currentVariant === 'excited' ? [1, 0.8, 1] : [1, 1.2, 1],
                        opacity: currentVariant === 'excited' ? [0.2, 0.1, 0.2] : [0.2, 0.15, 0.2]
                    }}
                    style={{
                        transform: 'rotateX(70deg) translateZ(-50px)',
                        transformOrigin: 'center bottom'
                    }}
                    transition={{
                        duration: currentVariant === 'excited' ? 0.5 : 4,
                        repeat: Infinity,
                        ease: "easeInOut" as const
                    }}
                />

                {/* 2. The Body (Floating Plane) */}
                <motion.div
                    variants={paperVariants}
                    animate={currentVariant}
                    className="relative z-10"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* White Outline Effect (Paper Cutout) */}
                    <div className="absolute inset-[-4px] bg-white rounded-full opacity-0" />

                    <KipAvatar
                        seed="deadman-landing-hero"
                        size="xl"
                        {...avatarProps}
                        className="filter drop-shadow-2xl"
                        showGlow={false} // We handle our own glow/shadow
                    />

                    {/* Speech Bubble (Optional - for reactions) */}
                    <AnimatePresence>
                        {mood !== 'neutral' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0, y: 20, x: 20 }}
                                animate={{ opacity: 1, scale: 1, y: -20, x: 40 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="absolute -top-4 -right-12 bg-white text-dark-950 px-4 py-2 rounded-2xl rounded-bl-sm text-sm font-bold shadow-xl border-2 border-dark-900 pointer-events-none whitespace-nowrap z-20"
                            >
                                {mood === 'excited' && "Let's Go!"}
                                {mood === 'happy' && "Yipeed!"}
                                {mood === 'sad' && "Oh no..."}
                                {mood === 'scared' && "Don't do it!"}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
