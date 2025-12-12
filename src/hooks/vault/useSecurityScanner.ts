import { useState } from 'react';
import { scanForSecrets, ScanResult } from '@/utils/safetyScanner';

interface SecurityAlertState {
    isOpen: boolean;
    result: ScanResult;
    fieldName: string;
}

export function useSecurityScanner() {
    const [securityAlert, setSecurityAlert] = useState<SecurityAlertState>({
        isOpen: false,
        result: { detected: false },
        fieldName: ''
    });

    const scanText = (text: string, fieldName: string) => {
        const result = scanForSecrets(text);
        if (result.detected) {
            setSecurityAlert({ isOpen: true, result, fieldName });
        }
    };

    const closeAlert = () => {
        setSecurityAlert(prev => ({ ...prev, isOpen: false }));
    };

    return {
        securityAlert,
        scanText,
        closeAlert
    };
}
