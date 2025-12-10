'use client';

import { FC, useState, useCallback } from 'react';
import { VaultFormData } from '@/types/vaultForm';
import { VaultItem } from '@/types/vaultBundle';
import VaultContentEditor from '@/components/vault/VaultContentEditor';
import { validatePassword } from '@/utils/validation';

interface Props {
    formData: VaultFormData;
    updateFormData: (updates: Partial<VaultFormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const StepUploadSecret: FC<Props> = ({ formData, updateFormData, onNext, onBack }) => {
    const [encryptionMode, setEncryptionMode] = useState<'wallet' | 'password'>(formData.encryptionMode || 'wallet');
    const [password, setPassword] = useState(formData.password || '');
    const [confirmPassword, setConfirmPassword] = useState(formData.password || '');
    const [passwordHint, setPasswordHint] = useState(formData.passwordHint || '');
    const [error, setError] = useState<string | null>(null);

    // Calculate content readiness based on bundle items
    const hasContent = (formData.bundleItems && formData.bundleItems.length > 0);

    const handleItemsChange = useCallback((newItems: VaultItem[]) => {
        updateFormData({
            bundleItems: newItems,
            // Clear legacy single-file fields
            file: null,
            encryptionMode: encryptionMode
        });
        if (newItems.length > 0) setError(null);
    }, [updateFormData, encryptionMode]);

    const handleContinue = () => {
        if (!hasContent) {
            setError('Please add at least one item to the vault.');
            return;
        }


        if (encryptionMode === 'password') {
            const pwdError = validatePassword(password, confirmPassword);
            if (pwdError) {
                setError(pwdError);
                return;
            }

            updateFormData({
                encryptionMode: 'password',
                password: password,
                passwordHint: passwordHint,
                aesKeyBase64: 'password-protected' // Placeholder
            });
        } else {
            updateFormData({
                encryptionMode: 'wallet',
                aesKeyBase64: 'wallet-protected',
                password: undefined
            });
        }

        onNext();
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-2">Add Content to Vault</h2>
                <p className="text-dark-400 text-sm">
                    Upload files, write notes, or add recordings. Everything will be bundled and encrypted together.
                </p>
            </div>

            {/* Multi-Media Editor */}
            <div className="bg-dark-800 rounded-xl border border-dark-700 p-4">
                <VaultContentEditor
                    items={formData.bundleItems || []}
                    onItemsChange={handleItemsChange}
                />
            </div>

            {/* Encryption Mode Toggle */}
            <div className="bg-dark-800 p-4 rounded-xl border border-dark-700">
                <h3 className="font-medium text-white mb-3">🔒 Encryption Mode</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setEncryptionMode('wallet')}
                        className={`p-3 rounded-lg border text-left transition-all ${encryptionMode === 'wallet'
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-dark-600 hover:border-dark-500'
                            }`}
                    >
                        <div className="font-medium">🔑 Wallet Mode</div>
                        <div className="text-xs text-dark-400 mt-1">
                            No password needed. Only recipient wallet can decrypt.
                        </div>
                    </button>
                    <button
                        onClick={() => setEncryptionMode('password')}
                        className={`p-3 rounded-lg border text-left transition-all ${encryptionMode === 'password'
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-dark-600 hover:border-dark-500'
                            }`}
                    >
                        <div className="font-medium">🔐 Password Mode</div>
                        <div className="text-xs text-dark-400 mt-1">
                            Encrypt with a custom password. Recipient needs this password.
                        </div>
                    </button>
                </div>

                {/* Password Input */}
                {encryptionMode === 'password' && (
                    <div className="mt-4 space-y-3 animate-fade-in">
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Set Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                                placeholder="Enter strong password"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                                placeholder="Repeat password"
                            />
                        </div>

                        {/* Password Hint */}
                        <div>
                            <label className="block text-xs text-dark-400 mb-1">Password Hint (Optional)</label>
                            <input
                                type="text"
                                value={passwordHint}
                                onChange={(e) => setPasswordHint(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 font-normal"
                                placeholder="E.g., Favorite childhood pet..."
                            />
                            <p className="text-[10px] text-dark-500 mt-1">
                                This will be visible to the recipient <strong>before</strong> they decrypt. Do not put the password here.
                            </p>
                        </div>

                        <p className="text-xs text-yellow-500/80">
                            ⚠️ You must share this password with your recipient via another channel.
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="flex gap-3 pt-4">
                <button onClick={onBack} className="btn-secondary">
                    ← Back
                </button>
                <button
                    onClick={handleContinue}
                    disabled={!hasContent || (encryptionMode === 'password' && (!password || password !== confirmPassword))}
                    className="flex-1 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary-500/20"
                >
                    {encryptionMode === 'wallet' ? 'Continue' : 'Set Password & Continue'}
                </button>
            </div>
        </div>
    );
};

export default StepUploadSecret;
