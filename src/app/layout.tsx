import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';

// Dynamic import wallet provider to avoid SSR issues
const WalletContextProvider = dynamic(
    () => import('@/components/wallet/WalletContextProvider'),
    { ssr: false }
);

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "Deadman's Switch | Digital Legacy Protocol",
    description: 'A decentralized dead man\'s switch protocol on Solana for secure digital inheritance.',
    keywords: ['solana', 'dead man switch', 'digital legacy', 'crypto inheritance', 'web3'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <WalletContextProvider>
                    {children}
                </WalletContextProvider>
            </body>
        </html>
    );
}
