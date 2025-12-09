//! Error types for the Deadman's Switch program.

use anchor_lang::prelude::*;

#[error_code]
pub enum VaultError {
    #[msg("Only the vault owner or delegate can perform this action")]
    Unauthorized,

    #[msg("Vault timer has not expired yet")]
    NotExpired,

    #[msg("Vault has already been released")]
    AlreadyReleased,

    #[msg("IPFS CID exceeds maximum length")]
    IpfsCidTooLong,

    #[msg("Encrypted key exceeds maximum length")]
    EncryptedKeyTooLong,

    #[msg("Time interval must be greater than 0")]
    InvalidTimeInterval,

    #[msg("Arithmetic overflow occurred")]
    Overflow,

    #[msg("Amount must be greater than 0")]
    InvalidAmount,

    #[msg("Insufficient balance to maintain rent exemption")]
    InsufficientBalance,

    #[msg("Vault name exceeds maximum length of 32 characters")]
    NameTooLong,
}
