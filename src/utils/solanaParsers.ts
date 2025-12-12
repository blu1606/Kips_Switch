import { PublicKey } from '@solana/web3.js';
import { BN, BorshAccountsCoder, Idl } from '@coral-xyz/anchor';
import idl from '@/idl/deadmans_switch.json';

// Initialize Anchor coder once for efficient reuse
const coder = new BorshAccountsCoder(idl as unknown as Idl);

/**
 * Vault data structure matching on-chain account
 */
export interface VaultData {
    publicKey: PublicKey;
    owner: PublicKey;
    recipient: PublicKey;
    ipfsCid: string;
    encryptedKey: string;
    timeInterval: BN;
    lastCheckIn: BN;
    isReleased: boolean;
    vaultSeed: BN;
    bump: number;
    delegate?: PublicKey | null;
    bountyLamports: BN;
    name: string;
    lockedLamports: BN;
    tokenMint?: PublicKey | null;
    lockedTokens: BN;
}

/**
 * Raw decoded vault from Anchor coder (snake_case fields)
 */
interface RawVault {
    owner: PublicKey;
    recipient: PublicKey;
    ipfs_cid: string;
    encrypted_key: string;
    time_interval: BN;
    last_check_in: BN;
    is_released: boolean;
    vault_seed: BN;
    bump: number;
    delegate: PublicKey | null;
    bounty_lamports: BN;
    name: string;
    locked_lamports: BN;
    token_mint: PublicKey | null;
    locked_tokens: BN;
}

/**
 * Parse vault account data using Anchor's BorshAccountsCoder
 * This replaces manual Buffer.slice() parsing for type-safety and maintainability
 */
export function parseVaultAccount(pubkey: PublicKey, data: Buffer): VaultData {
    // Decode using Anchor coder - automatically handles all field types
    const decoded = coder.decode<RawVault>('Vault', data);

    // Map snake_case to camelCase for frontend consistency
    return {
        publicKey: pubkey,
        owner: decoded.owner,
        recipient: decoded.recipient,
        ipfsCid: decoded.ipfs_cid,
        encryptedKey: decoded.encrypted_key,
        timeInterval: decoded.time_interval,
        lastCheckIn: decoded.last_check_in,
        isReleased: decoded.is_released,
        vaultSeed: decoded.vault_seed,
        bump: decoded.bump,
        delegate: decoded.delegate,
        bountyLamports: decoded.bounty_lamports,
        name: decoded.name,
        lockedLamports: decoded.locked_lamports,
        tokenMint: decoded.token_mint,
        lockedTokens: decoded.locked_tokens,
    };
}

/**
 * Safe wrapper that returns null on decode errors
 */
export function safeParseVaultAccount(pubkey: PublicKey, data: Buffer): VaultData | null {
    try {
        return parseVaultAccount(pubkey, data);
    } catch (error) {
        console.warn(`[Parser] Failed to decode vault ${pubkey.toBase58()}:`, error);
        return null;
    }
}
