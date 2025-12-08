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
    const [status, setStatus] = useState<'idle' | 'fetching' | 'decrypting' | 'viewing' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    // Decrypted Content State
    const [decryptedText, setDecryptedText] = useState<string | null>(null);
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null);

    const handleClaim = async () => {
        if (!password) { setError('Please enter password'); return; }

        setStatus('fetching');
        setError(null);
        setDecryptedText(null);
        setMediaUrl(null);

        try {
            // 1. Fetch from IPFS
            const encryptedBlob = await fetchFromIPFS(vault.ipfsCid);

            setStatus('decrypting');

            // 2. Parse package
            const packageText = await encryptedBlob.text();
            const pkg = JSON.parse(packageText);

            if (pkg.version === 2 && pkg.keyWrapper) {
                const wrapper: WrappedKeyData = pkg.keyWrapper;

                // 3. Unwrap Key
                const vaultKey = await unwrapKeyWithPassword(wrapper, password);

                // 4. Decrypt File
                const encryptedFile: EncryptedData = pkg.encryptedFile;
                const decryptedBlob = await import('@/utils/crypto').then(m => m.decryptFile(encryptedFile, vaultKey));

                // Set state for viewing
                setFileType(pkg.metadata.fileType);
                setFileName(pkg.metadata.fileName);
                setDownloadBlob(decryptedBlob);

                // Handle display based on type
                if (pkg.metadata.fileType.startsWith('text/')) {
                    const text = await decryptedBlob.text();
                    setDecryptedText(text);
                } else {
                    const url = URL.createObjectURL(decryptedBlob);
                    setMediaUrl(url);
                }

                setStatus('viewing');
                onSuccess();

            } else {
                throw new Error('Unsupported vault format.');
            }
        } catch (err: any) {
            console.error('Claim failed:', err);
            setStatus('error');
            setError(err.message || 'Decryption failed. Wrong password?');
        }
    };

    const downloadFile = () => {
        if (!downloadBlob) return;
        const url = URL.createObjectURL(downloadBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const closeViewer = () => {
        if (mediaUrl) URL.revokeObjectURL(mediaUrl);
        setMediaUrl(null);
        setDecryptedText(null);
        setDownloadBlob(null);
        setStatus('idle');
        onClose();
    };

    // RENDER CONTENT VIEWER
    if (status === 'viewing') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                <div className="bg-dark-800 rounded-xl max-w-2xl w-full p-6 border border-dark-700 shadow-2xl flex flex-col max-h-[90vh]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">🔓 Secret Revealed: {fileName}</h2>
                        <button onClick={closeViewer} className="text-dark-400 hover:text-white">✕</button>
                    </div>

                    <div className="flex-1 overflow-auto bg-dark-900 rounded-lg p-4 mb-4 border border-dark-600 min-h-[200px]">
                        {decryptedText !== null ? (
                            <pre className="whitespace-pre-wrap text-white font-mono text-sm">{decryptedText}</pre>
                        ) : mediaUrl ? (
                            fileType.startsWith('image/') ? (
                                <img src={mediaUrl} alt="Decrypted" className="max-w-full mx-auto" />
                            ) : fileType.startsWith('video/') ? (
                                <video src={mediaUrl} controls className="w-full" />
                            ) : fileType.startsWith('audio/') ? (
                                <audio src={mediaUrl} controls className="w-full mt-10" />
                            ) : (
                                <div className="text-center py-10 text-dark-400">
                                    Cannot preview this file type. Please download to view.
                                </div>
                            )
                        ) : null}
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <button onClick={closeViewer} className="btn-secondary flex-1">Close</button>
                        <button onClick={downloadFile} className="btn-primary flex-1">⬇️ Download File</button>
                    </div>
                </div>
            </div>
        );
    }

    // RENDER PASSWORD INPUT
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-dark-800 rounded-xl max-w-md w-full p-6 border border-dark-700 shadow-2xl">
                <h2 className="text-xl font-bold mb-4">Claim Legacy Vault</h2>

                <div className="mb-6">
                    <p className="text-dark-400 text-sm mb-4">
                        Enter the vault password to unlock and view the contents immediately.
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
                        {status === 'idle' || status === 'error' ? '🔓 Unlock & View' : (
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
