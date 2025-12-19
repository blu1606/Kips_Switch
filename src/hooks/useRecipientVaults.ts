import { useCallback } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useUnifiedWallet as useWallet } from '@/hooks/useUnifiedWallet';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
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

    const { data: vaults = [], isLoading, error, refetch: queryRefetch } = useQuery({
        queryKey: ['recipientVaults', publicKey?.toBase58()],
        queryFn: async () => {
            if (!publicKey) return [];

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

            const { parseVaultAccount } = await import('@/utils/solanaParsers');

            return accounts.map(acc => ({
                publicKey: acc.pubkey,
                account: parseVaultAccount(acc.pubkey, acc.account.data)
            }));
        },
        enabled: !!publicKey,
        staleTime: 60 * 1000, // 1 minute
    });

    const refetch = useCallback(async () => {
        await queryRefetch();
    }, [queryRefetch]);

    return {
        vaults,
        loading: isLoading,
        error: error instanceof Error ? error.message : error ? 'Failed to load vaults.' : null,
        refetch
    };
}
