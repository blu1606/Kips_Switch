'use client';

import { useState, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { AnimatePresence, motion } from 'framer-motion';
import WalletButton from '@/components/wallet/WalletButton';
import ClaimedVaultCard from '@/components/archive/ClaimedVaultCard';
import ArchiveHero from '@/components/archive/ArchiveHero';
import ArchiveFilter, { SortOption, FilterType, ViewMode } from '@/components/archive/ArchiveFilter';
import ArchiveEmptyState from '@/components/archive/ArchiveEmptyState';
import { useClaimedVaults, ClaimedVaultRecord } from '@/hooks/useClaimedVaults';
import ClaimModal from '@/components/claim/ClaimModal';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export default function ArchivePage() {
    const { connected } = useWallet();
    const { vaults, loading, clearHistory, removeVault } = useClaimedVaults();

    // Filter & Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedVault, setSelectedVault] = useState<any | null>(null);

    // Filter and sort vaults
    const filteredVaults = useMemo(() => {
        let result = [...vaults];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(v =>
                v.name.toLowerCase().includes(query) ||
                v.senderAddress.toLowerCase().includes(query) ||
                (v.senderName && v.senderName.toLowerCase().includes(query))
            );
        }

        // Type filter
        if (filterType !== 'all') {
            const typeMap: Record<FilterType, string[]> = {
                all: [],
                notes: ['text'],
                audio: ['audio'],
                files: ['file', 'blob'],
                images: ['image'],
            };
            const allowedTypes = typeMap[filterType];
            result = result.filter(v =>
                v.contentSummary.types.some(t => allowedTypes.some(at => t.toLowerCase().includes(at)))
            );
        }

        // Sort
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => b.claimedAt - a.claimedAt);
                break;
            case 'oldest':
                result.sort((a, b) => a.claimedAt - b.claimedAt);
                break;
            case 'size':
                result.sort((a, b) => b.contentSummary.totalSize - a.contentSummary.totalSize);
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        return result;
    }, [vaults, searchQuery, sortBy, filterType]);

    // Reconstruct vault object for ClaimModal
    const handleView = (record: ClaimedVaultRecord) => {
        try {
            const vaultData = {
                publicKey: new PublicKey(record.address),
                owner: new PublicKey(record.senderAddress),
                recipient: new PublicKey(record.address),
                ipfsCid: record.ipfsCid,
                encryptedKey: record.encryptedKey,
                vaultSeed: new BN(record.vaultSeed, 'hex'),
                timeInterval: new BN(0),
                lastCheckIn: new BN(0),
                isReleased: true,
                bump: 0,
                bountyLamports: new BN(0),
                name: record.name
            };
            setSelectedVault(vaultData);
        } catch (err) {
            console.error('Failed to reconstruct vault data', err);
        }
    };

    const handleExport = (record: ClaimedVaultRecord) => {
        const data = JSON.stringify(record, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `archive-${record.name.replace(/\s+/g, '_')}-${record.claimedAt}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDelete = (address: string) => {
        removeVault(address);
    };

    // Not connected state
    if (!connected) {
        return (
            <main className="min-h-screen flex items-center justify-center pt-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 p-8 text-center max-w-md"
                >
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-purple-500/5 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary-500/20">
                            <span className="text-3xl">🔐</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-white">Connect Wallet</h2>
                        <p className="text-dark-400 mb-6 leading-relaxed">
                            Connect your wallet to access your personal vault archive and treasured memories.
                        </p>
                        <WalletButton />
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-20 pb-10 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                {vaults.length > 0 && <ArchiveHero vaults={vaults} />}

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative w-16 h-16 mb-6">
                            <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full" />
                            <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <p className="text-dark-400 animate-pulse">Loading your memories...</p>
                    </div>
                ) : vaults.length > 0 ? (
                    <>
                        {/* Filter Bar */}
                        <ArchiveFilter
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            filterType={filterType}
                            onFilterChange={setFilterType}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                        />

                        {/* Results Count */}
                        {searchQuery || filterType !== 'all' ? (
                            <p className="text-sm text-dark-500 mb-4">
                                Showing {filteredVaults.length} of {vaults.length} vaults
                            </p>
                        ) : null}

                        {/* Vault Grid/List */}
                        <AnimatePresence mode="popLayout">
                            {filteredVaults.length > 0 ? (
                                <motion.div
                                    layout
                                    className={viewMode === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                        : 'flex flex-col gap-3'
                                    }
                                >
                                    {filteredVaults.map((vault, index) => (
                                        <ClaimedVaultCard
                                            key={vault.address}
                                            vault={vault}
                                            onView={() => handleView(vault)}
                                            onExport={() => handleExport(vault)}
                                            onDelete={() => handleDelete(vault.address)}
                                            index={index}
                                            viewMode={viewMode}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12 bg-dark-800/30 rounded-xl border border-dark-700/50"
                                >
                                    <span className="text-4xl mb-4 block">🔍</span>
                                    <p className="text-dark-400">No vaults match your search.</p>
                                    <button
                                        onClick={() => { setSearchQuery(''); setFilterType('all'); }}
                                        className="mt-3 text-sm text-primary-400 hover:underline"
                                    >
                                        Clear filters
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Clear History */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-16 text-center"
                        >
                            <div className="inline-block px-4 py-2 bg-dark-800/30 rounded-full border border-dark-700/30">
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to clear your entire archive history? This cannot be undone.')) {
                                            clearHistory();
                                        }
                                    }}
                                    className="text-xs text-dark-500 hover:text-red-400 transition-colors flex items-center gap-2"
                                >
                                    <span>🗑️</span>
                                    Clear All History
                                </button>
                            </div>
                        </motion.div>
                    </>
                ) : (
                    /* Empty State */
                    <ArchiveEmptyState />
                )}

                {/* View Modal */}
                {selectedVault && (
                    <ClaimModal
                        vault={selectedVault}
                        onClose={() => setSelectedVault(null)}
                        onSuccess={() => {
                            // No-op for archive view
                        }}
                    />
                )}
            </div>
        </main>
    );
}
