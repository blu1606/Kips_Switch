# Phase 1: Foundation - Smart Contract & Project Setup

## 🎯 Mục tiêu Phase
Thiết lập nền tảng dự án: scaffold project, viết Solana Program (Anchor), kết nối wallet, và deploy lên Devnet.

## 📋 Scope tổng quan

| Task | File | Mô tả | Priority |
|------|------|-------|----------|
| Project Setup | [1.1-project-setup.md](./1.1-project-setup.md) | Scaffold Next.js + Anchor project | 🔴 Critical |
| Smart Contract | [1.2-smart-contract.md](./1.2-smart-contract.md) | Vault PDA, Instructions (init, ping, release) | 🔴 Critical |
| Wallet Connect | [1.3-wallet-connect.md](./1.3-wallet-connect.md) | Solana Wallet Adapter integration | 🟡 High |
| Deploy Devnet | [1.4-deploy-devnet.md](./1.4-deploy-devnet.md) | Build & deploy to Solana Devnet | 🟡 High |

## 🔗 Dependencies
```
1.1-project-setup
       ↓
1.2-smart-contract
       ↓
1.3-wallet-connect ←→ 1.4-deploy-devnet
```

## ✅ Definition of Done
- [ ] Project chạy được `npm run dev` không lỗi
- [ ] Anchor program build thành công (`anchor build`)
- [ ] Deploy được lên Devnet với Program ID
- [ ] UI có nút Connect Wallet hoạt động với Phantom/Solflare

## ⏱️ Estimated Time
**Day 1** của 5-day sprint
