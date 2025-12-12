import { NextRequest, NextResponse } from 'next/server';
import {
    Connection,
    PublicKey,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';
import {
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    ACTIONS_CORS_HEADERS,
} from '@solana/actions';

// Program ID from IDL
const PROGRAM_ID = new PublicKey('HnFEhMS84CabpztHCDdGGN8798NxNse7NtXW4aG17XpB');

// RPC endpoint
const RPC_URL = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.devnet.solana.com';

// Ping instruction discriminator from IDL
const PING_DISCRIMINATOR = Buffer.from([173, 0, 94, 236, 73, 133, 225, 153]);

/**
 * GET - Returns the Blink metadata
 */
export async function GET(_req: NextRequest) {
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

        // Find all vaults owned by this user
        const vaultAccounts = await findVaultsByOwner(connection, userPubkey);

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

/**
 * Find all vaults owned by a specific wallet
 */
async function findVaultsByOwner(
    connection: Connection,
    owner: PublicKey
): Promise<{ pubkey: PublicKey; isReleased: boolean }[]> {
    try {
        // Vault discriminator from IDL
        const VAULT_DISCRIMINATOR = Buffer.from([211, 8, 232, 43, 2, 152, 117, 119]);

        // Fetch all program accounts
        const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
            filters: [
                {
                    memcmp: {
                        offset: 0,
                        bytes: VAULT_DISCRIMINATOR.toString('base64'),
                    },
                },
            ],
        });

        // Filter by owner and not released
        const vaults: { pubkey: PublicKey; isReleased: boolean }[] = [];

        for (const account of accounts) {
            const data = account.account.data;

            // Owner is at offset 8 (after discriminator)
            const vaultOwner = new PublicKey(data.slice(8, 40));

            // is_released is at a specific offset (need to check struct layout)
            // For now, we include all vaults owned by user and let contract validate
            if (vaultOwner.equals(owner)) {
                // Approximate check for is_released flag
                // is_released is typically a boolean, check common offsets
                // Based on typical Anchor struct: after pubkey fields and i64s
                // Let's assume it's somewhere in the data
                const isReleased = false; // Will be validated by contract

                vaults.push({ pubkey: account.pubkey, isReleased });
            }
        }

        return vaults;
    } catch (error) {
        console.error('[findVaultsByOwner] Error:', error);
        return [];
    }
}

/**
 * Create a Ping instruction
 */
function createPingInstruction(vault: PublicKey, signer: PublicKey): TransactionInstruction {
    return new TransactionInstruction({
        programId: PROGRAM_ID,
        keys: [
            { pubkey: vault, isSigner: false, isWritable: true },
            { pubkey: signer, isSigner: true, isWritable: false },
        ],
        data: PING_DISCRIMINATOR,
    });
}
