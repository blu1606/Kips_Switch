import { NextRequest, NextResponse } from 'next/server';
import {
    Connection,
    PublicKey,
    Transaction,
} from '@solana/web3.js';
import {
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    ACTIONS_CORS_HEADERS,
} from '@solana/actions';
import { RPC_ENDPOINT as RPC_URL } from '@/utils/anchor';
import { findVaultsByOwner } from '@/services/vault';
import { createPingInstruction } from '@/utils/instructions';

/**
 * GET - Returns the Blink metadata
 */
export async function GET() {
    const payload: ActionGetResponse = {
        icon: 'https://arweave.net/f1L2QzqO5_HW9eFP9Jf7Q7TfQ9Nh-H8YZfKAZ3K2pKE',
        title: '🛡️ Ping Deadman\'s Switch',
        description: 'Prove you\'re alive! Reset all your vault timers with a single click.',
        label: 'Ping Now',
        links: {
            actions: [
                {
                    label: '🔔 Ping All Vaults',
                    href: '/api/actions/ping',
                    type: 'transaction',
                },
            ],
        },
    };

    return NextResponse.json(payload, { headers: ACTIONS_CORS_HEADERS });
}

/**
 * OPTIONS - Handle CORS preflight
 */
export async function OPTIONS() {
    return new NextResponse(null, { headers: ACTIONS_CORS_HEADERS });
}

/**
 * POST - Creates the ping transaction
 */
export async function POST(req: NextRequest) {
    try {
        const body: ActionPostRequest = await req.json();
        const { account } = body;

        if (!account) {
            return NextResponse.json(
                { error: 'Missing account' },
                { status: 400, headers: ACTIONS_CORS_HEADERS }
            );
        }

        const userPubkey = new PublicKey(account);
        const connection = new Connection(RPC_URL, 'confirmed');

        // Find all vaults owned by this user (from Supabase index)
        const vaultAccounts = await findVaultsByOwner(userPubkey);

        if (vaultAccounts.length === 0) {
            return NextResponse.json(
                { error: 'No vaults found for this wallet. Create a vault first at deadmanswitch.xyz' },
                { status: 400, headers: ACTIONS_CORS_HEADERS }
            );
        }

        // Create transaction with ping instructions for all vaults
        const transaction = new Transaction();

        for (const vault of vaultAccounts) {
            const pingIx = createPingInstruction(vault.pubkey, userPubkey);
            transaction.add(pingIx);
        }

        // Get latest blockhash
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight = lastValidBlockHeight;
        transaction.feePayer = userPubkey;

        // Serialize transaction
        const serializedTx = transaction
            .serialize({ requireAllSignatures: false, verifySignatures: false })
            .toString('base64');

        const response: ActionPostResponse = {
            type: 'transaction',
            transaction: serializedTx,
            message: `✅ Pinged ${vaultAccounts.length} vault${vaultAccounts.length > 1 ? 's' : ''}! Your timers have been reset.`,
        };

        return NextResponse.json(response, { headers: ACTIONS_CORS_HEADERS });
    } catch (error) {
        console.error('[Blinks Ping] Error:', error);
        return NextResponse.json(
            { error: 'Failed to create transaction' },
            { status: 500, headers: ACTIONS_CORS_HEADERS }
        );
    }
}
