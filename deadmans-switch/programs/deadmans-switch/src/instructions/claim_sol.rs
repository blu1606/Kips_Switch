//! Claim locked SOL from a released vault.

use anchor_lang::prelude::*;
use crate::{errors::*, state::*};

#[derive(Accounts)]
pub struct ClaimSol<'info> {
    #[account(
        mut,
        constraint = vault.recipient == recipient.key() @ VaultError::NotRecipient,
        constraint = vault.is_released @ VaultError::NotReleased,
        constraint = vault.locked_lamports > 0 @ VaultError::NoLockedSol,
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub recipient: Signer<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> ClaimSol<'info> {
    /// Handler for claim_sol instruction.
    /// Transfers locked SOL from vault PDA to recipient.
    pub fn handler(&mut self) -> Result<()> {
        let vault = &mut self.vault;
        let amount = vault.locked_lamports;

        // Transfer SOL from vault PDA to recipient
        // Vault PDA can transfer its own lamports without signing
        **vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **self.recipient.to_account_info().try_borrow_mut_lamports()? += amount;

        // Mark as claimed
        vault.locked_lamports = 0;

        msg!("Claimed {} lamports to recipient {}", amount, self.recipient.key());

        Ok(())
    }
}
