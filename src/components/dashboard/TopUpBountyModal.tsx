'use client';

import { FC, useState } from 'react';
import { PublicKey } from '@solana/web3.js';

interface TopUpBountyModalProps {
    vaultAddress: PublicKey;
    currentBounty: number; // in SOL
    onClose: () => void;
    onSuccess: () => void;
}

const TopUpBountyModal: FC<TopUpBountyModalProps> = ({ vaultAddress, currentBounty, onClose, onSuccess }) => {
    const [amount, setAmount] = useState<number>(0.05);
    const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    const handleTopUp = async () => {
        setStatus('processing');
        // Mock transaction for now
        setTimeout(() => {
            setStatus('success');
            setTimeout(onSuccess, 1500);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-dark-800 rounded-xl max-w-sm w-full p-6 border border-dark-700 shadow-2xl">
                <h2 className="text-xl font-bold mb-1">Top Up Bounty</h2>
                <p className="text-sm text-dark-400 mb-6">
                    Incentivize the network to trigger your vault.
                </p>

                {status === 'success' ? (
                    <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-6 text-center animate-fade-in">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">✓</span>
                        </div>
                        <h3 className="text-green-400 font-bold">Bounty Updated!</h3>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 space-y-4">
                            <div className="bg-dark-900 rounded-lg p-3 border border-dark-700">
                                <div className="text-xs text-dark-400 mb-1">Current Bounty</div>
                                <div className="font-mono text-lg text-white">{currentBounty} SOL</div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-dark-300 mb-2">
                                    Add Amount (SOL)
                                </label>
                                <div className="flex gap-2 mb-2">
                                    {[0.01, 0.05, 0.1].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setAmount(val)}
                                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${amount === val
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                                                }`}
                                        >
                                            +{val}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white font-mono"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={status === 'processing'}
                                className="flex-1 btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTopUp}
                                disabled={status === 'processing' || amount <= 0}
                                className="flex-1 btn-primary"
                            >
                                {status === 'processing' ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TopUpBountyModal;
