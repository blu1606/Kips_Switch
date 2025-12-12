import { getSupabaseAdmin } from '@/utils/supabase';
import { VaultStatus, VaultWarning, VaultContacts } from '@/types/vault';

export interface NotificationResults {
    ownerReminders: number;
    recipientNotifications: number;
}

/**
 * Fetch contact information for vault addresses
 */
export async function getVaultContacts(
    addresses: string[]
): Promise<Record<string, VaultContacts>> {
    const supabase = getSupabaseAdmin();
    if (!supabase || addresses.length === 0) return {};

    const { data } = await supabase
        .from('vault_contacts')
        .select('vault_address, owner_email, recipient_email')
        .in('vault_address', addresses);

    if (!data) return {};

    return data.reduce((acc: Record<string, VaultContacts>, curr) => {
        acc[curr.vault_address] = {
            ownerEmail: curr.owner_email,
            recipientEmail: curr.recipient_email
        };
        return acc;
    }, {});
}

/**
 * Send notifications to vault stakeholders
 */
export async function notifyStakeholders(
    expired: VaultStatus[],
    warnings: VaultWarning[]
): Promise<NotificationResults> {
    // Collect all addresses
    const allAddresses = [
        ...expired.map(v => v.address),
        ...warnings.map(v => v.vault.address)
    ];

    const contactsMap = await getVaultContacts(allAddresses);
    const { sendOwnerReminder, sendRecipientNotification } = await import('@/utils/email');

    const results: NotificationResults = { ownerReminders: 0, recipientNotifications: 0 };

    // Notify recipients of expired vaults
    for (const vault of expired) {
        console.log(`[Notification] EXPIRED: ${vault.address}`);
        const contacts = contactsMap[vault.address];
        if (contacts?.recipientEmail) {
            const sent = await sendRecipientNotification(
                contacts.recipientEmail,
                vault.address,
                vault.owner
            );
            if (sent) results.recipientNotifications++;
        }
    }

    // Notify owners of warning vaults
    for (const { vault, urgency } of warnings) {
        console.log(`[Notification] ${urgency.toUpperCase()}: ${vault.address} expires in ${vault.daysUntilExpiry.toFixed(1)} days`);
        const contacts = contactsMap[vault.address];
        if (contacts?.ownerEmail) {
            const sent = await sendOwnerReminder(
                contacts.ownerEmail,
                vault.address,
                vault.daysUntilExpiry,
                urgency
            );
            if (sent) results.ownerReminders++;
        }
    }

    return results;
}
