'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';

export default function VaultCard({ vault, onClaim }: { vault: any, onClaim: (vault: any) => void }) {
    const { publicKey } = useWallet();
    const isReleased = vault.isReleased;

    // Calculate status
    const now = Math.floor(Date.now() / 1000);
    const lastCheckIn = vault.lastCheckIn.toNumber();
    const interval = vault.timeInterval.toNumber();
    const expiry = lastCheckIn + interval;
    const isExpired = now > expiry;

    const status = isReleased
        ? { label: 'RELEASED', color: 'text-red-400', bg: 'bg-red-500/20' }
        : isExpired
            ? { label: 'PENDING RELEASE', color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
            : { label: 'LOCKED', color: 'text-green-400', bg: 'bg-green-500/20' };

    return (
        <div className="card hover:border-primary-500/50 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-lg">Legacy Vault</h3>
                    <p className="text-dark-400 text-xs font-mono mt-1">
                        From: {vault.owner.toBase58().slice(0, 8)}...
                    </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${status.color} ${status.bg}`}>
                    {status.label}
                </span>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Time until release</span>
                    <span className="font-mono">
                        {isExpired ? '0s' : `${Math.floor((expiry - now) / 86400)} days`}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Last Check-in</span>
                    <span className="text-white">
                        {new Date(lastCheckIn * 1000).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <button
                onClick={() => onClaim(vault)}
                disabled={!isReleased && !isExpired}
                className={`w-full py-2 rounded-lg font-medium transition-all ${isReleased || isExpired
                        ? 'btn-primary shadow-lg shadow-primary-500/20'
                        : 'bg-dark-700 text-dark-500 cursor-not-allowed'
                    }`}
            >
                {isReleased
                    ? '🔓 Decrypt & Claim'
                    : isExpired
                        ? '⚠️ Trigger Release'
                        : '🔒 Locked'}
            </button>
        </div>
    );
}
