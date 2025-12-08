# Architecture Document: Deadman's Switch (Solana Edition)

| Metadata | Details |
| :--- | :--- |
| **Project Name** | Deadman's Switch (Digital Legacy Protocol) |
| **Version** | 1.0 (MVP) |
| **Status** | **UPDATED** (Rust/Anchor) |
| **Tech Stack** | Next.js, Rust (Anchor), Solana, IPFS (Pinata) |

## 1\. High Level Architecture

### 1.1 Technical Summary

The system utilizes a **Hybrid Solana Architecture**:

  * **Trust Layer (On-chain):** A **Solana Program** (written in Rust/Anchor) manages the "Liveness" state, PDAs (Program Derived Addresses) for each Vault, and access rights. It serves as the immutable source of truth.
  * **Storage Layer (Decentralized):** IPFS (via Pinata) stores the encrypted content (files/text) to ensure data permanence and privacy without bloating the blockchain.
  * **Application Layer (Off-chain):** A Next.js dApp connects to user wallets (Phantom/Solflare) via the Solana Wallet Adapter for interaction and client-side encryption.

### 1.2 System Context Diagram

```mermaid
graph TD
    User[Owner] -->|1. Connect & Encrypt| ClientApp[Next.js Client]
    ClientApp -->|2. Upload Encrypted Data| Pinata[IPFS / Pinata]
    Pinata -->|3. Return CID| ClientApp
    ClientApp -->|4. Initialize Vault Account (PDA)| SolanaProgram[Solana Program (Anchor)]
    
    User -->|5. Check-in (Instruction)| SolanaProgram
    
    Cron[Next.js Cron Job] -->|6. Fetch Accounts| SolanaProgram
    Cron -->|7. Send Email| Resend[Resend API]
    Resend -->|8. Notify| Recipient[Recipient Email]
    
    RecipientUser[Recipient Wallet] -->|9. Connect & Claim| ClientApp
    ClientApp -->|10. Verify PDA Authority| SolanaProgram
    SolanaProgram -->|11. Return Data| ClientApp
    ClientApp -->|12. Decrypt Locally| RecipientUser
```

-----

## 2\. Tech Stack Selection (Solana Optimized)

| Category | Technology | Version | Rationale |
| :--- | :--- | :--- | :--- |
| **Blockchain** | **Solana** | Devnet/Mainnet | High speed (400ms block time), negligible fees ($0.00025/tx). |
| **Smart Contract** | **Rust + Anchor** | ^0.29.0 | The standard framework for secure Solana program development. |
| **Framework** | Next.js | 14 (App Router) | Optimized full-stack framework. |
| **Web3 Client** | **Solana Wallet Adapter** | Latest | Standard support for Phantom, Solflare, Backpack. |
| **SDK Integration** | **@coral-xyz/anchor** | Latest | Client library for easy interaction with Anchor IDL. |
| **Encryption** | CryptoJS / TweetNaCl | Latest | Client-side encryption libraries. |
| **Storage** | Pinata (IPFS) | API v3 | Decentralized file storage pinning. |

-----

## 3\. Data Models & Schema (Anchor Specific)

Unlike Solidity (which often uses Mappings), on Solana we use **PDAs (Program Derived Addresses)**. Each "Vault" is a separate **Account** derived from a seed.

### 3.1 Account Structs (Rust)

```rust
use anchor_lang::prelude::*;

#[account]
pub struct Vault {
    pub owner: Pubkey,          // 32 bytes
    pub recipient: Pubkey,      // 32 bytes
    pub ipfs_cid: String,       // String (Limit length, e.g., 64 bytes)
    pub encrypted_key: String,  // String (Encrypted AES Key)
    pub time_interval: i64,     // Seconds (u64 or i64)
    pub last_check_in: i64,     // Timestamp
    pub is_released: bool,      // 1 byte
    pub bump: u8,               // 1 byte (to store bump seed)
}

impl Vault {
    // Calculate space required for rent-exemption
    // Discriminator (8) + Pubkey (32) + Pubkey (32) + String Prefix (4) + CID (64) 
    // + String Prefix (4) + Key (128) + i64 (8) + i64 (8) + bool (1) + u8 (1)
    pub const MAX_SIZE: usize = 8 + 32 + 32 + (4 + 64) + (4 + 128) + 8 + 8 + 1 + 1; 
}
```

### 3.2 Instructions (RPC Calls)

1.  `initialize_vault`:

      * **Context:** Create a new `Vault` account at PDA `['vault', owner_pubkey]`.
      * **Input:** `ipfs_cid`, `encrypted_key`, `recipient`, `time_interval`.
      * **Logic:** Set `last_check_in = clock.unix_timestamp`.

2.  `ping` (Check-in):

      * **Context:** `owner` signer, `vault` account (mutable).
      * **Logic:** Update `vault.last_check_in = clock.unix_timestamp`.

3.  `trigger_release` (Optional - or Client-side check):

      * **Context:** Callable by anyone.
      * **Logic:** If `clock.unix_timestamp > last_check_in + time_interval` -\> set `vault.is_released = true`.

-----

## 4\. API Specification (Next.js API Routes)

The Backend logic remains the same, adapted for Solana libraries.

### 4.1 `GET /api/cron/check-status`

  * **Changed Logic:**
      * Use `@coral-xyz/anchor` to fetch `program.account.vault.all()` (Retrieve all Vault accounts).
      * Loop through accounts (process off-chain to save compute units).
      * Condition: If `now > vault.lastCheckIn + vault.timeInterval`:
          * Send Warning Email or Release Notification.

-----

## 5\. Security & Key Management (Solana Specific)

### 5.1 Encryption Flow

Solana developers often prefer `TweetNaCl.js` as it is compatible with Ed25519 keypairs used by Solana wallets.

  * **Key Encryption Strategy:**
      * **MVP Decision:** To maintain "Zero-Knowledge" simplicity, the User (Owner) will sign a message -\> The Hash of that signature becomes the AES Key.
      * **Recipient Access:** The Recipient will need to claim access to the Vault. Once claimed, the specific decryption instructions (or the key itself, if securely shared via a secondary channel) are used.
      * **Better MVP Alternative:** Use an **RSA** library on the client. The user inputs the Recipient's RSA Public Key to encrypt the AES Key before storing it on-chain.

### 5.2 PDA Security

  * **Seeds:** `[b"vault", owner.key().as_ref()]`.
  * **Constraint:** This ensures each wallet address can create exactly one Vault (simplifying the MVP). To allow multiple vaults, a `vault_id` would be added to the seeds.

-----

## 6\. Directory Structure (Anchor Project)

```text
deadmans-switch/
├── anchor/                     # Solana Smart Contract
│   ├── programs/
│   │   └── deadmans-switch/
│   │       └── src/
│   │           └── lib.rs      # Main Logic
│   ├── tests/                  # TypeScript tests
│   └── Anchor.toml
├── src/                        # Next.js Application
│   ├── app/
│   │   ├── api/
│   │   ├── ...
│   ├── components/             # UI Components
│   │   ├── WalletButton.tsx    # Solana Wallet Adapter
│   │   ├── ...
│   ├── utils/
│   │   ├── anchor.ts           # Connection & IDL Helpers
│   │   └── crypto.ts           # Encryption Logic
└── ...
```
