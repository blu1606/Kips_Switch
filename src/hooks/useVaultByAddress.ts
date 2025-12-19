import { useCallback } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Connection } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { parseVaultAccount, VaultData } from '@/utils/solanaParsers';

/**
 * Fetch a single vault by its PDA address using read-only RPC.
 * No wallet connection required.
 */
export function useVaultByAddress(address: string | null) {
    const { connection } = useConnection();

    const { data: vault = null, isLoading, error, refetch: queryRefetch } = useQuery({
        queryKey: ['vault', address, connection.rpcEndpoint],
        queryFn: async () => {
            if (!address) return null;

            const pubkey = new PublicKey(address);
            const accountInfo = await connection.getAccountInfo(pubkey);

            if (!accountInfo) {
                throw new Error('Vault not found');
            }

            return parseVaultAccount(pubkey, accountInfo.data as Buffer);
        },
        enabled: !!address,
        staleTime: 30 * 1000,
    });

    const refetch = useCallback(async () => {
        await queryRefetch();
    }, [queryRefetch]);

    return {
        vault,
        loading: isLoading,
        error: error instanceof Error ? error.message : error ? 'Failed to load vault' : null,
        refetch
    };
}

/**
 * Standalone function to fetch vault without React context.
 * Useful for server-side or direct calls.
 */
export async function fetchVaultByAddress(
    connection: Connection,
    address: string
): Promise<VaultData> {
    const pubkey = new PublicKey(address);
    const accountInfo = await connection.getAccountInfo(pubkey);

    if (!accountInfo) {
        throw new Error('Vault not found');
    }

    return parseVaultAccount(pubkey, accountInfo.data as Buffer);
}
