'use client';

import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useWallet as useLazorkit } from '@lazorkit/wallet';
import { useMemo } from 'react';
import { Transaction, VersionedTransaction } from '@solana/web3.js';

export const useUnifiedWallet = () => {
    const solanaWallet = useSolanaWallet();
    const {
        smartWalletPubkey,
        isConnected,
        isConnecting,
        disconnect: lazorDisconnect,
        signAndSendTransaction: lazorSendTx
    } = useLazorkit();

    const unifiedWallet = useMemo(() => {
        // If LazorKit is connected, it takes precedence
        if (smartWalletPubkey) {
            return {
                publicKey: smartWalletPubkey,
                connected: isConnected,
                connecting: isConnecting,
                disconnect: lazorDisconnect,
                isLazor: true,
                wallet: {
                    adapter: {
                        name: 'LazorKit',
                        icon: '/icon_1.png' // Fallback to app icon or specific lazor icon if available
                    }
                },
                // Adaptation for sending transactions
                async signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
                    return transaction;
                },
                async signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]> {
                    return transactions;
                },
                async sendTransaction(
                    transaction: Transaction | VersionedTransaction,
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    _connection: unknown, // Connection is handled by LazorkitProvider
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    _options?: unknown
                ) {
                    if (transaction instanceof Transaction) {
                        return await lazorSendTx({
                            instructions: transaction.instructions,
                        });
                    } else if (transaction instanceof VersionedTransaction) {
                        throw new Error('Versioned transactions not yet supported in Unified Hook for LazorKit');
                    }
                    throw new Error('Unsupported transaction type');
                }
            };
        }

        // Otherwise return standard wallet
        return {
            ...solanaWallet,
            isLazor: false,
        };
    }, [
        solanaWallet,
        smartWalletPubkey,
        isConnected,
        isConnecting,
        lazorDisconnect,
        lazorSendTx
    ]);

    return unifiedWallet;
};
