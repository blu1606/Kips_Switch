# 06. Security

## 🔐 Security.txt Metadata

Mỗi program **NÊN** có security metadata:

```rust
#![allow(unused_imports)]

#[macro_export]
macro_rules! security_txt {
    ($($name:ident: $value:expr),*) => {
        #[cfg_attr(target_arch = "bpf", link_section = ".security.txt")]
        #[allow(dead_code)]
        #[no_mangle]
        pub static security_txt: &str = concat! {
            "=======BEGIN SECURITY.TXT V1=======\0",
            $(stringify!($name), "\0", $value, "\0",)*
            "=======END SECURITY.TXT V1=======\0"
        };
    };
}

// Sử dụng
#[cfg(not(feature = "no-entrypoint"))]
security_txt! {
    name: "Your Program",
    project_url: "https://yourproject.io",
    contacts: "email:security@yourproject.io",
    policy: "https://github.com/your-org/your-program/SECURITY.md",
    source_code: "https://github.com/your-org/your-program"
}
```

## 🛡️ Account Validation Patterns

### Authority Check

```rust
#[account(
    has_one = authority @ CommonError::Unauthorized,
)]
pub state: Account<'info, StateAccount>,
pub authority: Signer<'info>,
```

### Vault Ownership

```rust
#[account(
    has_one = vault @ CommonError::InvalidVault,
)]
pub state: Account<'info, StateAccount>,
#[account(mut)]
pub vault: Account<'info, TokenAccount>,
```

### Mint Validation

```rust
#[account(address = EXPECTED_MINT @ CommonError::InvalidMint)]
pub mint: Account<'info, Mint>,
```

### Check Account Closed

```rust
/// CHECK: we only want to verify this account does not exist
#[account(
    constraint = account.data_is_empty() @ CustomError::AccountExists,
)]
pub some_account: AccountInfo<'info>,
```

### Vault Empty/Not Empty

```rust
// Vault phải có tokens
#[account(mut, constraint = vault.amount != 0 @ CommonError::VaultEmpty)]
pub vault: Account<'info, TokenAccount>,

// Vault phải rỗng
#[account(mut, constraint = vault.amount == 0 @ CommonError::VaultNotEmpty)]
pub vault: Account<'info, TokenAccount>,
```

### Time Lock

```rust
#[account(
    constraint = state.unlock_time < Clock::get()?.unix_timestamp @ CustomError::Locked,
)]
pub state: Account<'info, StateAccount>,
```

## 🔑 PDA Signing

```rust
// Tạo seeds với bump
let seeds = &[&[
    b"vault",
    self.vault.mint.as_ref(),
    self.state.authority.as_ref(),
    &[self.state.vault_bump],
][..]][..];

// Sử dụng trong CPI
anchor_spl::token::transfer(
    CpiContext::new_with_signer(
        self.token_program.to_account_info(),
        Transfer {
            from: self.vault.to_account_info(),
            to: self.user.to_account_info(),
            authority: self.vault.to_account_info(),
        },
        seeds,
    ),
    amount,
)
```

## 🚨 Common Vulnerabilities

| Vulnerability | Prevention |
|---------------|------------|
| **Missing signer check** | Dùng `Signer<'info>` type |
| **Missing owner check** | Dùng `has_one = authority` |
| **Wrong PDA seeds** | Kiểm tra seeds match với init |
| **Missing vault check** | Dùng `has_one = vault` |
| **Integer overflow** | Dùng checked math hoặc `try_into()` |
| **Time manipulation** | Dùng `Clock::get()?.unix_timestamp` |

## 📋 Security Checklist

- [ ] Security.txt metadata configured
- [ ] All authority checks với `Signer<'info>`
- [ ] Vault ownership verified với `has_one`
- [ ] Mint address validated
- [ ] PDA seeds consistent
- [ ] Time locks implemented correctly
- [ ] Integer overflow handled
- [ ] Custom errors for all constraints
