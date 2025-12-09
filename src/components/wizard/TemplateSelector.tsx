'use client';

import { FC } from 'react';

interface Template {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    intervalDays: number;
    color: string;
}

interface TemplateSelectorProps {
    onSelect: (intervalSeconds: number) => void;
}

const TEMPLATES: Template[] = [
    {
        id: 'backup',
        title: 'Crypto Backup',
        description: 'Secure your seed phrases or private keys. Releases only if you are gone for a long time.',
        intervalDays: 365,
        color: 'text-blue-400',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        )
    },
    {
        id: 'letter',
        title: 'Last Letter',
        description: 'A farewell message or video for your loved ones. Balanced check-in time.',
        intervalDays: 30,
        color: 'text-pink-400',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        )
    },
    {
        id: 'whistleblower',
        title: 'Whistleblower',
        description: 'Emergancy release. Short timer for critical insurance files.',
        intervalDays: 3,
        color: 'text-red-400',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
        )
    },
    {
        id: 'custom',
        title: 'Custom Protocol',
        description: 'Configure every parameter yourself from scratch.',
        intervalDays: 0, // Will default to 30 days in logic if needed, but 0 signals custom flow
        color: 'text-gray-400',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
        )
    }
];

const TemplateSelector: FC<TemplateSelectorProps> = ({ onSelect }) => {
    return (
        <div className="space-y-6">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3">Choose Your Security Protocol</h2>
                <p className="text-dark-400 max-w-md mx-auto">
                    Select a template to auto-configure your vault, or start from scratch.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TEMPLATES.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => onSelect(template.intervalDays * 24 * 60 * 60)}
                        className="group relative p-6 bg-dark-800 rounded-xl border border-dark-700 hover:border-primary-500/50 hover:bg-dark-800/80 transition-all duration-300 text-left"
                    >
                        <div className={`mb-4 w-14 h-14 rounded-lg bg-dark-900 border border-dark-700 flex items-center justify-center ${template.color} group-hover:scale-110 transition-transform duration-300`}>
                            {template.icon}
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                            {template.title}
                        </h3>

                        <p className="text-sm text-dark-400 leading-relaxed mb-4">
                            {template.description}
                        </p>

                        <div className="flex items-center gap-2 text-xs font-mono text-dark-500 bg-dark-900/50 py-1.5 px-3 rounded-lg w-fit group-hover:bg-dark-950 transition-colors">
                            <span className="opacity-50">TIMER:</span>
                            <span className={template.intervalDays > 0 ? "text-white" : "text-dark-400"}>
                                {template.intervalDays > 0 ? `${template.intervalDays} DAYS` : 'MANUAL'}
                            </span>
                        </div>

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector;
