'use client';

import { FC } from 'react';

interface EncryptionModeSelectorProps {
    mode: 'wallet' | 'password';
    onModeChange: (mode: 'wallet' | 'password') => void;
    password?: string;
    onPasswordChange?: (value: string) => void;
    confirmPassword?: string;
    onConfirmPasswordChange?: (value: string) => void;
    hint?: string;
    onHintChange?: (value: string) => void;
    onGenerateHint?: () => void;
    isGeneratingHint?: boolean;
}

export const EncryptionModeSelector: FC<EncryptionModeSelectorProps> = ({
    mode,
    onModeChange,
    password = '',
    onPasswordChange,
    confirmPassword = '',
    onConfirmPasswordChange,
    hint = '',
    onHintChange,
    onGenerateHint,
    isGeneratingHint = false,
}) => {
    return (
        <div className="bg-dark-800 p-4 rounded-xl border border-dark-700">
            <h3 className="font-medium text-white mb-3">🔒 Encryption Mode</h3>
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => onModeChange('wallet')}
                    className={`p-3 rounded-lg border text-left transition-all ${mode === 'wallet'
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
                    onClick={() => onModeChange('password')}
                    className={`p-3 rounded-lg border text-left transition-all ${mode === 'password'
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
            {mode === 'password' && (
                <div className="mt-4 space-y-3 animate-fade-in">
                    <div>
                        <label className="block text-xs text-dark-400 mb-1">Set Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => onPasswordChange?.(e.target.value)}
                            className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                            placeholder="Enter strong password"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-dark-400 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
                            className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                            placeholder="Repeat password"
                        />
                    </div>

                    {/* Password Hint */}
                    <div className="relative">
                        <label className="block text-xs text-dark-400 mb-1">Password Hint (Optional)</label>
                        <textarea
                            value={hint}
                            onChange={(e) => onHintChange?.(e.target.value)}
                            className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 font-normal min-h-[80px]"
                            placeholder="Type context here (e.g. 'The name of our first pet'), then click 'Auto-Generate' to turn it into a riddle."
                        />
                        <button
                            type="button"
                            onClick={onGenerateHint}
                            disabled={isGeneratingHint}
                            className="absolute right-2 bottom-2 text-xs bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                            {isGeneratingHint ? (
                                <div className="w-3 h-3 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <span>✨</span>
                            )}
                            Auto-Optimize
                        </button>
                    </div>
                    <p className="text-[10px] text-dark-500 mt-1">
                        This will be visible to the recipient <strong>before</strong> they decrypt. Do not put the password here.
                    </p>

                    <p className="text-xs text-yellow-500/80">
                        ⚠️ You must share this password with your recipient via another channel.
                    </p>
                </div>
            )}
        </div>
    );
};
