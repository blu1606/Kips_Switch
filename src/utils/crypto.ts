/**
 * Client-side AES-GCM encryption using Web Crypto API
 * Zero-Knowledge: plaintext never leaves the browser
 */

// Types for encrypted data
export interface EncryptedData {
    ciphertext: string; // base64
    iv: string; // base64
}

export interface EncryptedVaultData {
    encryptedFile: EncryptedData;
    encryptedKey: string; // AES key encrypted for recipient
    originalFileName: string;
    originalFileType: string;
}

/**
 * Generate a random AES-256 key
 */
export async function generateAESKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true, // extractable
        ['encrypt', 'decrypt']
    );
}

/**
 * Generate AES key from wallet signature (deterministic)
 * Uses SHA-256 hash of signature as key material
 */
export async function generateKeyFromSignature(
    signature: Uint8Array
): Promise<CryptoKey> {
    // Hash the signature to get 256-bit key material
    const keyMaterial = await crypto.subtle.digest('SHA-256', signature.buffer as ArrayBuffer);

    // Import as AES key
    return await crypto.subtle.importKey(
        'raw',
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

/**
 * Export CryptoKey to base64 string for storage
 */
export async function exportKey(key: CryptoKey): Promise<string> {
    const rawKey = await crypto.subtle.exportKey('raw', key);
    return arrayBufferToBase64(rawKey);
}

/**
 * Import base64 string back to CryptoKey
 */
export async function importKey(keyBase64: string): Promise<CryptoKey> {
    const rawKey = base64ToArrayBuffer(keyBase64);
    return await crypto.subtle.importKey(
        'raw',
        rawKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypt a file using AES-GCM
 * @param file - File to encrypt
 * @param key - AES CryptoKey
 * @returns EncryptedData with base64 ciphertext and IV
 */
export async function encryptFile(
    file: File,
    key: CryptoKey
): Promise<EncryptedData> {
    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Generate random 12-byte IV (recommended for GCM)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt
    const ciphertext = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        fileBuffer
    );

    return {
        ciphertext: arrayBufferToBase64(ciphertext),
        iv: arrayBufferToBase64(iv.buffer),
    };
}

/**
 * Encrypt arbitrary data (string or ArrayBuffer)
 */
export async function encryptData(
    data: string | ArrayBuffer,
    key: CryptoKey
): Promise<EncryptedData> {
    const buffer =
        typeof data === 'string' ? new TextEncoder().encode(data) : data;

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        buffer as ArrayBuffer
    );

    return {
        ciphertext: arrayBufferToBase64(ciphertext),
        iv: arrayBufferToBase64(iv.buffer),
    };
}

/**
 * Decrypt data back to original Blob
 * @param encryptedData - The encrypted ciphertext and IV
 * @param key - AES CryptoKey
 * @returns Decrypted Blob
 */
export async function decryptFile(
    encryptedData: EncryptedData,
    key: CryptoKey
): Promise<Blob> {
    const ciphertext = base64ToArrayBuffer(encryptedData.ciphertext);
    const iv = base64ToArrayBuffer(encryptedData.iv);

    const plaintext = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: new Uint8Array(iv),
        },
        key,
        ciphertext
    );

    return new Blob([plaintext]);
}

/**
 * Decrypt data back to string
 */
export async function decryptData(
    encryptedData: EncryptedData,
    key: CryptoKey
): Promise<string> {
    const blob = await decryptFile(encryptedData, key);
    return await blob.text();
}

/**
 * Create encrypted package for vault storage
 * Includes encrypted file + metadata
 */
export async function createEncryptedVaultPackage(
    file: File,
    key: CryptoKey
): Promise<{ blob: Blob; keyBase64: string }> {
    // Encrypt the file
    const encryptedFile = await encryptFile(file, key);

    // Create metadata
    const metadata = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        encryptedAt: new Date().toISOString(),
    };

    // Package everything together
    const package_ = {
        version: 1,
        metadata,
        ...encryptedFile,
    };

    // Convert to blob for upload
    const blob = new Blob([JSON.stringify(package_)], {
        type: 'application/json',
    });

    // Export key for storage
    const keyBase64 = await exportKey(key);

    return { blob, keyBase64 };
}

/**
 * Decrypt vault package back to original file
 */
export async function decryptVaultPackage(
    packageBlob: Blob,
    keyBase64: string
): Promise<{ file: Blob; fileName: string; fileType: string }> {
    // Parse the package
    const packageText = await packageBlob.text();
    const package_ = JSON.parse(packageText);

    // Import the key
    const key = await importKey(keyBase64);

    // Decrypt
    const encryptedData: EncryptedData = {
        ciphertext: package_.ciphertext,
        iv: package_.iv,
    };

    const decryptedBlob = await decryptFile(encryptedData, key);

    return {
        file: decryptedBlob,
        fileName: package_.metadata.fileName,
        fileType: package_.metadata.fileType,
    };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert ArrayBuffer to base64 string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Convert base64 string to ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Sign a message with wallet and derive AES key
 * Helper for use with Solana wallet adapter
 */
export async function deriveKeyFromWalletSignature(
    signMessage: (message: Uint8Array) => Promise<Uint8Array>,
    message: string = 'Deadman\'s Switch Key Derivation'
): Promise<{ key: CryptoKey; signature: Uint8Array }> {
    const messageBytes = new TextEncoder().encode(message);
    const signature = await signMessage(messageBytes);
    const key = await generateKeyFromSignature(signature);
    return { key, signature };
}
