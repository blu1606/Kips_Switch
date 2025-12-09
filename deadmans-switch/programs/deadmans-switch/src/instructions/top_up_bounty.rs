//! Add more SOL to the bounty pool.

use anchor_lang::prelude::*;
use crate::{errors::*, state::*};

#[derive(Accounts)]
pub struct TopUpBounty<'info> {
    #[account(
        mut,
        has_one = owner @ VaultError::Unauthorized
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> TopUpBounty<'info> {
    /// Handler for top_up_bounty instruction.
    pub fn handler(&mut self, amount: u64) -> Result<()> {
        let vault = &mut self.vault;

        require!(!vault.is_released, VaultError::AlreadyReleased);
        require!(amount > 0, VaultError::InvalidAmount);

        // Transfer SOL from owner to vault
        anchor_lang::system_program::transfer(
            CpiContext::new(
                self.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: self.owner.to_account_info(),
                    to: vault.to_account_info(),
                },
            ),
            amount,
        )?;

        vault.bounty_lamports = vault.bounty_lamports.checked_add(amount).ok_or(VaultError::Overflow)?;

        msg!("Bounty topped up by {} lamports. Total: {}", amount, vault.bounty_lamports);

        Ok(())
    }
}
