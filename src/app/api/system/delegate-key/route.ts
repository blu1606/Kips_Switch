import { NextResponse } from 'next/server';
import { getServerKeypair } from '@/utils/serverWallet';

// Force dynamic rendering - this route cannot be statically generated
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const keypair = getServerKeypair();
        return NextResponse.json({
            publicKey: keypair.publicKey.toBase58()
        });
    } catch (error: any) {
        console.error("Failed to get server keypair:", error.message);
        return NextResponse.json({
            error: 'Server wallet not configured'
        }, { status: 500 });
    }
}
