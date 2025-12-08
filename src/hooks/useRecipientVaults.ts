'use client';

import { useState, useCallback, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { PROGRAM_ID } from '@/utils/anchor';

// Reuse types from useVault, but tailored for lists
export interface VaultAccountData {
    publicKey: PublicKey;
    account: {
        owner: PublicKey;
        recipient: PublicKey;
        ipfsCid: string;
        encryptedKey: string;
        timeInterval: BN;
        lastCheckIn: BN;
        isReleased: boolean;
        bump: number;
    };
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

            const parsedVaults = accounts.map((acc) => {
                const data = acc.account.data;
                let offset = 8; // Discriminator

                const owner = new PublicKey(data.slice(offset, offset + 32));
                offset += 32;

                const recipient = new PublicKey(data.slice(offset, offset + 32));
                offset += 32;

                const ipfsCidLen = data.readUInt32LE(offset);
                offset += 4;
                const ipfsCid = data.slice(offset, offset + ipfsCidLen).toString('utf-8');
                offset += ipfsCidLen;

                const encryptedKeyLen = data.readUInt32LE(offset);
                offset += 4;
                const encryptedKey = data.slice(offset, offset + encryptedKeyLen).toString('utf-8');
                offset += encryptedKeyLen;

                const timeInterval = new BN(data.slice(offset, offset + 8), 'le');
                offset += 8;

                const lastCheckIn = new BN(data.slice(offset, offset + 8), 'le');
                offset += 8;

                const isReleased = data[offset] === 1;
                offset += 1; // bool

                const vaultSeed = new BN(data.slice(offset, offset + 8), 'le');
                offset += 8;

                const bump = data[offset];

                return {
                    publicKey: acc.pubkey,
                    account: {
                        owner,
                        recipient,
                        ipfsCid,
                        encryptedKey,
                        timeInterval,
                        lastCheckIn,
                        isReleased,
                        bump,
                    }
                };
            });

            setVaults(parsedVaults);
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
