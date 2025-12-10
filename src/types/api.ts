export interface VaultData {
    publicKey: string;
    account: string;
    status: 'active' | 'warning' | 'urgent' | 'expired' | 'released';
    name: string;
    lastCheckIn: string;
    bountyLamports: string;
    isReleased: boolean;
    recipient: string;
    owner: string;
    delegate?: string;
    tokenMint?: string;
    lockedTokens: string;
    lockedLamports: string;
}

export interface EmergencyContact {
    id: string;
    vault_address: string;
    owner_wallet: string;
    contact_email: string;
    contact_name?: string;
    duress_enabled: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface VaultStreakResponse {
    streak: number;
    longestStreak: number;
    lastPingAt: string | null;
}

export interface DuressRequest {
    vaultAddress: string;
    location?: string;
}

export interface DuressResponse {
    success: boolean;
    message?: string;
    error?: string;
    notified?: number;
    total?: number;
}

export interface ContactRequest {
    vaultAddress: string;
    ownerEmail?: string;
    recipientEmail?: string;
    contactEmail?: string;
    contactName?: string;
    duressEnabled?: boolean;
}

export interface NotifySubscribeRequest {
    vaultAddress: string;
    recipientEmail: string;
    releaseTimestamp: number;
}
