//! Deadman's Switch - A Solana program for dead man's switch functionality.
//! 
//! Allows users to create vaults that automatically release to recipients
//! if the owner doesn't check in within a specified time interval.

mod constants;
mod errors;
mod instructions;
mod state;

use anchor_lang::prelude::*;
pub use constants::*;
pub use errors::*;
use instructions::*;
pub use state::*;

declare_id!("HnFEhMS84CabpztHCDdGGN8798NxNse7NtXW4aG17XpB");

#[program]
pub mod deadmans_switch {
    use super::*;

    /// Initialize a new vault with dead man's switch functionality.
    pub fn initialize_vault(
        ctx: Context<InitializeVault>,
        seed: u64,
        ipfs_cid: String,
        encrypted_key: String,
        recipient: Pubkey,
        time_interval: i64,
        bounty_lamports: u64,
        name: String,
    ) -> Result<()> {
        ctx.accounts.handler(seed, ipfs_cid, encrypted_key, recipient, time_interval, bounty_lamports, name, ctx.bumps.vault)
    }

    /// Ping (check-in) to reset the dead man's switch timer.
    pub fn ping(ctx: Context<Ping>) -> Result<()> {
        ctx.accounts.handler()
    }

    /// Set or clear the delegate wallet that can ping on owner's behalf.
    pub fn set_delegate(ctx: Context<SetDelegate>, new_delegate: Option<Pubkey>) -> Result<()> {
        ctx.accounts.handler(new_delegate)
    }

    /// Trigger the release of vault contents if the timer has expired.
    pub fn trigger_release(ctx: Context<TriggerRelease>) -> Result<()> {
        ctx.accounts.handler()
    }

    /// Add more SOL to the bounty pool.
    pub fn top_up_bounty(ctx: Context<TopUpBounty>, amount: u64) -> Result<()> {
        ctx.accounts.handler(amount)
    }

    /// Update vault settings (recipient and/or interval).
    pub fn update_vault(
        ctx: Context<UpdateVault>,
        new_recipient: Option<Pubkey>,
        new_time_interval: Option<i64>,
        new_name: Option<String>,
    ) -> Result<()> {
        ctx.accounts.handler(new_recipient, new_time_interval, new_name)
    }

    /// Close the vault and reclaim rent back to owner.
    pub fn close_vault(ctx: Context<CloseVault>) -> Result<()> {
        ctx.accounts.handler()
    }

    /// Claim the vault contents and close it.
    pub fn claim_and_close(ctx: Context<ClaimAndClose>) -> Result<()> {
        ctx.accounts.handler()
    }
}
