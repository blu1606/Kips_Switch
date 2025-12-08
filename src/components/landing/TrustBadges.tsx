'use client';

import { ShieldCheck, Code2, History } from 'lucide-react';

export default function TrustBadges() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 py-8 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-dark-300">Non-Custodial</span>
            </div>

            <a href="https://github.com/blu1606/deadman-switch" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-white/5 text-white group-hover:bg-white/10 transition-colors">
                    <Code2 className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-dark-300 group-hover:text-white transition-colors">Open Source</span>
            </a>

            <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-secondary-500/10 text-secondary-400 group-hover:bg-secondary-500/20 transition-colors">
                    <History className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-dark-300">Verifiable on-chain</span>
            </div>
        </div>
    );
}
