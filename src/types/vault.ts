import { PublicKey } from '@solana/web3.js';
import { BorshAccountsCoder, Idl } from '@coral-xyz/anchor';
import idl from '@/idl/deadmans_switch.json';

// Initialize Anchor coder once
const coder = new BorshAccountsCoder(idl as unknown as Idl);

/**
 * Vault status for cron monitoring
 */
export interface VaultStatus {
    address: string;
    owner: string;
    recipient: string;
    isExpired: boolean;
    isReleased: boolean;
    daysUntilExpiry: number;
    lastCheckIn: Date;
    deadline: Date;
}

/**
 * Vault warning with urgency level
 */
export interface VaultWarning {
    vault: VaultStatus;
    urgency: 'final' | 'urgent' | 'warning';
}

/**
 * Contact information for vault stakeholders
 */
export interface VaultContacts {
    ownerEmail: string | null;
    recipientEmail: string | null;
}

/**
 * Raw decoded vault from Anchor coder
 */
interface RawVault {
    owner: PublicKey;
    recipient: PublicKey;
    time_interval: { toNumber(): number };
    last_check_in: { toNumber(): number };
    is_released: boolean;
}

/**
 * Safe Vault Parser using Anchor BorshAccountsCoder
 * Handles corrupted/unexpected data gracefully
 */
export function parseVaultData(pubkey: PublicKey, data: Buffer): VaultStatus | null {
    try {
        // Minimum size check before decoding
        if (data.length < 80) return null;

        const decoded = coder.decode<RawVault>('Vault', data);

        const now = Math.floor(Date.now() / 1000);
        const timeInterval = decoded.time_interval.toNumber();
        const lastCheckIn = decoded.last_check_in.toNumber();
        const deadline = lastCheckIn + timeInterval;
        const secondsUntilExpiry = deadline - now;
        const daysUntilExpiry = secondsUntilExpiry / 86400;

        return {
            address: pubkey.toBase58(),
            owner: decoded.owner.toBase58(),
            recipient: decoded.recipient.toBase58(),
            isExpired: secondsUntilExpiry <= 0,
            isReleased: decoded.is_released,
            daysUntilExpiry,
            lastCheckIn: new Date(lastCheckIn * 1000),
            deadline: new Date(deadline * 1000),
        };
    } catch {
        console.warn(`[Parser] Failed to parse vault: ${pubkey.toBase58()}`);
        return null;
    }
}
