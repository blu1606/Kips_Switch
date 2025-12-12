import { PublicKey } from '@solana/web3.js';
import { getSupabaseAdmin } from '@/utils/supabase';

/**
 * Find all vaults owned by a specific wallet using Supabase index
 * This replaces the expensive getProgramAccounts call
 */
export async function findVaultsByOwner(
    owner: PublicKey
): Promise<{ pubkey: PublicKey; isReleased: boolean }[]> {
    try {
        const supabase = getSupabaseAdmin();
        if (!supabase) {
            console.warn('[findVaultsByOwner] Supabase not available');
            return [];
        }

        const { data, error } = await supabase
            .from('vaults')
            .select('pubkey, is_released')
            .eq('owner', owner.toBase58());

        if (error) {
            console.error('[findVaultsByOwner] Supabase error:', error);
            return [];
        }

        if (!data) return [];

        return data.map(v => ({
            pubkey: new PublicKey(v.pubkey),
            isReleased: v.is_released ?? false
        }));
    } catch (error) {
        console.error('[findVaultsByOwner] Error:', error);
        return [];
    }
}

/**
 * Index a new vault after creation for fast lookup
 */
export async function indexVault(
    pubkey: string,
    owner: string,
    recipient: string
): Promise<boolean> {
    try {
        const supabase = getSupabaseAdmin();
        if (!supabase) {
            console.warn('[indexVault] Supabase not available');
            return false;
        }

        const { error } = await supabase
            .from('vaults')
            .upsert({
                pubkey,
                owner,
                recipient,
                is_released: false,
                last_check_in: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'pubkey' });

        if (error) {
            console.error('[indexVault] Supabase error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('[indexVault] Error:', error);
        return false;
    }
}

/**
 * Update vault check-in timestamp
 */
export async function updateVaultCheckIn(pubkey: string): Promise<boolean> {
    try {
        const supabase = getSupabaseAdmin();
        if (!supabase) return false;

        const { error } = await supabase
            .from('vaults')
            .update({
                last_check_in: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('pubkey', pubkey);

        return !error;
    } catch {
        return false;
    }
}

/**
 * Mark vault as released
 */
export async function markVaultReleased(pubkey: string): Promise<boolean> {
    try {
        const supabase = getSupabaseAdmin();
        if (!supabase) return false;

        const { error } = await supabase
            .from('vaults')
            .update({
                is_released: true,
                updated_at: new Date().toISOString()
            })
            .eq('pubkey', pubkey);

        return !error;
    } catch {
        return false;
    }
}
