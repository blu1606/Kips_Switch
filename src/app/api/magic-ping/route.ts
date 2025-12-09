import { NextResponse } from 'next/server';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { getServerKeypair } from '@/utils/serverWallet';
import { verifyMagicLinkToken } from '@/utils/jwt';

// GET /api/magic-ping?vault=...&token=...
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const vaultAddress = searchParams.get('vault');
    const token = searchParams.get('token');

    // 1. Validate required parameters
    if (!vaultAddress) {
        return NextResponse.json({ error: 'Missing vault address' }, { status: 400 });
    }
    if (!token) {
        return NextResponse.json({ error: 'Missing security token' }, { status: 401 });
    }

    try {
        // 2. Verify JWT token
        const payload = verifyMagicLinkToken(token);

        // 3. Ensure token matches the requested vault
        if (payload.vault !== vaultAddress) {
            return NextResponse.json({ error: 'Token does not match vault' }, { status: 403 });
        }

        const vaultPubkey = new PublicKey(vaultAddress);
        const serverKeypair = getServerKeypair();

        // 4. Setup Anchor
        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl('devnet');
        const connection = new Connection(rpcUrl, 'confirmed');
        const wallet = new Wallet(serverKeypair);
        const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });

        const idl = await import('@/idl/deadmans_switch.json');
        const program = new Program(idl as any, provider);

        // 5. Fetch vault and verify delegate is set to server
        const vaultAccount = await (program.account as any).vault.fetch(vaultPubkey);

        if (!vaultAccount.delegate ||
            vaultAccount.delegate.toBase58() !== serverKeypair.publicKey.toBase58()) {
            return NextResponse.json({
                error: 'Server is not set as delegate for this vault. Please enable Magic Link in vault settings.'
            }, { status: 403 });
        }

        // 6. Execute Ping as Delegate
        await (program.methods as any)
            .ping()
            .accounts({
                vault: vaultPubkey,
                signer: serverKeypair.publicKey,
            })
            .rpc();

        // 7. Redirect to success page
        return NextResponse.redirect(new URL('/check-in-success', req.url));

    } catch (error: any) {
        console.error("Magic Ping Failed:", error);

        // Handle specific error types
        if (error.message?.includes('expired') || error.message?.includes('Invalid')) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        return NextResponse.json({
            error: 'Check-in failed.',
            details: error.message
        }, { status: 500 });
    }
}
