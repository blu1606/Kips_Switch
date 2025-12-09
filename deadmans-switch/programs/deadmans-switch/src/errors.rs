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

    #[msg("Only the designated recipient can perform this action")]
    NotRecipient,

    #[msg("Vault has not been released yet")]
    NotReleased,

    #[msg("No SOL locked in vault")]
    NoLockedSol,

    #[msg("Tokens already locked in vault")]
    TokensAlreadyLocked,

    #[msg("No tokens locked in vault")]
    NoTokensLocked,

    #[msg("Invalid token mint")]
    InvalidMint,

    #[msg("Tokens already claimed")]
    TokensAlreadyClaimed,
}
