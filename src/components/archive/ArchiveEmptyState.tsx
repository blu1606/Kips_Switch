'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ArchiveEmptyState: FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-800/50 to-dark-900/80 border border-dark-700/50 p-12 text-center"
        >
            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Ghost Kip Mascot */}
            <div className="relative z-10 mb-8">
                <motion.div
                    className="relative w-32 h-32 mx-auto"
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {/* Glowing Circle Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-500/20 to-purple-500/10 rounded-full blur-2xl" />

                    {/* Ghost Body */}
                    <motion.div
                        className="relative w-full h-full"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                            {/* Ghost Body */}
                            <path
                                d="M50 10 C25 10 15 35 15 55 L15 85 L25 75 L35 85 L50 75 L65 85 L75 75 L85 85 L85 55 C85 35 75 10 50 10 Z"
                                fill="url(#ghostGradient)"
                                className="opacity-80"
                            />
                            {/* Eyes */}
                            <circle cx="35" cy="45" r="6" fill="#0f172a" />
                            <circle cx="65" cy="45" r="6" fill="#0f172a" />
                            <circle cx="37" cy="43" r="2" fill="white" />
                            <circle cx="67" cy="43" r="2" fill="white" />
                            {/* Smile */}
                            <path d="M40 60 Q50 70 60 60" stroke="#0f172a" strokeWidth="3" fill="transparent" strokeLinecap="round" />

                            {/* Gradient Definition */}
                            <defs>
                                <linearGradient id="ghostGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#818cf8" />
                                    <stop offset="100%" stopColor="#6366f1" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>

                    {/* Floating Sparkles */}
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 text-primary-400"
                            style={{
                                left: `${20 + i * 15}%`,
                                top: `${10 + (i % 3) * 20}%`,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0, 1, 0],
                                scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.3,
                            }}
                        >
                            ✨
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Text Content */}
            <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-bold text-white">
                    Your Memory Vault Awaits
                </h3>
                <p className="text-dark-400 max-w-md mx-auto leading-relaxed">
                    No treasures here yet. When someone entrusts you with their legacy,
                    their vault will appear in this sacred space.
                </p>
            </div>

            {/* CTA Button */}
            <motion.div
                className="relative z-10 mt-8"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Link
                    href="/claim"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-shadow"
                >
                    <span>🔓</span>
                    Claim a Vault
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </Link>
            </motion.div>

            {/* Subtitle */}
            <p className="relative z-10 mt-6 text-xs text-dark-500">
                Already have a vault address? Go to the <Link href="/claim" className="text-primary-400 hover:underline">Claim page</Link> to unlock it.
            </p>
        </motion.div>
    );
};

export default ArchiveEmptyState;
