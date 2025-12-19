# 🚀 Phase 15: LazorKit Integration

> **Philosophy:** "Seedless onboarding & Gasless transactions for every user"  
> **Focus:** Passkey-native authentication & Paymaster sponsorship  
> **Updated:** 2025-12-19

---

## 🎯 Core Problem

```
Current Experience:
  1. User needs a wallet (Phantom/Solflare)
  2. User needs a seed phrase (Security risk)
  3. User needs SOL for gas (Onboarding friction)
```

**Target:** Users can sign up with Biometrics (FaceID/TouchID) and transact without holding any SOL.

---

## 📊 Feature Matrix

| ID | Feature | Difficulty | Benefit | Priority | Target |
|----|---------|------------|---------|----------|--------|
| **15.1** | Passkey Onboarding | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **P0** | Beta |
| **15.2** | Gasless Transactions | ⭐⭐ | ⭐⭐⭐⭐⭐ | **P0** | Beta |
| **15.3** | Account Recovery | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | P1 | v2 |

---

## 📂 Spec Files

| File | Content | Status |
|------|---------|--------|
| [15.1-passkey-onboarding.md](./15.1-passkey-onboarding.md) | Passkey-native smart wallet setup | 📝 Spec |
| [15.2-gasless-tx-paymaster.md](./15.2-gasless-tx-paymaster.md) | Paymaster integration for sponsored fees | 📝 Spec |

---

## 🔗 Dependencies

| Feature | Depends On | Status | Note |
|---------|------------|--------|------|
| 15.1 Passkey | WebAuthn Support | ✅ Browser | Standard feature |
| 15.1 Passkey | LazorKit React SDK | 📝 Planned | New dependency |
| 15.2 Gasless | LazorKit Paymaster | 📝 Planned | Kora Devnet |

---

## 🚀 Execution Order

1. **15.1 Passkey Onboarding** - Enable biometric-first accounts.
2. **15.2 Gasless Transactions** - Remove SOL requirement for vault creation/claims.
3. **15.3 Account Recovery** - Social recovery paths.

---

## 💡 Key Insight

> **"The Seedless Revolution"**  
> We remove the biggest barrier to Web3: The Seed Phrase.  
> Users don't care about blockchain; they care about security and ease.  
> LazorKit gives us both.
