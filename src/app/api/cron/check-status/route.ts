import { NextRequest, NextResponse } from 'next/server';
import { Connection } from '@solana/web3.js';
import { RPC_ENDPOINT } from '@/utils/anchor';
import { scanVaults } from '@/services/vault-scanner';
import { classifyVaults } from '@/services/vault-classifier';
import { notifyStakeholders } from '@/services/notification';

export async function GET(request: NextRequest) {
    // 1. Auth check
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const connection = new Connection(RPC_ENDPOINT, 'confirmed');

        // 2. Scan vaults from blockchain
        const vaults = await scanVaults(connection);

        // 3. Classify into expired and warnings
        const { expired, warnings } = classifyVaults(vaults);

        // 4. Notify stakeholders
        const emailResults = await notifyStakeholders(expired, warnings);

        // 5. Return response
        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            summary: {
                totalVaults: vaults.length,
                expiredCount: expired.length,
                warningCount: warnings.length,
            },
            emailResults,
            expired: expired.map(v => ({
                address: v.address,
                owner: v.owner,
                recipient: v.recipient,
            })),
            warnings: warnings.map(({ vault, urgency }) => ({
                address: vault.address,
                urgency,
                daysRemaining: vault.daysUntilExpiry.toFixed(1),
            })),
        });
    } catch (err) {
        console.error('[Cron] Error:', err);
        return NextResponse.json({
            error: 'Cron job failed',
            message: err instanceof Error ? err.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Allow POST for manual triggering
export async function POST(request: NextRequest) {
    return GET(request);
}
