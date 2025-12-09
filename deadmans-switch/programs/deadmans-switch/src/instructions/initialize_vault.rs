//! Initialize a new vault with dead man's switch functionality.

use anchor_lang::prelude::*;
use crate::{constants::*, errors::*, state::*};

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = owner,
        space = Vault::SPACE,
        seeds = [VAULT_SEED, owner.key().as_ref(), seed.to_le_bytes().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitializeVault<'info> {
    /// Handler for initialize_vault instruction.
    pub fn handler(
        &mut self,
        seed: u64,
        ipfs_cid: String,
        encrypted_key: String,
        recipient: Pubkey,
        time_interval: i64,
        bounty_lamports: u64,
        name: String,
        locked_lamports: u64,
        bump: u8,
    ) -> Result<()> {
        require!(
            ipfs_cid.len() <= MAX_IPFS_CID_LEN,
            VaultError::IpfsCidTooLong
        );
        require!(
            encrypted_key.len() <= MAX_ENCRYPTED_KEY_LEN,
            VaultError::EncryptedKeyTooLong
        );
        require!(time_interval > 0, VaultError::InvalidTimeInterval);
        require!(name.len() <= MAX_VAULT_NAME_LEN, VaultError::NameTooLong);

        let vault = &mut self.vault;
        let clock = Clock::get()?;

        vault.owner = self.owner.key();
        vault.recipient = recipient;
        vault.ipfs_cid = ipfs_cid;
        vault.encrypted_key = encrypted_key;
        vault.time_interval = time_interval;
        vault.last_check_in = clock.unix_timestamp;
        vault.is_released = false;
        vault.vault_seed = seed;
        vault.bump = bump;
        vault.delegate = None;
        vault.bounty_lamports = bounty_lamports;
        vault.name = name.clone();
        vault.locked_lamports = locked_lamports;
        vault.token_mint = None;      // T.2: No tokens locked initially
        vault.locked_tokens = 0;      // T.2: Tokens locked via separate instruction

        // Transfer bounty + locked SOL from owner to vault PDA
        let total_transfer = bounty_lamports
            .checked_add(locked_lamports)
            .ok_or(VaultError::Overflow)?;
            
        if total_transfer > 0 {
            anchor_lang::system_program::transfer(
                CpiContext::new(
                    self.system_program.to_account_info(),
                    anchor_lang::system_program::Transfer {
                        from: self.owner.to_account_info(),
                        to: vault.to_account_info(),
                    },
                ),
                total_transfer,
            )?;
        }

        msg!("Vault '{}' initialized for owner: {}", name, vault.owner);
        msg!("Vault Seed: {}", seed);
        msg!("Recipient: {}", vault.recipient);
        msg!("Bounty: {} lamports", bounty_lamports);
        msg!("Locked SOL: {} lamports", locked_lamports);

        Ok(())
    }
}

