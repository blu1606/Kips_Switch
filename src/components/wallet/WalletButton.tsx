'use client';

import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet as useLazorkit } from '@lazorkit/wallet';
import { Fingerprint } from 'lucide-react';

const WalletButton: FC = () => {
    const { publicKey, disconnect, connecting } = useWallet();
    const { setVisible } = useWalletModal();
    const {
        smartWalletPubkey: lazorKey,
        connect: connectLazor,
        disconnect: disconnectLazor,
        isConnecting: lazorConnecting
    } = useLazorkit();

    const isLazor = !!lazorKey;
    const activeKey = lazorKey || publicKey;
    const isConnecting = connecting || lazorConnecting;

    const handleStandardClick = () => {
        if (publicKey) {
            disconnect();
        } else {
            if (isLazor) disconnectLazor();
            setVisible(true);
        }
    };

    const handleLazorClick = async () => {
        if (lazorKey) {
            disconnectLazor();
        } else {
            if (publicKey) disconnect();
            try {
                await connectLazor({ feeMode: 'paymaster' });
            } catch (err) {
                console.error('LazorKit connection failed:', err);
            }
        }
    };

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    return (
        <div className="flex items-center gap-2">
            {!activeKey && (
                <button
                    onClick={handleLazorClick}
                    disabled={isConnecting}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200
                        bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-500 hover:to-teal-600 
                        shadow-lg shadow-emerald-900/20 active:scale-95
                        ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    <Fingerprint className="w-4 h-4" />
                    <span className="hidden sm:inline">Biometric</span>
                </button>
            )}

            <button
                onClick={isLazor ? handleLazorClick : handleStandardClick}
                disabled={isConnecting}
                className={`
                    px-4 py-2 rounded-lg font-semibold transition-all duration-200
                    ${activeKey
                        ? 'bg-dark-700 text-dark-200 hover:bg-dark-600 border border-dark-600'
                        : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-500 hover:to-primary-600 shadow-lg shadow-primary-900/20'
                    }
                    ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                {isConnecting ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Connecting...
                    </span>
                ) : activeKey ? (
                    <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${isLazor ? 'bg-emerald-500' : 'bg-green-500'}`}></span>
                        {truncateAddress(activeKey.toBase58())}
                    </span>
                ) : (
                    'Wallet'
                )}
            </button>
        </div>
    );
};

export default WalletButton;
