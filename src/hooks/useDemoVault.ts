import { useState, useEffect, useCallback } from 'react';

export type DemoState = 'IDLE' | 'CLAIMING' | 'CREATING' | 'LIVE' | 'DYING' | 'RELEASED';

export interface UploadedFileInfo {
    name: string;
    type: string;
    size: number;
    dataUrl: string;
}

export interface DemoVault {
    state: DemoState;
    timer: number;
    maxTime: number;
    recipientParams: {
        email: string;
        amount: string;
        asset: string;
    } | null;
    uploadedFile: UploadedFileInfo | null;
    createStep: number;
    isTransitioning: boolean;
}

// Transition duration in ms (for loading bar visibility)
const TRANSITION_DURATION = 3000;

export function useDemoVault() {
    const [state, setState] = useState<DemoState>('CLAIMING');
    const [timer, setTimer] = useState<number>(0);
    const [maxTime, setMaxTime] = useState<number>(10);
    const [recipientParams, setRecipientParams] = useState<DemoVault['recipientParams']>(null);
    const [uploadedFile, setUploadedFileState] = useState<UploadedFileInfo | null>(null);
    const [createStep, setCreateStep] = useState<number>(1);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (state === 'LIVE' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        setState('DYING');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (state === 'DYING') {
            // Show transition, then go to RELEASED
            setIsTransitioning(true);
            interval = setTimeout(() => {
                setIsTransitioning(false);
                setState('RELEASED');
            }, TRANSITION_DURATION);
        }

        return () => clearInterval(interval);
    }, [state, timer]);

    const startDemo = useCallback(() => {
        setState('CLAIMING');
    }, []);

    const completeClaim = useCallback(() => {
        // Show transition bar while changing state
        setIsTransitioning(true);
        setTimeout(() => {
            setIsTransitioning(false);
            setState('CREATING');
            setCreateStep(1);
        }, TRANSITION_DURATION);
    }, []);

    const setUploadedFile = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            setUploadedFileState({
                name: file.name,
                type: file.type,
                size: file.size,
                dataUrl: reader.result as string
            });
        };
        reader.readAsDataURL(file);
    }, []);

    const updateCreateStep = useCallback((step: number) => {
        setCreateStep(step);
    }, []);

    const createVault = useCallback((params: { email: string; amount: string; asset: string; duration: number }) => {
        setRecipientParams({
            email: params.email,
            amount: params.amount,
            asset: params.asset
        });
        setMaxTime(params.duration);

        // Show transition bar
        setIsTransitioning(true);
        setTimeout(() => {
            setIsTransitioning(false);
            setTimer(params.duration);
            setState('LIVE');
        }, TRANSITION_DURATION);
    }, []);

    const checkIn = useCallback(() => {
        if (state === 'LIVE') {
            setTimer(maxTime);
        }
    }, [state, maxTime]);

    const fastForward = useCallback(() => {
        if (state === 'LIVE') {
            setTimer(0);
            setState('DYING');
        }
    }, [state]);

    const resetDemo = useCallback(() => {
        setState('IDLE');
        setTimer(0);
        setRecipientParams(null);
        setUploadedFileState(null);
        setCreateStep(1);
        setIsTransitioning(false);
    }, []);

    return {
        state,
        timer,
        maxTime,
        recipientParams,
        uploadedFile,
        createStep,
        isTransitioning,
        startDemo,
        completeClaim,
        setUploadedFile,
        updateCreateStep,
        createVault,
        checkIn,
        fastForward,
        resetDemo
    };
}
