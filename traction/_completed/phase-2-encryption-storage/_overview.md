# Phase 2: Encryption & Storage

## 🎯 Mục tiêu Phase
Implement client-side encryption (Zero-Knowledge) và upload dữ liệu lên IPFS qua Pinata.

## 📋 Scope tổng quan

| Task | File | Mô tả | Priority |
|------|------|-------|----------|
| AES Encryption | [2.1-aes-encryption.md](./2.1-aes-encryption.md) | Client-side AES-GCM encrypt/decrypt | 🔴 Critical |
| IPFS Upload | [2.2-ipfs-pinata.md](./2.2-ipfs-pinata.md) | Pinata API integration | 🔴 Critical |
| Create Vault Flow | [2.3-create-vault-flow.md](./2.3-create-vault-flow.md) | Full wizard: Encrypt → Upload → Contract | 🟡 High |

## 🔗 Dependencies
```
Phase 1 (Smart Contract deployed)
            ↓
    2.1-aes-encryption
            ↓
    2.2-ipfs-pinata
            ↓
    2.3-create-vault-flow
```

## 🔐 Zero-Knowledge Principle
> **CRITICAL:** Dữ liệu gốc KHÔNG BAO GIỜ rời khỏi browser. 
> Server và IPFS chỉ thấy ciphertext.

## ✅ Definition of Done
- [ ] Encrypt/decrypt file hoạt động đúng trong browser
- [ ] Upload encrypted file lên IPFS, nhận CID
- [ ] Create Vault wizard hoàn chỉnh 4 bước
- [ ] Network tab chỉ thấy ciphertext, không thấy nội dung gốc

## ⏱️ Estimated Time
**Day 2** của 5-day sprint
