'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "Can the developers see my secrets?",
        answer: "Absolutely not. All encryption happens client-side (in your browser) using your wallet's signature before any data is uploaded. We only store the encrypted \"gibberish\"."
    },
    {
        question: "What if I lose my wallet?",
        answer: "You can set a 'Delegate Wallet' (a secondary wallet you control) that has permission *only* to 'Ping' the vault to keep it from opening. It cannot access the funds."
    },
    {
        question: "Is this fully on-chain?",
        answer: "The logic (timers, triggers, ownership) is 100% on the Solana blockchain. Large encrypted files are stored on IPFS/Arweave (decentralized storage) with the hash anchors on-chain."
    },
    {
        question: "What happens if I forget to check in?",
        answer: "The protocol enters a 'Grace Period' (configurable). You can receive email notifications. If you still don't answer, the vault unlocks for your recipient."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 px-4 bg-dark-900/30">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="glass-panel rounded-2xl overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                            >
                                <span className="font-medium text-lg text-white">{faq.question}</span>
                                <span className={`transform transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-dark-300 leading-relaxed border-t border-white/5">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
