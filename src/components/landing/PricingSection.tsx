'use client';

import { motion } from 'framer-motion';
import { Gift, Shield, Crown, Check } from 'lucide-react';

const plans = [
    {
        name: 'Free',
        price: '$0',
        description: 'Try the protocol.',
        features: [
            '3 Active Vaults',
            'AES-256 Encryption',
            '7-365 Day Timers',
            'Kip Companion',
        ],
        cta: 'Start Free',
        featured: false,
        icon: Gift,
        color: 'from-blue-500/10 to-transparent',
        border: 'border-dark-700'
    },
    {
        name: 'Legacy+',
        price: '$49/year',
        description: 'For serious digital estates.',
        features: [
            'Unlimited Vaults',
            'Gasless Claim for Recipients',
            'Video Messages (Up to 100MB)',
            'Priority Email Reminders',
            'Silent Alarm (Duress Mode)',
        ],
        cta: 'Upgrade Now',
        featured: true,
        icon: Shield,
        color: 'from-primary-500/10 to-transparent',
        border: 'border-primary-500/50'
    },
    {
        name: 'Guardian',
        price: '1 SOL (Lifetime)',
        description: 'The ultimate safety net.',
        features: [
            'Everything in Legacy+',
            'Guardian Key Sharding (3-Key)',
            'Founder\'s Badge NFT',
            'Early Access to Features',
        ],
        cta: 'Become a Founder',
        featured: false,
        icon: Crown,
        color: 'from-amber-500/10 to-transparent',
        border: 'border-amber-500/30'
    },
];

export default function PricingSection() {
    return (
        <section className="py-24 px-4 relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Legacy</h2>
                    <p className="text-dark-400">Start free. Upgrade when you&apos;re serious.</p>
                </div>

                {/* Grid */}
                <div className="grid lg:grid-cols-3 gap-6 relative z-10">
                    {plans.map((plan, idx) => {
                        const Icon = plan.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`glass-panel p-8 rounded-3xl relative overflow-hidden flex flex-col ${plan.border} ${plan.featured ? 'shadow-lg shadow-primary-500/10' : ''}`}
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-b ${plan.color} pointer-events-none`} />

                                {/* Header */}
                                <div className="relative z-10 mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-dark-800/50 flex items-center justify-center mb-6 border border-dark-700">
                                        <Icon className="w-6 h-6 text-dark-200" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-3xl font-bold text-white">{plan.price}</span>
                                        {plan.name === 'Legacy+' && <span className="text-sm text-dark-400"></span>}
                                    </div>
                                    <p className="text-dark-400 text-sm">{plan.description}</p>
                                </div>

                                {/* Features */}
                                <div className="relative z-10 flex-grow space-y-4 mb-8">
                                    {plan.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-start gap-3 text-sm text-dark-300">
                                            <Check className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <div className="relative z-10 mt-auto">
                                    <button
                                        className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${plan.featured
                                            ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                                            : 'bg-dark-800 hover:bg-dark-700 text-white border border-dark-700'
                                            }`}
                                    >
                                        {plan.cta}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
