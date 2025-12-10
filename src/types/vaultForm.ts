import { VaultItem } from '@/types/vaultBundle';

export interface VaultFormData {
    // Vault Name (10.1)
    vaultName: string;

    // 10.2: Bundle items (multi-media)
    bundleItems: VaultItem[];

    // Step 1: File (legacy single-file mode)
    file: File | null;
    encryptedBlob: Blob | null;
    aesKeyBase64: string;

    // Encryption mode
    encryptionMode: 'password' | 'wallet';
    password?: string; // Only for password mode
    passwordHint?: string; // Optional hint for password mode

    // Step 2: Recipient
    recipientAddress: string;
    recipientEmail: string;

    // Step 3: Interval
    timeInterval: number; // seconds
}
