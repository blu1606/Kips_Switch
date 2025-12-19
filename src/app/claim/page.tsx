'use client';

import { useState } from 'react';
import { useUnifiedWallet as useWallet } from '@/hooks/useUnifiedWallet';
import WalletButton from '@/components/wallet/WalletButton';
import VaultCard from '@/components/claim/VaultCard';
import ClaimModal from '@/components/claim/ClaimModal';
import { useRecipientVaults } from '@/hooks/useRecipientVaults';

import { VaultData } from '@/utils/solanaParsers';

export default function ClaimPage() {
    const { connected } = useWallet();
    const { vaults, loading, error, refetch } = useRecipientVaults();

    const [selectedVault, setSelectedVault] = useState<VaultData | null>(null);

    if (!connected) {
        return (
            <main className="min-h-screen flex items-center justify-center pt-16">
                <div className="card text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
                    <p className="text-dark-400 mb-6">
                        Connect your wallet to see if anyone has left a digital legacy for you.
                    </p>
                    <WalletButton />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-20 pb-10 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Claim Legacies</h1>
                    <p className="text-dark-400">View and access vaults assigned to you.</p>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-dark-400">Searching for legacies...</p>
                    </div>
                ) : error ? (
                    <div className="card text-center py-12">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button onClick={refetch} className="btn-secondary">Try Again</button>
                    </div>
                ) : vaults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vaults.map((item) => (
                            <VaultCard
                                key={item.publicKey.toBase58()}
                                vault={item.account}
                                onClaim={() => setSelectedVault(item.account)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="card text-center py-12">
                        <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📭</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Legacies Found</h3>
                        <p className="text-dark-400">
                            We couldn&apos;t find any vaults assigned to your wallet address.
                        </p>
                    </div>
                )}

                {/* Claim Modal */}
                {selectedVault && (
                    <ClaimModal
                        vault={selectedVault}
                        onClose={() => setSelectedVault(null)}
                        onSuccess={() => {
                            // Optionally refresh or show success toast
                        }}
                    />
                )}
            </div>
        </main>
    );
}
