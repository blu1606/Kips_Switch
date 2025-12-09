# 05. Macros & CPI

## 🔧 Common Macros Pattern

### Token Transfer Macros

```rust
#[macro_export]
macro_rules! transfer_tokens_to_vault {
    ($accounts: expr, $amount: expr) => {
        cpi::transfer_tokens(
            $accounts.token_program.to_account_info(),
            $accounts.user.to_account_info(),
            $accounts.vault.to_account_info(),
            $accounts.authority.to_account_info(),
            &[],
            $amount,
        )
    };
}

#[macro_export]
macro_rules! transfer_tokens_from_vault {
    ($accounts: expr, $to: ident, $seeds: expr, $amount: expr) => {
        cpi::transfer_tokens(
            $accounts.token_program.to_account_info(),
            $accounts.vault.to_account_info(),
            $accounts.$to.to_account_info(),
            $accounts.vault.to_account_info(),
            $seeds,
            $amount,
        )
    };
}

#[macro_export]
macro_rules! close_vault {
    ($accounts: expr, $seeds: expr) => {
        cpi::close_token_account(
            $accounts.token_program.to_account_info(),
            $accounts.vault.to_account_info(),
            $accounts.authority.to_account_info(),
            $accounts.vault.to_account_info(),
            $seeds,
        )
    };
}
```

## 🌱 Seeds Macro

Định nghĩa seeds macro cho PDA signing:

```rust
#[macro_export]
macro_rules! vault_seeds {
    ($state: expr, $vault: expr) => {
        &[&[
            b"vault".as_ref(),
            $vault.mint.as_ref(),
            $state.authority.as_ref(),
            &[$state.vault_bump],
        ][..]][..]
    };
}
```

**Sử dụng:**

```rust
impl<'info> Withdraw<'info> {
    pub fn handler(&self) -> Result<()> {
        let amount = self.state.calculate_withdraw(self.vault.amount);
        if amount > 0 {
            transfer_tokens_from_vault!(self, user, vault_seeds!(self.state, self.vault), amount)
        } else {
            Ok(())
        }
    }
}
```

## 🔗 CPI Helper Functions

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::{CloseAccount, Transfer};

pub fn transfer_tokens<'info, 'a, 'b, 'c>(
    token_program: AccountInfo<'info>,
    from: AccountInfo<'info>,
    to: AccountInfo<'info>,
    authority: AccountInfo<'info>,
    signer_seeds: &'a [&'b [&'c [u8]]],
    amount: u64,
) -> Result<()> {
    anchor_spl::token::transfer(
        CpiContext::new_with_signer(
            token_program,
            Transfer { from, to, authority },
            signer_seeds,
        ),
        amount,
    )
}

pub fn close_token_account<'info, 'a, 'b, 'c>(
    token_program: AccountInfo<'info>,
    account: AccountInfo<'info>,
    destination: AccountInfo<'info>,
    authority: AccountInfo<'info>,
    signer_seeds: &'a [&'b [&'c [u8]]],
) -> Result<()> {
    anchor_spl::token::close_account(CpiContext::new_with_signer(
        token_program,
        CloseAccount { account, destination, authority },
        signer_seeds,
    ))
}
```

## ⚡ CPI đến Program khác

```rust
use other_program::cpi::{accounts::SomeAction, some_action};

// Manual CPI call
other_program::cpi::some_action(
    CpiContext::new_with_signer(
        accounts.other_program.to_account_info(),
        SomeAction {
            user: accounts.user.to_account_info(),
            state: accounts.state.to_account_info(),
            authority: accounts.authority.to_account_info(),
            token_program: accounts.token_program.to_account_info(),
        },
        seeds,
    ),
    amount,
)
```

## ✅ Best Practices

| Practice | Mô tả |
|----------|-------|
| **Reusable macros** | Tạo macros cho các operations lặp lại |
| **Seeds macro per program** | Định nghĩa riêng cho mỗi program |
| **#[macro_export]** | Export macro để dùng trong crate |
| **CPI helpers** | Functions wrapper cho common CPI operations |
| **CPI với signer** | Dùng `CpiContext::new_with_signer` cho PDA signing |
| **to_account_info()** | Chuyển đổi Account thành AccountInfo cho CPI |
