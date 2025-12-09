//! Lock SPL tokens into a vault for vesting.

use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};
use crate::{errors::*, state::*};

#[derive(Accounts)]
pub struct LockTokens<'info> {
    #[account(
        mut,
        constraint = vault.owner == owner.key() @ VaultError::Unauthorized,
        constraint = !vault.is_released @ VaultError::AlreadyReleased,
        constraint = vault.token_mint.is_none() @ VaultError::TokensAlreadyLocked,
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub token_mint: Account<'info, Mint>,

    /// Owner's token account (source)
    #[account(
        mut,
        constraint = owner_token_account.owner == owner.key() @ VaultError::Unauthorized,
        constraint = owner_token_account.mint == token_mint.key() @ VaultError::InvalidMint,
    )]
    pub owner_token_account: Account<'info, TokenAccount>,

    /// Vault's token account (destination)
    /// Will be created if doesn't exist
    #[account(
        init_if_needed,
        payer = owner,
        associated_token::mint = token_mint,
        associated_token::authority = vault,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> LockTokens<'info> {
    /// Handler for lock_tokens instruction.
    /// Transfers SPL tokens from owner to vault's associated token account.
    pub fn handler(&mut self, amount: u64) -> Result<()> {
        require!(amount > 0, VaultError::InvalidAmount);

        let vault = &mut self.vault;

        // Transfer tokens from owner to vault
        token::transfer(
            CpiContext::new(
                self.token_program.to_account_info(),
                Transfer {
                    from: self.owner_token_account.to_account_info(),
                    to: self.vault_token_account.to_account_info(),
                    authority: self.owner.to_account_info(),
                },
            ),
            amount,
        )?;

        // Update vault state
        vault.token_mint = Some(self.token_mint.key());
        vault.locked_tokens = amount;

        msg!(
            "Locked {} tokens of mint {} in vault",
            amount,
            self.token_mint.key()
        );

        Ok(())
    }
}
