'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletButton from '@/components/wallet/WalletButton';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Header() {
    const pathname = usePathname();
    const { connected } = useWallet();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/dashboard', label: 'My Vaults' },
        { href: '/create', label: 'Create' },
        { href: '/claim', label: 'Claim' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-lg border-b border-dark-700">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl">🔐</span>
                    <span className="font-bold text-lg text-white group-hover:text-primary-400 transition-colors">
                        Deadman&apos;s Switch
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === link.href
                                    ? 'bg-primary-600/20 text-primary-400'
                                    : 'text-dark-300 hover:text-white hover:bg-dark-800'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Wallet + Mobile Menu */}
                <div className="flex items-center gap-3">
                    {connected && (
                        <span className="hidden sm:block text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                            ● Connected
                        </span>
                    )}
                    <WalletButton />
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t border-dark-700 px-4 py-2 flex justify-around">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`px-3 py-1.5 rounded text-xs font-medium ${pathname === link.href
                                ? 'bg-primary-600/20 text-primary-400'
                                : 'text-dark-400'
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </header>
    );
}
