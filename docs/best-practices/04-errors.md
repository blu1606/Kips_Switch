# 04. Errors

## 🏗️ Cấu trúc Errors

### Common/Shared Errors

Định nghĩa trong shared module cho các lỗi dùng chung:

```rust
use anchor_lang::prelude::*;

#[error_code]
pub enum CommonError {
    #[msg("This account is not authorized to perform this action.")]
    Unauthorized,
    #[msg("This account is owned by an invalid program.")]
    InvalidOwner,
    #[msg("This account is not valid.")]
    InvalidAccount,
    #[msg("This token account is not valid.")]
    InvalidTokenAccount,
    #[msg("This mint is invalid.")]
    InvalidMint,
    #[msg("This account has an invalid vault.")]
    InvalidVault,
    #[msg("This vault is empty.")]
    VaultEmpty,
    #[msg("This vault is not empty.")]
    VaultNotEmpty,
}
```

### Program-Specific Errors

Định nghĩa errors riêng cho từng program:

```rust
// errors.rs
use anchor_lang::prelude::*;

/***
 * Errors
 */

#[error_code]
pub enum StakingError {
    #[msg("This amount is not enough.")]
    AmountNotEnough,
    
    #[msg("This account is already initialized.")]
    AlreadyInitialized,
    
    #[msg("This stake is already unstaked.")]
    AlreadyUnstaked,
    
    #[msg("This stake is not yet unstaked.")]
    NotUnstaked,
    
    #[msg("This stake is still locked.")]
    Locked,
    
    #[msg("This duration is not long enough.")]
    DurationTooShort,
    
    #[msg("This duration is too long.")]
    DurationTooLong,
    
    #[msg("This account does not exist.")]
    DoesNotExist,
}
```

## 📝 Naming Convention

| Prefix/Pattern | Ví dụ | Mô tả |
|----------------|-------|-------|
| `Already*` | `AlreadyStaked` | Trạng thái đã xảy ra |
| `Not*` | `NotUnstaked` | Chưa đạt trạng thái |
| `Invalid*` | `InvalidAccount` | Giá trị không hợp lệ |
| `*NotEnough` | `AmountNotEnough` | Không đủ giá trị |
| `*TooShort/Long` | `DurationTooShort` | Vượt ngưỡng |

## 🔗 Sử dụng Errors

### Trong Account Constraints

```rust
#[account(
    has_one = authority @ CommonError::Unauthorized,
    has_one = vault @ CommonError::InvalidVault,
    constraint = state.is_active @ StakingError::NotActive,
)]
pub state: Account<'info, StateAccount>,
```

### Trong Handler với require!

```rust
pub fn handler(&mut self, amount: u64, duration: u128) -> Result<()> {
    require!(
        duration >= StateAccount::DURATION_MIN,
        StakingError::DurationTooShort
    );
    
    require!(
        amount > 0,
        StakingError::AmountNotEnough
    );
    
    Ok(())
}
```

### Return Error trực tiếp

```rust
pub fn handler(&self) -> Result<()> {
    if some_condition {
        return Err(StakingError::Locked.into());
    }
    Ok(())
}
```

## 📤 Export Errors

Trong `lib.rs`, expose errors cho CPI:

```rust
mod errors;
pub use errors::*;  // expose errors for CPI
```

## ✅ Best Practices

| Practice | Mô tả |
|----------|-------|
| **Descriptive messages** | Message rõ ràng, có context |
| **Shared errors** | Generic errors trong common module |
| **Program-specific enum** | Logic riêng cho từng program |
| **Consistent naming** | Theo pattern `Already*`, `Not*`, `Invalid*` |
| **Constraint errors** | Luôn thêm `@ Error` trong constraints |
| **Export for CPI** | `pub use errors::*` trong lib.rs |
