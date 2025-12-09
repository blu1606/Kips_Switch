'use client';

import { FC, ReactNode } from 'react';
import Link from 'next/link';

interface TunnelLayoutProps {
    children: ReactNode;
    title: string;
    step: number;
    totalSteps: number;
    onExit: () => void;
}

const TunnelLayout: FC<TunnelLayoutProps> = ({ children, title, step, totalSteps, onExit }) => {
    const progress = (step / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-dark-900 flex flex-col">
            {/* Minimal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-800 bg-dark-900/50 backdrop-blur-sm fixed top-0 w-full z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center font-bold text-white">
                        DS
                    </div>
                    <span className="font-mono text-sm text-dark-300 hidden md:inline-block">/ CREATE PROTOCOL</span>
                </div>

                <h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-white tracking-widest text-sm uppercase">
                    {title}
                </h1>

                <button
                    onClick={onExit}
                    className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-dark-800"
                >
                    <span>Exit</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Main Content Area - Centered */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-16">
                <div className="w-full max-w-2xl animate-fade-in-up">
                    {children}
                </div>
            </main>

            {/* Progress Bar (Bottom) */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-dark-800">
                <div
                    className="h-full bg-primary-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(var(--primary-500),0.5)]"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default TunnelLayout;
