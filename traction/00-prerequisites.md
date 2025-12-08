# 00 - Prerequisites Checklist

> Hoàn thành checklist này **trước khi bắt đầu code**.

---

## 🛠️ Development Tools

### Required
- [ ] **Node.js 18+**: `node -v`
- [ ] **Rust**: `rustup install stable && rustc --version`
- [ ] **Solana CLI**: 
  ```bash
  sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
  solana --version
  ```
- [ ] **Anchor CLI**:
  ```bash
  cargo install --git https://github.com/coral-xyz/anchor avm --locked
  avm install latest && avm use latest
  anchor --version
  ```

### Verify Setup
```bash
solana config set --url devnet
solana-keygen new  # nếu chưa có keypair
solana airdrop 2   # lấy SOL test
```

---

## 🔑 API Keys & Accounts

| Service | Purpose | Link | Env Variable |
|---------|---------|------|--------------|
| **Pinata** | IPFS storage | [pinata.cloud](https://pinata.cloud) | `NEXT_PUBLIC_PINATA_JWT` |
| **Resend** | Email (Phase 4) | [resend.com](https://resend.com) | `RESEND_API_KEY` |
| **Helius** | Mainnet RPC (optional) | [helius.dev](https://helius.dev) | `NEXT_PUBLIC_RPC_URL` |

---

## 👛 Test Wallets

- [ ] **Owner wallet** - tạo vault, check-in
- [ ] **Recipient wallet** - test claim flow
- [ ] Cả 2 có SOL devnet

---

## 📝 Environment Template

Tạo file `.env.local`:
```env
# Network
NEXT_PUBLIC_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=<after_deploy>

# IPFS
NEXT_PUBLIC_PINATA_JWT=<your_jwt>

# Email (Phase 4)
RESEND_API_KEY=<your_key>
EMAIL_FROM=noreply@yourdomain.com

# Cron Security
CRON_SECRET=<random_string>
```

---

## ⚙️ MVP Decisions (Đã chọn)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Key encryption | Signature-based | Đơn giản cho MVP |
| Email storage | Off-chain | Tránh bloat on-chain |
| Vaults per wallet | 1 | Đơn giản, Phase 2 mở rộng |

---

## ✅ Ready to Code?

Khi tất cả items trên đã ✅, bạn có thể bắt đầu **Phase 1**.
