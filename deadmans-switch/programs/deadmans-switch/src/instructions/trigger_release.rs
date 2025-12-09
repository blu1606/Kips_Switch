//! Trigger the release of vault contents if the timer has expired.

use anchor_lang::prelude::*;
use crate::{errors::*, state::*};

#[derive(Accounts)]
pub struct TriggerRelease<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,

    /// The hunter who triggers the release and receives the bounty
    #[account(mut)]
    pub hunter: Signer<'info>,
}

impl<'info> TriggerRelease<'info> {
    /// Handler for trigger_release instruction.
    pub fn handler(&mut self) -> Result<()> {
        let vault = &mut self.vault;
        let clock = Clock::get()?;

        require!(!vault.is_released, VaultError::AlreadyReleased);

        let expiry_time = vault
            .last_check_in
            .checked_add(vault.time_interval)
            .ok_or(VaultError::Overflow)?;

        require!(clock.unix_timestamp > expiry_time, VaultError::NotExpired);

        // Pay bounty to hunter
        let bounty = vault.bounty_lamports;
        if bounty > 0 {
            // Check rent exemption before transferring bounty
            let vault_lamports = vault.to_account_info().lamports();
            let rent = Rent::get()?;
            let min_rent = rent.minimum_balance(Vault::SPACE);
            require!(
                vault_lamports.saturating_sub(bounty) >= min_rent,
                VaultError::InsufficientBalance
            );

            **vault.to_account_info().try_borrow_mut_lamports()? -= bounty;
            **self.hunter.to_account_info().try_borrow_mut_lamports()? += bounty;
            vault.bounty_lamports = 0;
            msg!("Bounty of {} lamports paid to hunter: {}", bounty, self.hunter.key());
        }

        vault.is_released = true;

        msg!("Vault released! Recipient {} can now claim.", vault.recipient);

        Ok(())
    }
}
