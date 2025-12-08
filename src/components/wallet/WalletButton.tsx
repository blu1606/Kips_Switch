'use client';

import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const WalletButton: FC = () => {
    const { publicKey, disconnect, connecting } = useWallet();
    const { setVisible } = useWalletModal();

    const handleClick = () => {
        if (publicKey) {
            disconnect();
        } else {
            setVisible(true);
        }
    };

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    return (
        <button
            onClick={handleClick}
            disabled={connecting}
            className={`
        px-4 py-2 rounded-lg font-semibold transition-all duration-200
        ${publicKey
                    ? 'bg-dark-700 text-dark-200 hover:bg-dark-600 border border-dark-600'
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-500 hover:to-primary-600 shadow-lg shadow-primary-900/20'
                }
        ${connecting ? 'opacity-50 cursor-not-allowed' : ''}
      `}
        >
            {connecting ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Connecting...
                </span>
            ) : publicKey ? (
                <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {truncateAddress(publicKey.toBase58())}
                </span>
            ) : (
                'Connect Wallet'
            )}
        </button>
    );
};

export default WalletButton;
