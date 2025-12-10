'use client';

import { motion } from 'framer-motion';

export default function ProblemSection() {
    return (
        <section className="py-32 px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-dark-900/50" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Visual: The Void of Lost Data */}
                    <div className="relative h-[400px] rounded-3xl overflow-hidden glass-panel flex items-center justify-center p-8">
                        <div className="text-center font-mono space-y-4 opacity-70">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 1, filter: 'blur(0px)' }}
                                    animate={{ opacity: 0, filter: 'blur(10px)' }}
                                    transition={{
                                        duration: 3,
                                        delay: i * 0.5,
                                        repeat: Infinity,
                                        repeatDelay: 1
                                    }}
                                    className="text-red-500/50 text-sm"
                                >
                                    0x{Math.random().toString(16).slice(2, 40)}...LOST
                                </motion.div>
                            ))}
                            <div className="text-5xl font-bold text-white mt-8 tracking-tighter">
                                $140B+
                            </div>
                            <p className="text-sm text-dark-400 uppercase tracking-widest">
                                Crypto Assets Lost Forever
                            </p>
                        </div>
                    </div>

                    {/* Copy: The Pain Point */}
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                        >
                            Satoshi&apos;s coins are lost forever. <span className="text-red-400">Yours don&apos;t have to be.</span>
                        </motion.h2>

                        <p className="text-xl text-dark-300 mb-8 leading-relaxed">
                            20% of all Bitcoin is trapped in lost wallets. Keys forgotten, drives corrupted, or owners passing away without a plan.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mt-1 text-red-400">✕</div>
                                <p className="text-dark-400">Your wife doesn&apos;t have your private keys. She gets $0.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mt-1 text-red-400">✕</div>
                                <p className="text-dark-400">Family members locked out of inheritance.</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mt-1 text-red-400">✕</div>
                                <p className="text-dark-400">Secrets die with their secrets holders.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
