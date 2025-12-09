# 02. Account & State

## 🏗️ Định nghĩa Account Struct

```rust
use anchor_lang::prelude::*;

/***
 * Accounts
 */

/// Doc comment mô tả account
#[account]
pub struct YourAccount {
    pub amount: u64,
    pub authority: Pubkey,
    pub duration: u64,
    pub vault: Pubkey,
    pub vault_bump: u8,
}
```

## 📏 Tính toán SIZE

**LUÔN** định nghĩa `SIZE` constant cho mỗi account:

```rust
impl YourAccount {
    pub const SIZE: usize = 8 + std::mem::size_of::<YourAccount>();
    
    // Hoặc tính manual nếu cần precision:
    // pub const SIZE: usize = 8    // discriminator
    //     + 8                       // amount: u64
    //     + 32                      // authority: Pubkey
    //     + 8                       // duration: u64
    //     + 32                      // vault: Pubkey
    //     + 1;                      // vault_bump: u8
}
```

> **Note**: `8` bytes đầu tiên là Anchor discriminator.

## 🔢 Constants trong Account

Định nghĩa business constants trong impl block:

```rust
impl StakeAccount {
    pub const SIZE: usize = 8 + std::mem::size_of::<StakeAccount>();
    
    // Business constants
    pub const MINIMUM_AMOUNT: u64 = 0;
    pub const SECONDS_PER_DAY: u128 = 24 * 60 * 60;
    pub const DURATION_MIN: u128 = 14 * Self::SECONDS_PER_DAY;  // 2 weeks
    pub const DURATION_MAX: u128 = 365 * Self::SECONDS_PER_DAY; // 1 year
    pub const PRECISION: u128 = u128::pow(10, 15);
}
```

## 🛠️ Methods trong State

Encapsulate business logic trong account methods:

```rust
impl YourAccount {
    /// Initialize account với các giá trị ban đầu
    pub fn init(&mut self, amount: u64, authority: Pubkey, vault: Pubkey, vault_bump: u8) {
        self.amount = amount;
        self.authority = authority;
        self.vault = vault;
        self.vault_bump = vault_bump;
    }

    /// Business method trả về Result
    pub fn update(&mut self, now: i64) -> Result<()> {
        self.last_update = now;
        Ok(())
    }

    /// Simple mutation (không cần Result)
    pub fn add_amount(&mut self, amount: u64) {
        self.amount += amount;
    }

    /// Private helper method
    fn calculate_value(&self) -> u128 {
        // internal calculation
    }
}
```

## ⚙️ Settings Account Pattern

Cho các global settings của program:

```rust
#[account]
pub struct SettingsAccount {
    pub authority: Pubkey,
    pub token_account: Pubkey,
}

impl SettingsAccount {
    pub const SIZE: usize = 8 + std::mem::size_of::<SettingsAccount>();

    pub fn set(&mut self, authority: Pubkey, token_account: Pubkey) -> Result<()> {
        self.authority = authority;
        self.token_account = token_account;
        Ok(())
    }
}
```

## ✅ Best Practices

| Practice | Mô tả |
|----------|-------|
| **SIZE constant** | Luôn định nghĩa để sử dụng trong `#[account(space = ...)]` |
| **Self:: prefix** | Dùng `Self::` khi reference constants trong cùng impl |
| **Doc comments** | Mô tả mục đích của account với `///` |
| **Encapsulation** | Logic thay đổi state nằm trong account methods |
| **Return Result** | Methods có thể fail trả về `Result<()>` |
| **Private helpers** | Internal functions với `fn` (không pub) |
