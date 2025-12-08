'use client';

import WalletButton from '@/components/wallet/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
    const { connected } = useWallet();

    return (
        <main className="min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                                Deadman&apos;s Switch
                            </span>
                        </div>
                        <WalletButton />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4">
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
                                <a href="/create" className="btn-primary text-lg px-8 py-3">
                                    Create Vault
                                </a>
                                <a href="/dashboard" className="btn-secondary text-lg px-8 py-3">
                                    Dashboard
                                </a>
                            </>
                        ) : (
                            <WalletButton />
                        )}
                        <a href="#how-it-works" className="btn-secondary text-lg px-8 py-3">
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="how-it-works" className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        How It Works
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Step 1 */}
                        <div className="card hover:border-primary-500/50 transition-all duration-300">
                            <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center mb-4">
                                <span className="text-2xl font-bold text-primary-400">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Create Your Vault</h3>
                            <p className="text-dark-400">
                                Upload your secret files, set a recipient wallet, and choose your check-in interval.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="card hover:border-primary-500/50 transition-all duration-300">
                            <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center mb-4">
                                <span className="text-2xl font-bold text-primary-400">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Regular Check-ins</h3>
                            <p className="text-dark-400">
                                Ping your vault regularly to prove you&apos;re still active. Simple one-click confirmation.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="card hover:border-primary-500/50 transition-all duration-300">
                            <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center mb-4">
                                <span className="text-2xl font-bold text-primary-400">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Automatic Release</h3>
                            <p className="text-dark-400">
                                If you miss check-ins, your recipient can claim and decrypt your vault contents.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4">
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
                    <p>Built on Solana • Open Source • Phase 1 MVP</p>
                </div>
            </footer>
        </main>
    );
}
