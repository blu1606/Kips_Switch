'use client';

import { useState, useCallback, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import { PROGRAM_ID } from '@/utils/anchor';

import { VaultData } from '@/utils/solanaParsers';

// Reuse types from useVault, but tailored for lists
export interface VaultAccountData {
    publicKey: PublicKey;
    account: VaultData;
}

export function useRecipientVaults() {
    const { publicKey } = useWallet();
    const { connection } = useConnection();

    const [vaults, setVaults] = useState<VaultAccountData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVaults = useCallback(async () => {
        if (!publicKey) {
            setVaults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Direct raw account fetch with Memcmp filter
            // Recipient is at offset 8 (discriminator) + 32 (owner) = 40
            const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
                filters: [
                    {
                        memcmp: {
                            offset: 40,
                            bytes: publicKey.toBase58(),
                        },
                    },
                ],
            });



            // Wait for all parses (if lazy loaded) or just import top level.
            // Since we're inside the function, let's fix the import.
            // Actually, let's just use the import from top level.
            const { parseVaultAccount } = await import('@/utils/solanaParsers');

            const results = accounts.map(acc => ({
                publicKey: acc.pubkey,
                account: parseVaultAccount(acc.pubkey, acc.account.data)
            }));

            setVaults(results);
        } catch (err) {
            console.error('Failed to fetch recipient vaults:', err);
            setError('Failed to load vaults.');
        } finally {
            setLoading(false);
        }
    }, [publicKey, connection]);

    useEffect(() => {
        fetchVaults();
    }, [fetchVaults]);

    return { vaults, loading, error, refetch: fetchVaults };
}
