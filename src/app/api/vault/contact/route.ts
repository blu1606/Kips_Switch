import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase';

export async function POST(request: NextRequest) {
    try {
        const { vaultAddress, ownerEmail, recipientEmail } = await request.json();

        if (!vaultAddress) {
            return NextResponse.json({ error: 'Vault address required' }, { status: 400 });
        }

        if (!ownerEmail && !recipientEmail) {
            // Nothing to save
            return NextResponse.json({ success: true, message: 'No emails provided' });
        }

        const supabase = getSupabaseAdmin();
        if (!supabase) {
            return NextResponse.json({ error: 'Database configuration error' }, { status: 500 });
        }

        const { error } = await supabase
            .from('vault_contacts')
            .upsert(
                {
                    vault_address: vaultAddress,
                    owner_email: ownerEmail || null,
                    recipient_email: recipientEmail || null,
                },
                { onConflict: 'vault_address' }
            );

        if (error) {
            console.error('[API] Failed to save contacts:', error);
            return NextResponse.json({ error: 'Failed to save contacts' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[API] Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
