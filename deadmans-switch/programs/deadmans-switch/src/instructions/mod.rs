//! Instructions for the Deadman's Switch program.

pub mod initialize_vault;
pub mod ping;
pub mod set_delegate;
pub mod trigger_release;
pub mod top_up_bounty;
pub mod update_vault;
pub mod close_vault;
pub mod claim_and_close;

pub use initialize_vault::*;
pub use ping::*;
pub use set_delegate::*;
pub use trigger_release::*;
pub use top_up_bounty::*;
pub use update_vault::*;
pub use close_vault::*;
pub use claim_and_close::*;
