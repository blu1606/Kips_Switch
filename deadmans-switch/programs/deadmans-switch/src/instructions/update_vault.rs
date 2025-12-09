//! Update vault settings (recipient, interval, name).

use anchor_lang::prelude::*;
use crate::{constants::*, errors::*, state::*};

#[derive(Accounts)]
pub struct UpdateVault<'info> {
    #[account(
        mut,
        has_one = owner @ VaultError::Unauthorized
    )]
    pub vault: Account<'info, Vault>,

    pub owner: Signer<'info>,
}

impl<'info> UpdateVault<'info> {
    /// Handler for update_vault instruction.
    pub fn handler(
        &mut self,
        new_recipient: Option<Pubkey>,
        new_time_interval: Option<i64>,
        new_name: Option<String>,
    ) -> Result<()> {
        let vault = &mut self.vault;

        require!(!vault.is_released, VaultError::AlreadyReleased);

        if let Some(recipient) = new_recipient {
            vault.recipient = recipient;
            msg!("Recipient updated to: {}", recipient);
        }

        if let Some(interval) = new_time_interval {
            require!(interval > 0, VaultError::InvalidTimeInterval);
            vault.time_interval = interval;
            msg!("Time interval updated to: {} seconds", interval);
        }

        if let Some(name) = new_name {
            require!(name.len() <= MAX_VAULT_NAME_LEN, VaultError::NameTooLong);
            vault.name = name.clone();
            msg!("Name updated to: {}", name);
        }

        Ok(())
    }
}
