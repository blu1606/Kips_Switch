'use client';

import { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import StepUploadSecret from '@/components/wizard/StepUploadSecret';
import StepSetRecipient from '@/components/wizard/StepSetRecipient';
import StepSetInterval from '@/components/wizard/StepSetInterval';
import StepConfirm from '@/components/wizard/StepConfirm';
import TemplateSelector from '@/components/wizard/TemplateSelector';
import WalletButton from '@/components/wallet/WalletButton';
import { useCreateVaultState } from '@/hooks/useCreateVaultState';

export default function CreateVaultPage() {
    const { connected } = useWallet();
    const router = useRouter();

    // Use custom hook for state and logic
    const {
        currentStep,
        formData,
        steps: STEPS,
        updateFormData,
        nextStep,
        prevStep,
        setTemplateInterval
    } = useCreateVaultState();

    const handleSuccess = useCallback(() => {
        router.push('/dashboard');
    }, [router]);

    const handleBack = useCallback(() => {
        if (currentStep === 0) {
            router.push('/dashboard');
        } else {
            prevStep();
        }
    }, [currentStep, prevStep, router]);

    if (!connected) {
        return (
            <main className="min-h-screen flex items-center justify-center pt-16">
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
        <main className="min-h-screen pt-20 pb-10 px-4">
            <div className="container mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <button
                            onClick={handleBack}
                            className="text-dark-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className="text-3xl font-bold">
                            {STEPS.find(s => s.id === currentStep)?.name || 'Create Vault'}
                        </h1>
                    </div>
                    <p className="text-dark-400">Step {currentStep + 1} of {STEPS.length}</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-dark-800 rounded-full mb-8">
                    <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    />
                </div>

                {/* Content */}
                <div className="animate-fade-in">
                    {currentStep === 0 && (
                        <TemplateSelector onSelect={setTemplateInterval} />
                    )}
                    {currentStep === 1 && (
                        <StepUploadSecret
                            formData={formData}
                            updateFormData={updateFormData}
                            onNext={nextStep}
                            onBack={prevStep}
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
            </div>
        </main>
    );
}
