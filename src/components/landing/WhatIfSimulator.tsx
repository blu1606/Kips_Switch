'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, Send } from 'lucide-react';

export default function WhatIfSimulator() {
    const [days, setDays] = useState(0);
    const [status, setStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');

    // Thresholds for the demo
    const WARNING_THRESHOLD = 30;
    const CRITICAL_THRESHOLD = 90;

    useEffect(() => {
        if (days < WARNING_THRESHOLD) setStatus('healthy');
        else if (days < CRITICAL_THRESHOLD) setStatus('warning');
        else setStatus('critical');
    }, [days]);

    const getStatusColor = () => {
        switch (status) {
            case 'healthy': return 'text-primary-400 border-primary-500/50 bg-primary-500/10';
            case 'warning': return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
            case 'critical': return 'text-red-400 border-red-500/50 bg-red-500/10';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'healthy': return 'You are safe. Vault is locked.';
            case 'warning': return 'Silence detected. Sending emails...';
            case 'critical': return 'Protocol Triggered. Assets Sent.';
        }
    };

    return (
        <section className="py-24 px-4 relative overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">See How It Works</h2>
                    <p className="text-dark-400">Drag the slider to simulate time passing without a check-in.</p>
                </div>

                <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 relative bg-dark-900/40">

                    {/* Status Display */}
                    <div className="flex flex-col items-center justify-center mb-16 min-h-[160px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={status}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className={`w-32 h-32 rounded-full flex items-center justify-center border-4 mb-6 ${getStatusColor()} backdrop-blur-xl transition-colors duration-500`}
                            >
                                {status === 'healthy' && <Activity className="w-12 h-12" />}
                                {status === 'warning' && <AlertTriangle className="w-12 h-12" />}
                                {status === 'critical' && <Send className="w-12 h-12" />}
                            </motion.div>
                        </AnimatePresence>

                        <div className="text-center">
                            <h3 className={`text-2xl font-bold mb-2 transition-colors duration-300 capitalize ${status === 'healthy' ? 'text-primary-400' :
                                    status === 'warning' ? 'text-amber-400' : 'text-red-400'
                                }`}>
                                {status.toUpperCase()}
                            </h3>
                            <p className="text-xl text-white font-medium">{getStatusText()}</p>
                        </div>
                    </div>

                    {/* Slider Control */}
                    <div className="relative pt-10 pb-4">
                        <div className="flex justify-between text-xs font-mono text-dark-400 mb-2 uppercase tracking-widest">
                            <span>Day 0</span>
                            <span>Day 30 (Warning)</span>
                            <span>Day 90 (Trigger)</span>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="120"
                            value={days}
                            onChange={(e) => setDays(parseInt(e.target.value))}
                            className="w-full h-4 bg-dark-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-dark-900 [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all"
                            style={{
                                background: `linear-gradient(to right, 
                                    rgb(74 222 128) 0%, 
                                    rgb(74 222 128) ${Math.min((days / 120) * 100, 25)}%, 
                                    rgb(251 191 36) 25%, 
                                    rgb(251 191 36) ${Math.min((days / 120) * 100, 75)}%, 
                                    rgb(248 113 113) 75%, 
                                    rgb(248 113 113) 100%)`
                            }}
                        />

                        <div
                            className="absolute top-0 transform -translate-x-1/2 bg-white text-dark-900 font-bold px-3 py-1 rounded-lg text-sm pointer-events-none transition-all duration-75"
                            style={{ left: `${(days / 120) * 100}%` }}
                        >
                            {days} Days
                        </div>
                    </div>

                    <div className="mt-8 text-center text-dark-500 text-sm italic">
                        *Thresholds are fully customizable when creating your vault.
                    </div>
                </div>
            </div>
        </section>
    );
}
