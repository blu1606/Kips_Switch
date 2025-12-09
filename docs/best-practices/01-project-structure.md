# 01. Cấu trúc Project

## 📁 Cấu trúc thư mục chuẩn

```
programs/{program-name}/
├── Cargo.toml
└── src/
    ├── lib.rs              # Entry point, program declaration
    ├── state.rs            # Account structs và state logic
    ├── errors.rs           # Program-specific errors
    ├── macros.rs           # Program-specific macros (optional)
    ├── security.rs         # Security metadata
    └── instructions/       # Thư mục chứa các instructions
        ├── mod.rs          # Re-export tất cả instructions
        ├── init.rs
        ├── action.rs
        └── ...
```

## 📝 lib.rs Template

```rust
mod errors;
mod instructions;
mod macros;       // optional
mod security;
mod state;

use anchor_lang::prelude::*;
pub use errors::*;      // expose errors for CPI
use instructions::*;
pub use state::*;       // expose state for CPI

declare_id!("YourProgramId11111111111111111111111111111");

#[program]
pub mod your_program {
    use super::*;

    /// Documentation cho instruction
    pub fn your_instruction(ctx: Context<YourContext>, arg: u64) -> Result<()> {
        ctx.accounts.handler(arg)
    }
}
```

## 📝 instructions/mod.rs Template

```rust
//! Instructions for {ProgramName}.

pub mod init;
pub mod your_instruction;
// ... more instructions

pub use init::*;
pub use your_instruction::*;
// ... re-export all
```

## ✅ Best Practices

1. **Một file cho mỗi instruction** - Dễ maintain và review
2. **Re-export trong mod.rs** - Sử dụng `pub use` để expose public items
3. **Expose state/errors cho CPI** - Dùng `pub use` ở lib.rs
4. **Shared module** - Tạo common crate cho các utilities dùng chung

## 📦 Cargo.toml Template

```toml
[package]
name = "{program-name}"
version = "1.0.0"
description = "{Program Description}"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]

[features]
no-entrypoint = []
cpi = ["no-entrypoint"]
default = []
mainnet = []

[dependencies]
anchor-lang = "0.29.0"
anchor-spl = "0.29.0"
# your-common = { path = "../../common" }  # optional shared module
```
