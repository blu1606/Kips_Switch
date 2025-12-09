//! Claim locked SPL tokens from a released vault.

use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, CloseAccount, Mint, Token, TokenAccount, Transfer},
};
use crate::{constants::*, errors::*, state::*};

#[derive(Accounts)]
pub struct ClaimTokens<'info> {
    #[account(
        mut,
        constraint = vault.recipient == recipient.key() @ VaultError::NotRecipient,
        constraint = vault.is_released @ VaultError::NotReleased,
        constraint = vault.token_mint.is_some() @ VaultError::NoTokensLocked,
        constraint = vault.locked_tokens > 0 @ VaultError::TokensAlreadyClaimed,
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub recipient: Signer<'info>,

    #[account(
        constraint = token_mint.key() == vault.token_mint.unwrap() @ VaultError::InvalidMint,
    )]
    pub token_mint: Account<'info, Mint>,

    /// Vault's token account (source)
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = vault,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    /// Recipient's token account (destination)
    /// Will be created if doesn't exist
    #[account(
        init_if_needed,
        payer = recipient,
        associated_token::mint = token_mint,
        associated_token::authority = recipient,
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> ClaimTokens<'info> {
    /// Handler for claim_tokens instruction.
    /// Transfers SPL tokens from vault to recipient and closes vault's token account.
    pub fn handler(&mut self) -> Result<()> {
        let vault = &mut self.vault;
        let amount = vault.locked_tokens;

        // PDA seeds for signing
        let owner_key = vault.owner;
        let vault_seed = vault.vault_seed;
        let bump = vault.bump;
        
        let seeds = &[
            VAULT_SEED,
            owner_key.as_ref(),
            &vault_seed.to_le_bytes(),
            &[bump],
        ];
        let signer_seeds = &[&seeds[..]];

        // Transfer tokens from vault to recipient
        token::transfer(
            CpiContext::new_with_signer(
                self.token_program.to_account_info(),
                Transfer {
                    from: self.vault_token_account.to_account_info(),
                    to: self.recipient_token_account.to_account_info(),
                    authority: vault.to_account_info(),
                },
                signer_seeds,
            ),
            amount,
        )?;

        // Close vault token account and reclaim rent to recipient
        token::close_account(
            CpiContext::new_with_signer(
                self.token_program.to_account_info(),
                CloseAccount {
                    account: self.vault_token_account.to_account_info(),
                    destination: self.recipient.to_account_info(),
                    authority: vault.to_account_info(),
                },
                signer_seeds,
            ),
        )?;

        // Mark as claimed
        vault.locked_tokens = 0;

        msg!(
            "Claimed {} tokens to recipient {}",
            amount,
            self.recipient.key()
        );

        Ok(())
    }
}
