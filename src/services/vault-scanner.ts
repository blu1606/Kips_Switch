import { Connection } from '@solana/web3.js';
import { PROGRAM_ID, VAULT_DISCRIMINATOR } from '@/utils/anchor';
import { VaultStatus, parseVaultData } from '@/types/vault';

/**
 * Fetch all vault accounts from the blockchain and parse them
 */
export async function scanVaults(connection: Connection): Promise<VaultStatus[]> {
    // Use discriminator filter to only fetch Vault accounts
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

    console.log(`[VaultScanner] Fetched ${accounts.length} vault accounts`);

    // Parse accounts with safe parser
    const vaults: VaultStatus[] = [];
    for (const account of accounts) {
        const status = parseVaultData(account.pubkey, account.account.data);
        if (status) {
            vaults.push(status);
        }
    }

    console.log(`[VaultScanner] Successfully parsed ${vaults.length} vaults`);
    return vaults;
}
