import { Keypair } from '@solana/web3.js';
// @ts-expect-error - bs58 provides its own types but TS can't find them
import bs58 from 'bs58';

let cachedKeypair: Keypair | null = null;

const isProduction = process.env.NODE_ENV === 'production';

export function getServerKeypair(): Keypair {
    if (cachedKeypair) return cachedKeypair;

    // Attempt to load from environment variable (base58 encoded private key)
    const envKey = process.env.PLATFORM_WALLET_PRIVATE_KEY;

    if (envKey) {
        try {
            cachedKeypair = Keypair.fromSecretKey(bs58.decode(envKey));
            console.log(`✅ Platform wallet loaded: ${cachedKeypair.publicKey.toBase58()}`);
        } catch (e) {
            console.error("❌ Invalid PLATFORM_WALLET_PRIVATE_KEY format", e);
            throw new Error("Invalid PLATFORM_WALLET_PRIVATE_KEY - must be base58 encoded");
        }
    } else if (isProduction) {
        // In production, this key is REQUIRED
        throw new Error("FATAL: PLATFORM_WALLET_PRIVATE_KEY is required in production!");
    } else {
        // Dev/Test: Generate ephemeral key with warning
        console.warn("⚠️ [DEV] No PLATFORM_WALLET_PRIVATE_KEY found. Generating ephemeral server wallet.");
        cachedKeypair = Keypair.generate();
        console.warn(`⚠️ [DEV] Ephemeral server wallet: ${cachedKeypair.publicKey.toBase58()}`);
        console.warn("⚠️ [DEV] This key will change on server restart, breaking existing Magic Link delegations.");
    }

    return cachedKeypair;
}
