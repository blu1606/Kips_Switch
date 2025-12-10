'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import VaultCard from '@/components/claim/VaultCard';
import VaultSafe from '@/components/claim/VaultSafe';

interface DemoClaimProps {
    onClaim: () => void;
}

// Mock Data - using well-known valid Solana addresses 
// System Program and Token Program IDs are valid 32-byte base58 keys
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MOCK_VAULT_DATA: any = {
    publicKey: new PublicKey('11111111111111111111111111111111'), // System Program (valid)
    owner: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // Token Program (valid)
    name: 'Classified Mission Assets',
    lastCheckIn: new BN(Math.floor(Date.now() / 1000) - 3600), // 1 hour ago
    timeInterval: new BN(60), // 1 minute interval (expired)
    isReleased: true,
    createdAt: new BN(Math.floor(Date.now() / 1000) - 86400 * 30), // 1 month ago
    ipfsCid: 'QmDemoHash123',
    encryptedKey: 'wallet:mock-seed',
    vaultSeed: Buffer.from('mock-seed'),
    lockedLamports: new BN(0),
    lockedTokens: new BN(0)
};

type RevealState = 'input' | 'unlocking' | 'message' | 'assets';

export default function DemoClaim({ onClaim }: DemoClaimProps) {
    const [showModal, setShowModal] = useState(false);

    // Modal State
    const [revealState, setRevealState] = useState<RevealState>('input');
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const [showContinue, setShowContinue] = useState(false);

    const message = "Congratulations agent.\n\nIf you are reading this, I have been compromised. I managed to secure the operational funds before going dark.\n\nThese assets are now yours. Use them to establish your own Deadman's Switch and continue the mission.\n\nTrust no one.\n\n- 007";

    const handleStartClaim = () => {
        setShowModal(true);
    };

    const handleUnlock = () => {
        setRevealState('unlocking');
        setIsDecrypting(true);

        // Simulate decryption delay
        setTimeout(() => {
            setIsDecrypting(false);
            setRevealState('message');
        }, 2500);
    };

    // Typewriter effect
    useEffect(() => {
        if (revealState === 'message') {
            let index = 0;
            setDisplayedText('');
            const interval = setInterval(() => {
                if (index < message.length) {
                    setDisplayedText(prev => prev + message[index]);
                    index++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => setShowContinue(true), 500);
                }
            }, 30);
            return () => clearInterval(interval);
        }
    }, [revealState]);

    const handleContinue = () => {
        setRevealState('assets');
    };

    const handleFinish = () => {
        setShowModal(false);
        onClaim(); // Move to next step
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex items-center justify-center min-h-[500px]">
            {/* The Vault Card (Trigger) */}
            <div className="w-full max-w-sm">
                <VaultCard
                    vault={MOCK_VAULT_DATA}
                    onClaim={handleStartClaim}
                />
            </div>

            {/* Simulated Claim Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-dark-800 rounded-2xl max-w-2xl w-full border border-dark-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Header */}
                            {(revealState === 'input' || revealState === 'assets') && (
                                <div className="flex justify-between items-center p-6 border-b border-dark-700">
                                    <h2 className="text-xl font-bold text-white">
                                        {revealState === 'input' ? '🔐 Claim Legacy Vault' : '🔓 Mission Assets'}
                                    </h2>
                                </div>
                            )}

                            {/* Content Area */}
                            <div className="flex-1 overflow-auto p-6">
                                <AnimatePresence mode="wait">
                                    {/* INPUT STATE */}
                                    {revealState === 'input' && (
                                        <motion.div
                                            key="input"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className="mb-8 text-center">
                                                <VaultSafe state="locked" />
                                                <p className="mt-6 text-dark-300">
                                                    This vault is protected by biometric encryption.
                                                </p>
                                            </div>

                                            <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 text-center mb-6">
                                                <div className="text-3xl mb-2">🔑</div>
                                                <p className="text-primary-400 font-medium">Clearance Verified</p>
                                                <p className="text-dark-400 text-sm mt-1">
                                                    Protocol override accepted. You may proceed.
                                                </p>
                                            </div>

                                            <button onClick={handleUnlock} className="w-full btn-primary py-4 text-lg">
                                                🔓 Decrypt Vault
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* UNLOCKING STATE */}
                                    {revealState === 'unlocking' && (
                                        <motion.div
                                            key="unlocking"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center py-8"
                                        >
                                            <VaultSafe state={isDecrypting ? 'unlocking' : 'open'} />
                                            <motion.p
                                                className="mt-6 text-primary-400 font-mono text-sm uppercase tracking-wider"
                                                animate={{ opacity: [1, 0.5, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                            >
                                                DECRYPTING SECRETS...
                                            </motion.p>
                                        </motion.div>
                                    )}

                                    {/* MESSAGE STATE */}
                                    {revealState === 'message' && (
                                        <motion.div
                                            key="message"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center"
                                        >
                                            <div className="mb-6">
                                                <div className="text-4xl mb-3">💌</div>
                                                <h3 className="text-lg font-light text-dark-300 italic">
                                                    Decoding message...
                                                </h3>
                                            </div>

                                            <div className="bg-dark-900/80 backdrop-blur-md border border-dark-600 rounded-2xl p-6 mb-6 min-h-[150px] text-left">
                                                <p className="text-white font-mono leading-relaxed whitespace-pre-wrap">
                                                    {displayedText}
                                                    {!showContinue && (
                                                        <span className="inline-block w-2 H-4 bg-primary-400 ml-1 animate-pulse">_</span>
                                                    )}
                                                </p>
                                            </div>

                                            {showContinue && (
                                                <motion.button
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    onClick={handleContinue}
                                                    className="btn-primary px-8 py-3"
                                                >
                                                    Access Assets →
                                                </motion.button>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* ASSETS STATE */}
                                    {revealState === 'assets' && (
                                        <motion.div
                                            key="assets"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center"
                                        >
                                            <div className="bg-dark-900/50 rounded-xl p-8 border border-dark-700 mb-8">
                                                <div className="text-5xl mb-4">💰</div>
                                                <h3 className="text-3xl font-bold text-white mb-2">100 USDC</h3>
                                                <p className="text-dark-400">Recovered Funds</p>
                                            </div>

                                            <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl mb-6 text-green-400 text-sm">
                                                ✅ Assets successfully transferred to your temporary wallet.
                                            </div>

                                            <button onClick={handleFinish} className="w-full btn-primary py-4 text-lg">
                                                Next: Secure Your Funds →
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
