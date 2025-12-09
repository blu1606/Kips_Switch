//! State definitions for the Deadman's Switch program.

use anchor_lang::prelude::*;
use crate::constants::*;

/// The Vault account that stores all data for a dead man's switch.
#[account]
pub struct Vault {
    /// The wallet that created this vault
    pub owner: Pubkey,

    /// The wallet that can claim when released
    pub recipient: Pubkey,

    /// IPFS CID of the encrypted file
    pub ipfs_cid: String,

    /// Base64-encoded encrypted AES key
    pub encrypted_key: String,

    /// Check-in interval in seconds
    pub time_interval: i64,

    /// Timestamp of last check-in
    pub last_check_in: i64,

    /// Whether the vault has been released
    pub is_released: bool,

    /// Unique seed for this vault
    pub vault_seed: u64,

    /// PDA bump seed
    pub bump: u8,

    /// Delegated wallet that can only call ping()
    pub delegate: Option<Pubkey>,

    /// Bounty for the hunter who triggers release after expiry
    pub bounty_lamports: u64,

    /// Human-readable vault name
    pub name: String,

    /// Amount of SOL locked for vesting (lamports)
    pub locked_lamports: u64,

    /// SPL token mint address (None if no tokens locked)
    pub token_mint: Option<Pubkey>,

    /// Amount of SPL tokens locked
    pub locked_tokens: u64,
}

impl Vault {
    /// Calculate the space needed for a Vault account.
    /// Previous: 383 bytes + 33 (token_mint Option<Pubkey>) + 8 (locked_tokens) = 424 bytes
    pub const SPACE: usize = 8 
        + 32                          // owner
        + 32                          // recipient
        + (4 + MAX_IPFS_CID_LEN)      // ipfs_cid
        + (4 + MAX_ENCRYPTED_KEY_LEN) // encrypted_key
        + 8                           // time_interval
        + 8                           // last_check_in
        + 1                           // is_released
        + 8                           // vault_seed
        + 1                           // bump
        + 33                          // delegate (Option<Pubkey>)
        + 8                           // bounty_lamports
        + (4 + MAX_VAULT_NAME_LEN)    // name
        + 8                           // locked_lamports
        + 33                          // token_mint (Option<Pubkey>)
        + 8;                          // locked_tokens
}
