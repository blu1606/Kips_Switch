'use client';

import Link from 'next/link';
import WalletButton from '@/components/wallet/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
    const { connected } = useWallet();

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="pt-16 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="animate-fade-in">
                        <h1 className="text-5xl sm:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent">
                                Secure Your Digital Legacy
                            </span>
                        </h1>
                        <p className="text-xl text-dark-300 mb-8 max-w-2xl mx-auto">
                            A decentralized dead man&apos;s switch protocol on Solana. Protect your secrets and ensure
                            they reach the right hands when you can&apos;t.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 animate-slide-up">
                        {connected ? (
                            <>
                                <Link href="/create" className="btn-primary text-lg px-8 py-3">
                                    🔒 Create Vault
                                </Link>
                                <Link href="/dashboard" className="btn-secondary text-lg px-8 py-3">
                                    📊 My Vaults
                                </Link>
                                <Link href="/claim" className="btn-secondary text-lg px-8 py-3">
                                    📥 Claim Legacies
                                </Link>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <WalletButton />
                                <p className="text-dark-500 text-sm">Connect wallet to get started</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Quick Actions for Connected Users */}
            {connected && (
                <section className="py-12 px-4 bg-dark-800/30">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Link href="/create" className="card hover:border-primary-500/50 transition-all group">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">🔐</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg group-hover:text-primary-400 transition-colors">
                                            Create a Vault
                                        </h3>
                                        <p className="text-dark-400 text-sm">
                                            Store encrypted secrets for your beneficiary
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/claim" className="card hover:border-green-500/50 transition-all group">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">📬</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg group-hover:text-green-400 transition-colors">
                                            Check for Legacies
                                        </h3>
                                        <p className="text-dark-400 text-sm">
                                            See if anyone left you a digital legacy
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* How It Works */}
            <section id="how-it-works" className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="card hover:border-primary-500/50 transition-all">
                            <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center mb-4">
                                <span className="text-2xl font-bold text-primary-400">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Create Your Vault</h3>
                            <p className="text-dark-400">
                                Upload secrets (files, text, voice, video), set a recipient and check-in interval.
                            </p>
                        </div>

                        <div className="card hover:border-primary-500/50 transition-all">
                            <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center mb-4">
                                <span className="text-2xl font-bold text-primary-400">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Regular Check-ins</h3>
                            <p className="text-dark-400">
                                Click &quot;Check In&quot; periodically to prove you&apos;re active. One-click, on-chain.
                            </p>
                        </div>

                        <div className="card hover:border-primary-500/50 transition-all">
                            <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center mb-4">
                                <span className="text-2xl font-bold text-primary-400">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Auto Release</h3>
                            <p className="text-dark-400">
                                Miss a check-in? Your recipient can claim and decrypt your vault with the password.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="card bg-gradient-to-r from-primary-900/30 to-dark-800/60 border-primary-700/30">
                        <div className="grid grid-cols-3 gap-8 text-center">
                            <div>
                                <p className="text-3xl font-bold text-primary-400">100%</p>
                                <p className="text-dark-400 text-sm">On-Chain</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary-400">E2E</p>
                                <p className="text-dark-400 text-sm">Encrypted</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary-400">Devnet</p>
                                <p className="text-dark-400 text-sm">Status</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-dark-700/50">
                <div className="max-w-6xl mx-auto text-center text-dark-500 text-sm">
                    <p>Built on Solana • Open Source • Phase 3 Complete</p>
                </div>
            </footer>
        </main>
    );
}
