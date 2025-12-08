'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { unwrapKeyWithPassword, WrappedKeyData, EncryptedData } from '@/utils/crypto';
import { fetchFromIPFS } from '@/utils/ipfs';

interface ClaimModalProps {
    vault: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ClaimModal({ vault, onClose, onSuccess }: ClaimModalProps) {
    const { signMessage } = useWallet();
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'fetching' | 'decrypting' | 'downloading' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleClaim = async () => {
        if (!password) {
            setError('Please enter the vault password');
            return;
        }

        setStatus('fetching');
        setError(null);

        try {
            // 1. Fetch from IPFS
            console.log('Fetching from IPFS:', vault.ipfsCid);
            const encryptedBlob = await fetchFromIPFS(vault.ipfsCid);

            setStatus('decrypting');

            // 2. Parse package
            const packageText = await encryptedBlob.text();
            const pkg = JSON.parse(packageText);

            // Support for version 2 (Password Protected)
            if (pkg.version === 2 && pkg.keyWrapper) {
                const wrapper: WrappedKeyData = pkg.keyWrapper;

                // 3. Unwrap Key with Password
                console.log('Unwrapping key with password...');
                const vaultKey = await unwrapKeyWithPassword(wrapper, password);

                // 4. Decrypt File
                console.log('Decrypting file...');
                const encryptedFile: EncryptedData = pkg.encryptedFile;
                const decryptedBlob = await unwrapKeyWithPassword(wrapper, password).then(key =>
                    // We need a decryptFile function that takes EncryptedData and CryptoKey
                    // Wait, decryptVaultPackage handles imported key, we need lower level
                    import('@/utils/crypto').then(m => m.decryptFile(encryptedFile, key))
                );

                triggerDownload(decryptedBlob, pkg.metadata.fileName);
            } else {
                throw new Error('This vault uses an old format or is missing password protection.');
            }

            setStatus('downloading');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);

        } catch (err: any) {
            console.error('Claim failed:', err);
            setStatus('error');
            setError(err.message || 'Decryption failed. Wrong password?');
        }
    };

    const triggerDownload = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-dark-800 rounded-xl max-w-md w-full p-6 border border-dark-700 shadow-2xl">
                <h2 className="text-xl font-bold mb-4">Claim Legacy Vault</h2>

                <div className="mb-6">
                    <p className="text-dark-400 text-sm mb-4">
                        This vault is encrypted. Please enter the password provided by the owner to unlock it.
                    </p>

                    <label className="block text-xs font-medium text-dark-300 mb-1">Vault Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter password..."
                        disabled={status !== 'idle' && status !== 'error'}
                    />
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={status !== 'idle' && status !== 'error'}
                        className="flex-1 btn-secondary"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleClaim}
                        disabled={status !== 'idle' && status !== 'error'}
                        className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'idle' || status === 'error' ? '🔓 Unlock & Download' : (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {status === 'fetching' ? 'Downloading...' : 'Decrypting...'}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
