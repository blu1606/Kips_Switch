import { describe, it, expect } from 'vitest';
import { scanForSecrets } from '../safetyScanner';

describe('Safety Scanner Utilities', () => {
    it('should detect valid EVM private keys', () => {
        // High entropy hex string needs to be mixed case or sufficient variety for entropy > 4
        // The previous key might have had marginally enough entropy or the entropy calc is strict.
        // Let's us a real-looking random hex string
        const realKey = '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318';
        const result = scanForSecrets(realKey);

        // Debug if helpful, but vitest log is cleaner
        if (!result.detected) {
            console.log('EVM Detect failed. Entropy might be check.');
        }

        expect(result.detected).toBe(true);
        expect(result.type).toBe('evm_key');
    });

    it('should ignore low entropy hex strings', () => {
        // "aaaaaaaa..." has low entropy
        const fakeKey = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        const result = scanForSecrets(fakeKey);
        expect(result.detected).toBe(false);
    });

    it('should detect valid Solana private keys', () => {
        // Base58 chars: 1-9, A-H, J-N, P-Z, a-k, m-z
        // Let's generate a high entropy string of length 88
        const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        let highEntropyKey = '';
        // Use a fixed seed-like pattern ensuring high character variety
        for (let i = 0; i < 88; i++) {
            highEntropyKey += chars[Math.floor((i * 7) % chars.length)];
        }
        // This is deterministic but high entropy

        const result = scanForSecrets(highEntropyKey);
        expect(result.detected).toBe(true);
        expect(result.type).toBe('solana_key');
    });

    it('should detect seed phrases', () => {
        const seed = 'abandon ability able about above absent absorb abstract academy access account accuse';
        const result = scanForSecrets(seed);
        expect(result.detected).toBe(true);
        expect(result.type).toBe('seed_phrase');
    });

    it('should ignore normal text', () => {
        const text = 'This is a totally normal vault note about my cat and not a secret.';
        const result = scanForSecrets(text);
        expect(result.detected).toBe(false);
    });
});
