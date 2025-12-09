//! Set or clear the delegate wallet that can ping on owner's behalf.

use anchor_lang::prelude::*;
use crate::{errors::*, state::*};

#[derive(Accounts)]
pub struct SetDelegate<'info> {
    #[account(
        mut,
        has_one = owner @ VaultError::Unauthorized
    )]
    pub vault: Account<'info, Vault>,

    pub owner: Signer<'info>,
}

impl<'info> SetDelegate<'info> {
    /// Handler for set_delegate instruction.
    pub fn handler(&mut self, new_delegate: Option<Pubkey>) -> Result<()> {
        let vault = &mut self.vault;

        require!(!vault.is_released, VaultError::AlreadyReleased);

        vault.delegate = new_delegate;

        match new_delegate {
            Some(delegate) => msg!("Delegate set to: {}", delegate),
            None => msg!("Delegate cleared"),
        }

        Ok(())
    }
}
