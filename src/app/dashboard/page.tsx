'use client';

import { useState } from 'react';
import { useVault } from '@/hooks/useVault';
import WalletButton from '@/components/wallet/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';

export default function DashboardPage() {
    const { connected, publicKey } = useWallet();
    const { vault, status, loading, error, ping, refetch } = useVault();

    const [pinging, setPinging] = useState(false);
    const [pingError, setPingError] = useState<string | null>(null);
    const [pingSuccess, setPingSuccess] = useState(false);

    const handlePing = async () => {
        setPinging(true);
        setPingError(null);
        setPingSuccess(false);

        try {
            await ping();
            setPingSuccess(true);
            setTimeout(() => setPingSuccess(false), 3000);
        } catch (err: any) {
            console.error('Ping failed:', err);
            setPingError(err.message || 'Failed to check in');
        } finally {
            setPinging(false);
        }
    };

    const formatTimeRemaining = (seconds: number): string => {
        if (seconds <= 0) return 'Expired';

        const days = Math.floor(seconds / (24 * 60 * 60));
        const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((seconds % (60 * 60)) / 60);

        if (days > 0) return `${days}d ${hours}h remaining`;
        if (hours > 0) return `${hours}h ${minutes}m remaining`;
        return `${minutes}m remaining`;
    };

    const truncateAddress = (address: string): string => {
        return `${address.slice(0, 6)}...${address.slice(-6)}`;
    };

    if (!connected) {
        return (
            <main className="min-h-screen flex items-center justify-center pt-16">
                <div className="card text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
                    <p className="text-dark-400 mb-6">
                        Please connect your wallet to view your dashboard.
                    </p>
                    <WalletButton />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-20 pb-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-dark-400">Manage your vault</p>
                    </div>
                    <a href="/create" className="btn-primary">
                        + Create Vault
                    </a>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="card text-center py-12">
                        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-dark-400">Loading your vault...</p>
                    </div>
                ) : error ? (
                    <div className="card text-center py-12">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button onClick={refetch} className="btn-secondary">
                            Try Again
                        </button>
                    </div>
                ) : vault && status ? (
                    <div className="space-y-6">
                        {/* Vault Status Card */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold">Your Vault</h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${vault.isReleased
                                        ? 'bg-red-500/20 text-red-400'
                                        : status.isExpired
                                            ? 'bg-yellow-500/20 text-yellow-400'
                                            : 'bg-green-500/20 text-green-400'
                                    }`}>
                                    {vault.isReleased ? '🔓 Released' : status.isExpired ? '⚠️ Expired' : '🔒 Active'}
                                </span>
                            </div>

                            {/* Timer Progress */}
                            {!vault.isReleased && (
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-dark-400">Time until expiry</span>
                                        <span className={status.isExpired ? 'text-red-400' : 'text-white'}>
                                            {formatTimeRemaining(status.timeRemaining)}
                                        </span>
                                    </div>
                                    <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 rounded-full ${status.percentageRemaining > 50
                                                    ? 'bg-gradient-to-r from-green-500 to-green-400'
                                                    : status.percentageRemaining > 20
                                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                                                        : 'bg-gradient-to-r from-red-500 to-red-400'
                                                }`}
                                            style={{ width: `${Math.max(2, status.percentageRemaining)}%` }}
                                        />
                                    </div>
                                    <p className="text-dark-500 text-xs mt-2">
                                        Next check-in by: {status.nextCheckInDate.toLocaleString()}
                                    </p>
                                </div>
                            )}

                            {/* Vault Details */}
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-dark-800 rounded-lg p-4">
                                    <p className="text-dark-400 text-sm mb-1">Recipient</p>
                                    <p className="font-mono text-sm">
                                        {truncateAddress(vault.recipient.toBase58())}
                                    </p>
                                </div>
                                <div className="bg-dark-800 rounded-lg p-4">
                                    <p className="text-dark-400 text-sm mb-1">Check-in Interval</p>
                                    <p className="text-sm">
                                        {Math.floor(vault.timeInterval.toNumber() / (24 * 60 * 60))} days
                                    </p>
                                </div>
                                <div className="bg-dark-800 rounded-lg p-4 md:col-span-2">
                                    <p className="text-dark-400 text-sm mb-1">IPFS CID</p>
                                    <p className="font-mono text-xs break-all">{vault.ipfsCid}</p>
                                </div>
                            </div>

                            {/* Ping Button */}
                            {!vault.isReleased && (
                                <>
                                    {pingSuccess && (
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                                            <p className="text-green-400 text-sm flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Check-in successful! Timer reset.
                                            </p>
                                        </div>
                                    )}
                                    {pingError && (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                                            <p className="text-red-400 text-sm">{pingError}</p>
                                        </div>
                                    )}
                                    <button
                                        onClick={handlePing}
                                        disabled={pinging}
                                        className={`btn-primary w-full ${pinging ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {pinging ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Checking in...
                                            </span>
                                        ) : (
                                            '🔔 Check In Now'
                                        )}
                                    </button>
                                </>
                            )}

                            {vault.isReleased && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                                    <p className="text-red-400">
                                        This vault has been released. The recipient can now claim the contents.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="card text-center py-12">
                        <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Vault Found</h3>
                        <p className="text-dark-400 mb-6">
                            You haven&apos;t created a vault yet. Create one to secure your digital legacy.
                        </p>
                        <a href="/create" className="btn-primary">
                            Create Your First Vault
                        </a>
                    </div>
                )}
            </div>
        </main>
    );
}
