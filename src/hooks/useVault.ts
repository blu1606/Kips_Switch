'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { PROGRAM_ID, getVaultPDA } from '@/utils/anchor';

// Vault data structure matching on-chain account
export interface VaultData {
    owner: PublicKey;
    recipient: PublicKey;
    ipfsCid: string;
    encryptedKey: string;
    timeInterval: BN;
    lastCheckIn: BN;
    isReleased: boolean;
    bump: number;
}

export interface VaultStatus {
    isExpired: boolean;
    timeRemaining: number; // seconds
    percentageRemaining: number;
    nextCheckInDate: Date;
}

export interface UseVaultResult {
    vault: VaultData | null;
    status: VaultStatus | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    ping: () => Promise<string>;
}

export function useVault(): UseVaultResult {
    const { publicKey, signTransaction, signAllTransactions } = useWallet();
    const { connection } = useConnection();

    const [vault, setVault] = useState<VaultData | null>(null);
    const [status, setStatus] = useState<VaultStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const calculateStatus = useCallback((vaultData: VaultData): VaultStatus => {
        const now = Math.floor(Date.now() / 1000);
        const lastCheckIn = vaultData.lastCheckIn.toNumber();
        const interval = vaultData.timeInterval.toNumber();
        const expiryTime = lastCheckIn + interval;
        const timeRemaining = Math.max(0, expiryTime - now);
        const percentageRemaining = interval > 0 ? (timeRemaining / interval) * 100 : 0;

        return {
            isExpired: now > expiryTime,
            timeRemaining,
            percentageRemaining,
            nextCheckInDate: new Date(expiryTime * 1000),
        };
    }, []);

    const fetchVault = useCallback(async () => {
        if (!publicKey) {
            setVault(null);
            setStatus(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [vaultPda] = getVaultPDA(publicKey);
            const accountInfo = await connection.getAccountInfo(vaultPda);

            if (!accountInfo) {
                setVault(null);
                setStatus(null);
                setLoading(false);
                return;
            }

            // Parse vault data from account buffer
            // Account structure:
            // - 8 bytes: discriminator
            // - 32 bytes: owner
            // - 32 bytes: recipient
            // - 4 + len bytes: ipfs_cid (string)
            // - 4 + len bytes: encrypted_key (string)
            // - 8 bytes: time_interval
            // - 8 bytes: last_check_in
            // - 1 byte: is_released
            // - 1 byte: bump

            const data = accountInfo.data;
            let offset = 8; // Skip discriminator

            const owner = new PublicKey(data.slice(offset, offset + 32));
            offset += 32;

            const recipient = new PublicKey(data.slice(offset, offset + 32));
            offset += 32;

            // Read ipfs_cid string
            const ipfsCidLen = data.readUInt32LE(offset);
            offset += 4;
            const ipfsCid = data.slice(offset, offset + ipfsCidLen).toString('utf-8');
            offset += ipfsCidLen;

            // Read encrypted_key string
            const encryptedKeyLen = data.readUInt32LE(offset);
            offset += 4;
            const encryptedKey = data.slice(offset, offset + encryptedKeyLen).toString('utf-8');
            offset += encryptedKeyLen;

            // Read time_interval (i64)
            const timeInterval = new BN(data.slice(offset, offset + 8), 'le');
            offset += 8;

            // Read last_check_in (i64)
            const lastCheckIn = new BN(data.slice(offset, offset + 8), 'le');
            offset += 8;

            // Read is_released (bool)
            const isReleased = data[offset] === 1;
            offset += 1;

            // Read bump
            const bump = data[offset];

            const vaultData: VaultData = {
                owner,
                recipient,
                ipfsCid,
                encryptedKey,
                timeInterval,
                lastCheckIn,
                isReleased,
                bump,
            };

            setVault(vaultData);
            setStatus(calculateStatus(vaultData));
        } catch (err) {
            console.error('Failed to fetch vault:', err);
            setError('Failed to load vault data');
        } finally {
            setLoading(false);
        }
    }, [publicKey, connection, calculateStatus]);

    const ping = useCallback(async (): Promise<string> => {
        if (!publicKey || !signTransaction || !signAllTransactions) {
            throw new Error('Wallet not connected');
        }

        const provider = new AnchorProvider(
            connection,
            { publicKey, signTransaction, signAllTransactions },
            { commitment: 'confirmed' }
        );

        const [vaultPda] = getVaultPDA(publicKey);

        // Load IDL and create program
        const idl = await import('@/../../deadmans-switch/target/idl/deadmans_switch.json');
        const program = new Program(idl as any, provider);

        const tx = await (program.methods as any)
            .ping()
            .accounts({
                vault: vaultPda,
                owner: publicKey,
            })
            .rpc();

        // Refetch vault data after ping
        await fetchVault();

        return tx;
    }, [publicKey, signTransaction, signAllTransactions, connection, fetchVault]);

    useEffect(() => {
        fetchVault();
    }, [fetchVault]);

    // Update status every second
    useEffect(() => {
        if (!vault) return;

        const interval = setInterval(() => {
            setStatus(calculateStatus(vault));
        }, 1000);

        return () => clearInterval(interval);
    }, [vault, calculateStatus]);

    return {
        vault,
        status,
        loading,
        error,
        refetch: fetchVault,
        ping,
    };
}
