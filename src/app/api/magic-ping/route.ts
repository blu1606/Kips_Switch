import { NextResponse } from 'next/server';
import { Connection, PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { getServerKeypair } from '@/utils/serverWallet';
import { PROGRAM_ID } from '@/utils/anchor';

// GET /api/magic-ping?vault=...&token=...
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const vaultAddress = searchParams.get('vault');
    const token = searchParams.get('token'); // Simplistic security for MVP

    if (!vaultAddress) {
        return NextResponse.json({ error: 'Missing vault address' }, { status: 400 });
    }

    try {
        const vaultPubkey = new PublicKey(vaultAddress);
        const serverKeypair = getServerKeypair();

        // In a real app we would verify the JWT 'token' here to ensure the link is valid and unexpired
        // For MVP, we assume the link is valid (security risk, but feature parity for demo)
        if (!token) {
            return NextResponse.json({ error: 'Missing security token' }, { status: 401 });
        }

        // Setup Anchor
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const wallet = new Wallet(serverKeypair);
        const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });

        const idl = await import('@/idl/deadmans_switch.json');
        const program = new Program(idl as any, provider);

        // Execute Ping as Delegate
        // The contract checks if 'signer' (serverKeypair) is the delegate of 'vault'
        await (program.methods as any)
            .ping()
            .accounts({
                vault: vaultPubkey,
                signer: serverKeypair.publicKey,
            })
            .rpc();

        // Redirect to success page on success
        return NextResponse.redirect(new URL('/check-in-success', req.url));

    } catch (error: any) {
        console.error("Magic Ping Failed:", error);
        return NextResponse.json({
            error: 'Check-in failed. Ensure the server is still set as delegate.',
            details: error.message
        }, { status: 500 });
    }
}
