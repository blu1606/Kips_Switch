import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';

// Dynamic import wallet provider to avoid SSR issues
const WalletContextProvider = dynamic(
    () => import('@/components/wallet/WalletContextProvider'),
    { ssr: false }
);

const Header = dynamic(
    () => import('@/components/layout/Header'),
    { ssr: false }
);

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
    title: "Deadman's Switch | Digital Inheritance & Crypto Emergency Protocol",
    description: 'Secure your digital legacy. Automated crypto inheritance, whistleblower insurance, and self-custody backup on Solana. Decentralized and immutable.',
    keywords: ['solana', 'digital legacy', 'crypto inheritance', 'dead man switch', 'whistleblower switch', 'key recovery', 'self-custody backup', 'web3 estate planning'],
    manifest: '/manifest.json',
};

export const viewport: Viewport = {
    themeColor: '#020617',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-void-black text-signal-white`}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            "name": "Deadman's Switch Protocol",
                            "applicationCategory": "FinanceApplication",
                            "operatingSystem": "Web",
                            "description": "A decentralized dead man's switch on Solana for secure digital inheritance and crypto self-custody backup.",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            }
                        })
                    }}
                />
                <WalletContextProvider>
                    <Header />
                    <div className="pt-16 md:pt-16">
                        {children}
                    </div>
                </WalletContextProvider>
            </body>
        </html>
    );
}
