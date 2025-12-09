# 07. PDA & Constants

## 📍 Program Derived Addresses

### Định nghĩa PDA Helper Functions

```rust
use anchor_lang::prelude::*;

fn get_address(seeds: &[&[u8]], program_id: &Pubkey) -> Pubkey {
    Pubkey::find_program_address(seeds, program_id).0
}

pub fn get_state_address(authority: &Pubkey, program_id: &Pubkey) -> Pubkey {
    get_address(
        &[b"state", authority.as_ref()],
        program_id,
    )
}

pub fn get_vault_address(mint: &Pubkey, authority: &Pubkey, program_id: &Pubkey) -> Pubkey {
    get_address(
        &[b"vault", mint.as_ref(), authority.as_ref()],
        program_id,
    )
}
```

### Sử dụng trong Constraints

```rust
#[account(
    address = get_state_address(&authority.key(), &crate::ID) @ CommonError::InvalidAccount,
)]
pub state: Account<'info, StateAccount>,
```

### PDA Seeds trong Account Init

```rust
#[account(
    init,
    payer = authority,
    space = StateAccount::SIZE,
    seeds = [b"state", authority.key().as_ref()],
    bump,
)]
pub state: Account<'info, StateAccount>,
```

## 📦 Constants

### Định nghĩa Constants

```rust
// constants.rs

// Token decimals
pub const TOKEN_DECIMALS: u64 = 1_000_000;

// PDA prefixes - QUAN TRỌNG cho security
pub const PREFIX_STATE: &[u8] = b"state";
pub const PREFIX_VAULT: &[u8] = b"vault";
pub const PREFIX_SETTINGS: &[u8] = b"settings";
pub const PREFIX_USER: &[u8] = b"user";
```

### Sử dụng trong Seeds

```rust
seeds = [
    PREFIX_VAULT,
    mint.key().as_ref(),
    authority.key().as_ref()
],
```

## 🆔 Program IDs với Feature Flags

```rust
use anchor_lang::declare_id;

// Mainnet/Devnet conditional IDs
pub use token_mint::ID as TOKEN_MINT;
mod token_mint {
    use super::*;
    #[cfg(feature = "mainnet")]
    declare_id!("MainnetMintAddress1111111111111111111111111");
    #[cfg(not(feature = "mainnet"))]
    declare_id!("DevnetMintAddress11111111111111111111111111");
}
```

### Sử dụng trong lib.rs

```rust
declare_id!("YourProgramId11111111111111111111111111111");

#[program]
pub mod your_program {
    // ...
}
```

### Validate Mint/Program

```rust
// Validate token mint
#[account(address = TOKEN_MINT @ CommonError::InvalidMint)]
pub mint: Account<'info, Mint>,
```

## 🏗️ Seed Patterns

### Standard PDA Pattern

```
[PREFIX] + [UNIQUE_ID(s)] => PDA
```

**Ví dụ:**

| Account Type | Seeds |
|--------------|-------|
| State | `["state", authority]` |
| Vault | `["vault", mint, authority]` |
| User Data | `["user", authority]` |
| Settings | `["settings"]` |

### Vault PDA (Token Account)

```rust
// Init
seeds = [b"vault", mint.key().as_ref(), authority.key().as_ref()]

// Signing
&[b"vault", mint.as_ref(), state.authority.as_ref(), &[vault_bump]]
```

## ✅ Best Practices

| Practice | Mô tả |
|----------|-------|
| **Unique prefix per account type** | Tránh PDA collision |
| **Include authority in seeds** | Mỗi user có PDA riêng |
| **Store bump in account** | Không cần recompute |
| **Byte literals for prefixes** | Dùng `b"prefix"` thay vì string |
| **Feature flags for IDs** | Mainnet vs Devnet addresses |
| **Helper functions for PDAs** | Reusable across programs |
