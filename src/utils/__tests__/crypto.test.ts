import { describe, it, expect, vi } from 'vitest';
import {
    generateAESKey,
    exportKey,
    importKey,
    arrayBufferToBase64,
    base64ToArrayBuffer,
    encryptFile,
    decryptFile
} from '../crypto';

// Polyfill for File.arrayBuffer in jsdom environment if missing
if (!File.prototype.arrayBuffer) {
    File.prototype.arrayBuffer = function () {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = reject;
            reader.readAsArrayBuffer(this);
        });
    };
}

if (!Blob.prototype.text) {
    Blob.prototype.text = function () {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsText(this);
        });
    };
}


describe('Crypto Utils', () => {
    it('should generate a valid AES key', async () => {
        const key = await generateAESKey();
        expect(key).toBeDefined();
        expect(key.algorithm.name).toBe('AES-GCM');
        expect((key.algorithm as AesKeyAlgorithm).length).toBe(256);
        expect(key.extractable).toBe(true);
    });

    it('should export and import a key correctly', async () => {
        const originalKey = await generateAESKey();
        const exported = await exportKey(originalKey);
        expect(typeof exported).toBe('string');

        const importedKey = await importKey(exported);
        expect(importedKey.algorithm.name).toBe('AES-GCM');

        // Verify keys generate same export
        const reExported = await exportKey(importedKey);
        expect(reExported).toBe(exported);
    });

    it('should convert Buffer <-> Base64 correctly', () => {
        const data = new Uint8Array([1, 2, 3, 255]);
        const base64 = arrayBufferToBase64(data.buffer);
        const buffer = base64ToArrayBuffer(base64);
        const result = new Uint8Array(buffer);

        expect(result).toEqual(data);
    });

    it('should encrypt and decrypt a file correctly', async () => {
        const text = 'Hello World';
        const file = new File([text], 'test.txt', { type: 'text/plain' });
        const key = await generateAESKey();

        const encrypted = await encryptFile(file, key);
        expect(encrypted.ciphertext).toBeDefined();
        expect(encrypted.iv).toBeDefined();

        const decryptedBlob = await decryptFile(encrypted, key);
        const decryptedText = await decryptedBlob.text();

        expect(decryptedText).toBe(text);
    });
});
