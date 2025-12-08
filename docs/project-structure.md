# Deadman's Switch - Dự kiến Cấu trúc File Dự án

> **Tổng quan**: Đây là kế hoạch cấu trúc file cho dự án Deadman's Switch - một giao thức thừa kế kỹ thuật số phi tập trung trên Solana.

---

## 📂 Cấu trúc Tổng quan

```text
deadman-switch/
├── 📁 deadmans-switch/             # Anchor Project (đã init)
│   ├── 📁 programs/
│   │   └── 📁 deadmans-switch/
│   │       └── 📁 src/
│   │           └── lib.rs          # Main program logic
│   ├── 📁 tests/
│   │   └── deadmans-switch.ts      # Anchor tests
│   ├── 📁 target/                  # Build artifacts
│   ├── Anchor.toml
│   ├── Cargo.toml
│   └── package.json
│
├── 📁 src/                         # Next.js Application
│   ├── 📁 app/                     # App Router (Next.js 14)
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Landing
│   │   ├── globals.css
│   │   ├── 📁 dashboard/
│   │   │   └── page.tsx
│   │   ├── 📁 create/
│   │   │   └── page.tsx
│   │   ├── 📁 claim/
│   │   │   └── page.tsx
│   │   └── 📁 api/
│   │       ├── 📁 cron/check-status/
│   │       │   └── route.ts
│   │       └── 📁 email/send/
│   │           └── route.ts
│   │
│   ├── 📁 components/
│   │   ├── 📁 ui/                  # Shadcn components
│   │   ├── 📁 layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── 📁 wallet/
│   │   │   ├── WalletContextProvider.tsx
│   │   │   └── WalletButton.tsx
│   │   ├── 📁 vault/
│   │   │   ├── VaultCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   └── CheckInButton.tsx
│   │   ├── 📁 wizard/
│   │   │   ├── WizardContainer.tsx
│   │   │   ├── StepUploadSecret.tsx
│   │   │   ├── StepSetRecipient.tsx
│   │   │   ├── StepSetInterval.tsx
│   │   │   └── StepConfirm.tsx
│   │   └── 📁 claim/
│   │       ├── ClaimButton.tsx
│   │       └── DecryptProgress.tsx
│   │
│   ├── 📁 hooks/
│   │   ├── useVault.ts
│   │   ├── useProgram.ts
│   │   └── useCountdown.ts
│   │
│   ├── 📁 utils/
│   │   ├── anchor.ts               # Program ID, IDL
│   │   ├── crypto.ts               # AES encrypt/decrypt
│   │   ├── ipfs.ts                 # Pinata API
│   │   ├── format.ts
│   │   └── constants.ts
│   │
│   ├── 📁 lib/
│   │   ├── resend.ts
│   │   └── solana.ts
│   │
│   └── 📁 types/
│       └── vault.ts
│
├── 📁 public/
│   ├── favicon.ico
│   └── logo.svg
│
├── 📁 docs/                        # ← You are here
├── 📁 traction/
│
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── vercel.json
├── .env.local
└── .env.example
```

---

## 🔧 Chi tiết Anchor Program

| File | Mô tả | Phase |
|------|-------|-------|
| `lib.rs` | Program entry, instructions | 1.2 |
| `state.rs` (optional) | Vault struct | 1.2 |
| `errors.rs` (optional) | Custom errors | 1.2 |

### Vault Account Structure
```rust
#[account]
pub struct Vault {
    pub owner: Pubkey,         // 32
    pub recipient: Pubkey,     // 32
    pub ipfs_cid: String,      // 64
    pub encrypted_key: String, // 128
    pub time_interval: i64,    // 8
    pub last_check_in: i64,    // 8
    pub is_released: bool,     // 1
    pub bump: u8,              // 1
}
```

---

## 📦 Key Dependencies

```json
{
  "@solana/web3.js": "^1.x",
  "@coral-xyz/anchor": "^0.29.x",
  "@solana/wallet-adapter-react": "^0.15.x",
  "@solana/wallet-adapter-wallets": "^0.19.x",
  "resend": "^2.x",
  "tweetnacl": "^1.x"
}
```

---

## 📝 Environment Variables

```env
NEXT_PUBLIC_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=<after_deploy>
NEXT_PUBLIC_PINATA_JWT=<jwt>
RESEND_API_KEY=<key>
CRON_SECRET=<secret>
```

---

## 🗓️ Phase → Files Mapping

| Phase | Files |
|-------|-------|
| **1** | `deadmans-switch/`, wallet components, `anchor.ts` |
| **2** | `crypto.ts`, `ipfs.ts`, wizard components |
| **3** | `claim/`, permission hooks, decrypt flow |
| **4** | API routes, email, UI polish, `vercel.json` |
