import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

let cachedKeypair: Keypair | null = null;

export function getServerKeypair(): Keypair {
    if (cachedKeypair) return cachedKeypair;

    // In a real app, this comes from process.env.PLATFORM_PRIVATE_KEY
    // For this demo/impl, we try to load from env, or fallback to generation
    // We use a consistent seed if possible for dev convenience

    // Attempt to load from environment variable (base58 encoded private key)
    const envKey = process.env.PLATFORM_WALLET_PRIVATE_KEY;

    if (envKey) {
        try {
            cachedKeypair = Keypair.fromSecretKey(bs58.decode(envKey));
        } catch (e) {
            console.error("Invalid PLATFORM_WALLET_PRIVATE_KEY", e);
        }
    }

    if (!cachedKeypair) {
        // Fallback: Generate one. 
        // NOTE: In production, this means every server restart loses the key, 
        // breaking existing delegations. For MVP/Demo it's acceptable if noted.
        console.warn("⚠️ No PLATFORM_WALLET_PRIVATE_KEY found. Generating ephemeral server wallet.");
        cachedKeypair = Keypair.generate();
    }

    return cachedKeypair;
}
