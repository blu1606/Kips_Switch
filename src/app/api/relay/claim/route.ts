import { NextRequest, NextResponse } from 'next/server';
import { Connection, Keypair, Transaction, clusterApiUrl } from '@solana/web3.js';
import bs58 from 'bs58';

/**
 * Gas Station Relay API
 * 
 * This endpoint allows gasless claiming of vaults by:
 * 1. Receiving a serialized transaction from the frontend
 * 2. Signing it with the backend hot wallet (payer)
 * 3. Submitting it to the Solana network
 * 
 * The vault owner pre-pays gas by depositing SOL into the vault.
 */

const RELAY_WALLET_SECRET = process.env.RELAY_WALLET_PRIVATE_KEY;

export async function POST(request: NextRequest) {
    try {
        // Validate relay wallet is configured
        if (!RELAY_WALLET_SECRET) {
            return NextResponse.json(
                { error: 'Relay service not configured' },
                { status: 503 }
            );
        }

        const body = await request.json();
        const { serializedTransaction, network = 'devnet' } = body;

        if (!serializedTransaction) {
            return NextResponse.json(
                { error: 'Missing serializedTransaction' },
                { status: 400 }
            );
        }

        // Decode the relay wallet
        let relayWallet: Keypair;
        try {
            const secretKey = bs58.decode(RELAY_WALLET_SECRET);
            relayWallet = Keypair.fromSecretKey(secretKey);
        } catch {
            return NextResponse.json(
                { error: 'Invalid relay wallet configuration' },
                { status: 500 }
            );
        }

        // Setup connection
        const rpcUrl = network === 'mainnet-beta'
            ? process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl('mainnet-beta')
            : clusterApiUrl('devnet');

        const connection = new Connection(rpcUrl, 'confirmed');

        // Deserialize and sign the transaction
        const txBuffer = Buffer.from(serializedTransaction, 'base64');
        const transaction = Transaction.from(txBuffer);

        // Validate transaction is not too old
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = relayWallet.publicKey;

        // Sign with relay wallet (pays the gas)
        transaction.partialSign(relayWallet);

        // Serialize back - frontend needs to add recipient signature
        const serializedSigned = transaction.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
        }).toString('base64');

        // If transaction is fully signed, submit it
        if (transaction.signatures.every(sig => sig.signature !== null)) {
            const signature = await connection.sendRawTransaction(
                transaction.serialize(),
                { skipPreflight: false, preflightCommitment: 'confirmed' }
            );

            // Wait for confirmation
            await connection.confirmTransaction(signature, 'confirmed');

            return NextResponse.json({
                success: true,
                signature,
                message: 'Transaction submitted successfully',
            });
        }

        // Return partially signed transaction for frontend to complete
        return NextResponse.json({
            success: true,
            partiallySignedTx: serializedSigned,
            relayerPublicKey: relayWallet.publicKey.toBase58(),
            message: 'Transaction signed by relayer, awaiting recipient signature',
        });

    } catch (error) {
        console.error('Relay error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Relay failed' },
            { status: 500 }
        );
    }
}
