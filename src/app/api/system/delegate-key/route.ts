import { NextResponse } from 'next/server';
import { getServerKeypair } from '@/utils/serverWallet';

export async function GET() {
    const keypair = getServerKeypair();
    return NextResponse.json({
        publicKey: keypair.publicKey.toBase58()
    });
}
