'use client';

import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClaimedVaultRecord } from '@/hooks/useClaimedVaults';
import { formatFileSize } from '@/utils/vaultBundle';

interface ArchiveHeroProps {
    vaults: ClaimedVaultRecord[];
}

const ArchiveHero: FC<ArchiveHeroProps> = ({ vaults }) => {
    // Fix SSR Hydration: Generate particles only on client
    const [particles, setParticles] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([]);

    useEffect(() => {
        setParticles([...Array(20)].map(() => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
        })));
    }, []);

    const totalVaults = vaults.length;
    const totalSize = vaults.reduce((acc, v) => acc + (v.contentSummary?.totalSize || 0), 0);
    const oldestVault = vaults.length > 0
        ? new Date(Math.min(...vaults.map(v => v.claimedAt))).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : null;

    return (
        <div className="relative overflow-hidden rounded-2xl mb-8">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-dark-900 to-purple-900/20">
                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {particles.map((p, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-primary-400/30 rounded-full"
                            style={{
                                left: `${p.left}%`,
                                top: `${p.top}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                                duration: p.duration,
                                repeat: Infinity,
                                delay: p.delay,
                            }}
                        />
                    ))}
                </div>

                {/* Gradient Orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 px-8 py-10">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/30 rounded-full text-xs text-primary-400 mb-4">
                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                        Digital Memory Vault
                    </div>
                    <h1
                        className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-primary-200 to-purple-200 bg-clip-text text-transparent"
                        style={{ WebkitBackgroundClip: 'text' }}
                    >
                        Your Treasured Legacies
                    </h1>
                    <p className="text-dark-400 max-w-md mx-auto">
                        A sanctuary for memories passed down through time. Each vault holds a piece of someone&apos;s heart.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-6"
                >
                    {/* Total Vaults */}
                    <div className="flex items-center gap-3 px-5 py-3 bg-dark-800/50 backdrop-blur-sm rounded-xl border border-dark-700/50">
                        <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-xl">📦</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{totalVaults}</p>
                            <p className="text-xs text-dark-400">Vaults Claimed</p>
                        </div>
                    </div>

                    {/* Total Size */}
                    <div className="flex items-center gap-3 px-5 py-3 bg-dark-800/50 backdrop-blur-sm rounded-xl border border-dark-700/50">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-xl">💾</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{formatFileSize(totalSize)}</p>
                            <p className="text-xs text-dark-400">Memories Stored</p>
                        </div>
                    </div>

                    {/* Since Date */}
                    {oldestVault && (
                        <div className="flex items-center gap-3 px-5 py-3 bg-dark-800/50 backdrop-blur-sm rounded-xl border border-dark-700/50">
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-xl">🕐</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{oldestVault}</p>
                                <p className="text-xs text-dark-400">First Memory</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ArchiveHero;
