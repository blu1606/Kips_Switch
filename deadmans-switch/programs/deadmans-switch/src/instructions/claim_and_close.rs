//! Claim the vault contents and close it.

use anchor_lang::prelude::*;
use crate::{errors::*, state::*};

#[derive(Accounts)]
pub struct ClaimAndClose<'info> {
    #[account(
        mut,
        close = recipient,
        has_one = recipient @ VaultError::Unauthorized
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub recipient: Signer<'info>,
}

impl<'info> ClaimAndClose<'info> {
    /// Handler for claim_and_close instruction.
    pub fn handler(&self) -> Result<()> {
        let vault = &self.vault;
        let clock = Clock::get()?;

        // Check if vault is expired (allow claim even if not formally released)
        let expiry_time = vault
            .last_check_in
            .checked_add(vault.time_interval)
            .ok_or(VaultError::Overflow)?;

        require!(
            clock.unix_timestamp > expiry_time || vault.is_released,
            VaultError::NotExpired
        );

        msg!("Vault claimed and closed by recipient: {}", vault.recipient);
        msg!("Rent transferred to recipient.");

        Ok(())
    }
}
