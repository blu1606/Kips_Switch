//! Close the vault and reclaim rent back to owner.

use anchor_lang::prelude::*;
use crate::{errors::*, state::*};

#[derive(Accounts)]
pub struct CloseVault<'info> {
    #[account(
        mut,
        close = owner,
        has_one = owner @ VaultError::Unauthorized
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub owner: Signer<'info>,
}

impl<'info> CloseVault<'info> {
    /// Handler for close_vault instruction.
    pub fn handler(&self) -> Result<()> {
        msg!("Vault closed by owner. Rent reclaimed.");
        Ok(())
    }
}
