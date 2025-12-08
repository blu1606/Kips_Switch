'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const useCases = [
    {
        title: "The Protector",
        subtitle: "Crypto Inheritance",
        image: "/assets/glass-shield.png",
        desc: "Ensure your family inherits your portfolio without sharing private keys today. Assets transfer only when you're gone.",
        color: "from-blue-500/20 to-cyan-500/20",
        glow: "shadow-blue-500/20"
    },
    {
        title: "The Truth Teller",
        subtitle: "Whistleblower Insurance",
        image: "/assets/glass-eye.png",
        desc: "Protect yourself against silencing. Set a trigger to release sensitive information automatically if you don't check in.",
        color: "from-amber-500/20 to-red-500/20",
        glow: "shadow-amber-500/20"
    },
    {
        title: "The Sovereign",
        subtitle: "Self-Custody Backup",
        image: "/assets/glass-key.png",
        desc: "A fail-safe for your fail-safes. If you lose access to your primary wallet, your backup wallet automatically claims control.",
        color: "from-emerald-500/20 to-green-500/20",
        glow: "shadow-emerald-500/20"
    }
];

export default function UseCaseGrid() {
    return (
        <section className="py-24 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Every Scenario</h2>
                    <p className="text-dark-400">From family security to absolute sovereignty.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {useCases.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-all duration-300 flex flex-col items-center text-center"
                        >
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />

                            <div className="relative z-10 w-full flex flex-col items-center">
                                <div className="relative w-32 h-32 mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] mix-blend-screen">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                <div className="text-xs font-mono text-primary-400 uppercase tracking-widest mb-2">
                                    {item.subtitle}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-dark-300 leading-relaxed text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
