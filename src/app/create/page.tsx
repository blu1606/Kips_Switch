import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import StepUploadSecret from '@/components/wizard/StepUploadSecret';
import StepSetRecipient from '@/components/wizard/StepSetRecipient';
import StepSetInterval from '@/components/wizard/StepSetInterval';
import StepConfirm from '@/components/wizard/StepConfirm';
import TemplateSelector from '@/components/wizard/TemplateSelector';
import TunnelLayout from '@/components/layout/TunnelLayout';
import WalletButton from '@/components/wallet/WalletButton';

export interface VaultFormData {
    // Step 1: File
    file: File | null;
    encryptedBlob: Blob | null;
    aesKeyBase64: string;

    // Encryption mode
    encryptionMode: 'password' | 'wallet';
    password?: string; // Only for password mode

    // Step 2: Recipient
    recipientAddress: string;
    recipientEmail: string;

    // Step 3: Interval
    timeInterval: number; // seconds
}

const STEPS = [
    { id: 0, name: 'Template', description: 'Choose Mode' },
    { id: 1, name: 'Upload Secret', description: 'Encrypt your file' },
    { id: 2, name: 'Set Recipient', description: 'Who can claim' },
    { id: 3, name: 'Set Interval', description: 'Check-in period' },
    { id: 4, name: 'Confirm', description: 'Review & create' },
];

export default function CreateVaultPage() {
    const { connected } = useWallet();
    const router = useRouter();

    // Start at Step 0 (Templates)
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<VaultFormData>({
        file: null,
        encryptedBlob: null,
        aesKeyBase64: '',
        encryptionMode: 'wallet', // Default to wallet mode (no password needed)
        recipientAddress: '',
        recipientEmail: '',
        timeInterval: 30 * 24 * 60 * 60, // 30 days default
    });

    const updateFormData = useCallback((updates: Partial<VaultFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    }, []);

    const nextStep = useCallback(() => {
        setCurrentStep((prev) => Math.min(prev + 1, 4));
    }, []);

    const prevStep = useCallback(() => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    }, []);

    // Handle Template Selection (Step 0)
    const handleTemplateSelect = useCallback((intervalSeconds: number) => {
        if (intervalSeconds > 0) {
            updateFormData({ timeInterval: intervalSeconds });
        }
        nextStep();
    }, [nextStep, updateFormData]);

    const handleSuccess = useCallback(() => {
        router.push('/dashboard');
    }, [router]);

    const handleExit = useCallback(() => {
        if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
            router.push('/dashboard');
        }
    }, [router]);

    if (!connected) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-dark-900">
                <div className="card text-center max-w-md border-dark-700 bg-dark-800">
                    <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
                    <p className="text-dark-400 mb-8">
                        Connect your wallet to start creating a secure vault protocol.
                    </p>
                    <div className="flex justify-center">
                        <WalletButton />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <TunnelLayout
            title={STEPS.find(s => s.id === currentStep)?.name || 'Create Vault'}
            step={currentStep}
            totalSteps={4}
            onExit={handleExit}
        >
            <div className="animate-fade-in">
                {currentStep === 0 && (
                    <TemplateSelector onSelect={handleTemplateSelect} />
                )}
                {currentStep === 1 && (
                    <StepUploadSecret
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={nextStep}
                    />
                )}
                {currentStep === 2 && (
                    <StepSetRecipient
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}
                {currentStep === 3 && (
                    <StepSetInterval
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}
                {currentStep === 4 && (
                    <StepConfirm
                        formData={formData}
                        onBack={prevStep}
                        onSuccess={handleSuccess}
                    />
                )}
            </div>
        </TunnelLayout>
    );
}
