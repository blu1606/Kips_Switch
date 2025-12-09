# 03. Instructions

## 🎯 Handler Pattern

Mỗi instruction được tổ chức theo pattern:
1. **Context struct** với `#[derive(Accounts)]`
2. **Handler method** trong `impl` block

```rust
use crate::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
pub struct YourInstruction<'info> {
    // accounts here
}

impl<'info> YourInstruction<'info> {
    pub fn handler(&mut self, arg: u64) -> Result<()> {
        // logic here
        Ok(())
    }
}
```

## 🔗 Gọi từ lib.rs

```rust
/// Documentation cho instruction
pub fn your_instruction(ctx: Context<YourInstruction>, arg: u64) -> Result<()> {
    ctx.accounts.handler(arg)
}

// Với bump từ init:
pub fn stake(ctx: Context<Stake>, amount: u64, duration: u128) -> Result<()> {
    ctx.accounts.handler(amount, duration, *ctx.bumps.get("vault").unwrap())
}
```

## 📋 Account Constraints

### Basic Constraints

```rust
#[derive(Accounts)]
pub struct Example<'info> {
    // Mutable account
    #[account(mut)]
    pub user: Account<'info, TokenAccount>,
    
    // Address check với custom error
    #[account(address = EXPECTED_MINT @ CustomError::InvalidMint)]
    pub mint: Account<'info, Mint>,
    
    // Ownership check
    #[account(
        has_one = authority @ CustomError::Unauthorized,
        has_one = vault @ CustomError::InvalidVault,
    )]
    pub state: Account<'info, StateAccount>,
    
    // Custom constraint
    #[account(
        constraint = state.is_active @ CustomError::NotActive,
    )]
    pub state: Account<'info, StateAccount>,
    
    // Signer
    pub authority: Signer<'info>,
}
```

### Init Account với PDA

```rust
#[account(
    init,
    payer = authority,
    space = StateAccount::SIZE,
    seeds = [
        b"state",
        mint.key().as_ref(),
        authority.key().as_ref()
    ],
    bump,
)]
pub state: Account<'info, StateAccount>,
```

### Init Token Account

```rust
#[account(
    init,
    payer = authority,
    token::mint = mint,
    token::authority = vault,  // self-owned
    seeds = [b"vault", mint.key().as_ref(), authority.key().as_ref()],
    bump,
)]
pub vault: Account<'info, TokenAccount>,
```

### Close Account

```rust
#[account(
    mut,
    close = authority,  // rent returns to authority
    has_one = vault @ CustomError::InvalidVault,
    has_one = authority @ CustomError::Unauthorized,
)]
pub state: Account<'info, StateAccount>,
```

## 🔍 Validate trong Handler

```rust
impl<'info> Stake<'info> {
    pub fn handler(&mut self, amount: u64, duration: u128, vault_bump: u8) -> Result<()> {
        // Validation với require!
        require!(
            duration >= StateAccount::DURATION_MIN,
            CustomError::DurationTooShort
        );
        require!(
            amount > 0,
            CustomError::AmountNotEnough
        );

        // Business logic
        self.state.init(amount, self.authority.key(), self.vault.key(), vault_bump);

        // Token transfer (using macro or CPI)
        // ...
        Ok(())
    }
}
```

## ✔️ CHECK Accounts

Khi cần AccountInfo raw:

```rust
/// CHECK: we only want to verify this account does not exist
#[account(
    constraint = account.data_is_empty() @ CustomError::AccountExists,
)]
pub some_account: AccountInfo<'info>,
```

## 📦 Common System Accounts

```rust
pub system_program: Program<'info, System>,
pub token_program: Program<'info, Token>,
pub rent: Sysvar<'info, Rent>,
```

## ✅ Best Practices

| Practice | Mô tả |
|----------|-------|
| **Handler trong impl** | Logic trong `impl` block, không trong lib.rs |
| **Declarative constraints** | Ưu tiên `#[account(...)]` constraints |
| **Custom errors** | Dùng `@ CustomError` cho mỗi constraint |
| **`&mut self` hoặc `&self`** | Tùy theo có modify account hay không |
| **Pass bumps** | Từ lib.rs vào handler khi cần cho PDA signing |
| **Document CHECK** | Luôn giải thích tại sao dùng AccountInfo |
