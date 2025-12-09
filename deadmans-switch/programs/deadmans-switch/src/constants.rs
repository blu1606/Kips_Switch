//! Constants for the Deadman's Switch program.

/// Seeds for Vault PDA
pub const VAULT_SEED: &[u8] = b"vault";

/// Maximum length of IPFS CID (CIDv1 base32 = ~59 chars, add padding)
pub const MAX_IPFS_CID_LEN: usize = 64;

/// Maximum length of encrypted AES key (base64 encoded)
pub const MAX_ENCRYPTED_KEY_LEN: usize = 128;

/// Maximum length of vault name
pub const MAX_VAULT_NAME_LEN: usize = 32;
