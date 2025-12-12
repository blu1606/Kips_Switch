import { VaultStatus, VaultWarning } from '@/types/vault';

export interface ClassificationResult {
    expired: VaultStatus[];
    warnings: VaultWarning[];
}

/**
 * Classify vaults into expired and warning categories
 */
export function classifyVaults(vaults: VaultStatus[]): ClassificationResult {
    const now = Math.floor(Date.now() / 1000);
    const expired: VaultStatus[] = [];
    const warnings: VaultWarning[] = [];

    for (const vault of vaults) {
        // Skip released vaults
        if (vault.isReleased) continue;

        const secondsUntilExpiry = (vault.deadline.getTime() / 1000) - now;

        if (secondsUntilExpiry <= 0) {
            expired.push(vault);
        } else if (vault.daysUntilExpiry <= 1) {
            warnings.push({ vault, urgency: 'final' });
        } else if (vault.daysUntilExpiry <= 3) {
            warnings.push({ vault, urgency: 'urgent' });
        } else if (vault.daysUntilExpiry <= 7) {
            warnings.push({ vault, urgency: 'warning' });
        }
    }

    console.log(`[Classifier] ${expired.length} expired, ${warnings.length} warnings`);
    return { expired, warnings };
}
