import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { PROGRAM_ID, PING_DISCRIMINATOR } from '@/utils/anchor';

/**
 * Create a Ping instruction
 */
export function createPingInstruction(vault: PublicKey, signer: PublicKey): TransactionInstruction {
    return new TransactionInstruction({
        programId: PROGRAM_ID,
        keys: [
            { pubkey: vault, isSigner: false, isWritable: true },
            { pubkey: signer, isSigner: true, isWritable: false },
        ],
        data: PING_DISCRIMINATOR,
    });
}
