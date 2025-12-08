import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin client (Service Role)
// This should ONLY be used in server-side contexts (API routes, Cron jobs)
export const getSupabaseAdmin = () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase credentials');
        return null;
    }

    return createClient(supabaseUrl, supabaseServiceKey);
};
