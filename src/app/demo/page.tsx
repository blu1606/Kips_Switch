'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useDemoVault } from '@/hooks/useDemoVault';
import TutorialBot from '@/components/demo/TutorialBot';
import DemoClaim from '@/components/demo/DemoClaim';
import DemoCreate from '@/components/demo/DemoCreate';
import DemoDashboard from '@/components/demo/DemoDashboard';

// Transition Overlay Component
function TransitionOverlay({ isVisible }: { isVisible: boolean }) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-dark-900/80 backdrop-blur-md flex flex-col items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center space-y-6"
                    >
                        {/* Animated Icon */}
                        <motion.div
                            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        >
                            <div className="w-16 h-16 rounded-full bg-dark-900 flex items-center justify-center">
                                <motion.span
                                    className="text-2xl"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    ⚡
                                </motion.span>
                            </div>
                        </motion.div>

                        <p className="text-lg font-medium text-white">Processing...</p>

                        {/* Progress Bar */}
                        <div className="w-64 h-2 bg-dark-800 rounded-full overflow-hidden mx-auto">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function DemoPage() {
    const {
        state,
        timer,
        maxTime,
        uploadedFile,
        createStep,
        isTransitioning,
        completeClaim,
        setUploadedFile,
        updateCreateStep,
        createVault,
        checkIn,
        fastForward
    } = useDemoVault();

    return (
        <main className="min-h-screen bg-[#0A0F1C] relative overflow-hidden flex flex-col">
            {/* Transition Overlay */}
            <TransitionOverlay isVisible={isTransitioning} />

            {/* Header */}
            <header className="p-6 flex items-center justify-between relative z-10">
                <Link href="/" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-mono text-amber-500">
                    TESTNET_SIMULATION_MODE
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 pb-32 relative z-10">
                <AnimatePresence mode="wait">
                    {state === 'CLAIMING' && (
                        <motion.div
                            key="claiming"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1, transition: { duration: 0.8 } }}
                            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.5 } }}
                            className="w-full"
                        >
                            <DemoClaim onClaim={completeClaim} />
                        </motion.div>
                    )}

                    {state === 'CREATING' && (
                        <motion.div
                            key="creating"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0, transition: { duration: 0.8 } }}
                            exit={{ opacity: 0, x: -50, transition: { duration: 0.5 } }}
                            className="w-full"
                        >
                            <DemoCreate
                                onCreate={createVault}
                                onFileUpload={setUploadedFile}
                                onStepChange={updateCreateStep}
                                uploadedFile={uploadedFile}
                            />
                        </motion.div>
                    )}

                    {(state === 'LIVE' || state === 'DYING' || state === 'RELEASED') && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="w-full"
                        >
                            <DemoDashboard
                                timer={timer}
                                maxTime={maxTime}
                                state={state}
                                onCheckIn={checkIn}
                                onFastForward={fastForward}
                                uploadedFile={uploadedFile}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bot Guide - Bottom Floating */}
            <TutorialBot state={state} timer={timer} createStep={createStep} />

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-500/5 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary-500/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>
        </main>
    );
}
