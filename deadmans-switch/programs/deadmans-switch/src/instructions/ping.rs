//! Ping (check-in) to reset the dead man's switch timer.

use anchor_lang::prelude::*;
use crate::{errors::*, state::*};

/// Ping accounts - signer can be owner OR delegate.
#[derive(Accounts)]
pub struct Ping<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,

    /// The signer - can be owner or delegate (validated in handler)
    pub signer: Signer<'info>,
}

impl<'info> Ping<'info> {
    /// Handler for ping instruction.
    pub fn handler(&mut self) -> Result<()> {
        let vault = &mut self.vault;
        let clock = Clock::get()?;

        require!(!vault.is_released, VaultError::AlreadyReleased);

        // Authorization check - allow owner OR delegate
        let signer = self.signer.key();
        let is_owner = signer == vault.owner;
        let is_delegate = vault.delegate.map_or(false, |d| d == signer);
        
        require!(is_owner || is_delegate, VaultError::Unauthorized);

        vault.last_check_in = clock.unix_timestamp;

        msg!("Ping successful by {}. Timer reset to: {}", 
            if is_owner { "owner" } else { "delegate" },
            vault.last_check_in
        );

        Ok(())
    }
}
