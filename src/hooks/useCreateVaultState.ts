import { useState, useCallback } from 'react';
import { VaultFormData } from '@/types/vaultForm';

const INITIAL_FORM_DATA: VaultFormData = {
    vaultName: '',
    bundleItems: [],
    file: null,
    encryptedBlob: null,
    aesKeyBase64: '',
    encryptionMode: 'wallet',
    recipientAddress: '',
    recipientEmail: '',
    timeInterval: 30 * 24 * 60 * 60, // Default 30 days
};

export const STEPS = [
    { id: 0, name: 'Template', description: 'Choose Mode' },
    { id: 1, name: 'Upload Secret', description: 'Encrypt your file' },
    { id: 2, name: 'Set Recipient', description: 'Who can claim' },
    { id: 3, name: 'Set Interval', description: 'Check-in period' },
    { id: 4, name: 'Confirm', description: 'Review & create' },
];

export function useCreateVaultState() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<VaultFormData>(INITIAL_FORM_DATA);

    const updateFormData = useCallback((updates: Partial<VaultFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    }, []);

    const nextStep = useCallback(() => {
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, []);

    const prevStep = useCallback(() => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    }, []);

    const goToStep = useCallback((step: number) => {
        if (step >= 0 && step < STEPS.length) {
            setCurrentStep(step);
        }
    }, []);

    const setTemplateInterval = useCallback((intervalSeconds: number) => {
        if (intervalSeconds > 0) {
            updateFormData({ timeInterval: intervalSeconds });
        }
        nextStep(); // Auto-advance after template selection
    }, [updateFormData, nextStep]);

    return {
        currentStep,
        formData,
        steps: STEPS,
        updateFormData,
        nextStep,
        prevStep,
        goToStep,
        setTemplateInterval
    };
}
