# 🌐 Phase 7: Decentralized Trigger & Convenience

> **Updated:** 2025-12-09  
> **Goal:** Eliminate cron dependency + reduce check-in friction while keeping core UX.

---

## 🎯 Design Principles

1. **Keep Classic Check-in** - Core identity, Kip needs to be "fed"
2. **Decentralize the TRIGGER** - Not the check-in itself
3. **Privacy First** - No public vault discovery
4. **Simple > Clever** - Easy to test, demo, explain

---

## ✅ Adopted Features

| ID | Feature | Feasibility | Status |
|----|---------|-------------|--------|
| **7.1** | Bounty Hunter Protocol | 🟢 Easy | Spec Ready |
| **7.2** | Delegate Check-in | 🟢 Done | ✅ Implemented |
| **7.3** | Email Magic Link | 🟡 Medium | Spec Ready |

---

## ❌ Rejected Ideas

| Idea | Reason |
|------|--------|
| Optimistic Heartbeat | Phá vỡ core UX, privacy risk, phức tạp |
| Yield Endowment | Rủi ro cao, chỉ viable cho vault lớn |
| Timelock Encryption | Không thể update timelock sau encrypt |
| Proof-of-Active-Life | Cần server/oracle, không trustless |

---

## 📂 Specs

### [7.1-bounty-hunter.md](./7.1-bounty-hunter.md)
Permissionless `trigger_release` với small bounty incentive.

### [7.2-delegate-checkin.md](./7.2-delegate-checkin.md)
Hot wallet delegate chỉ có quyền ping. ✅ Already done in contract.

### [7.3-email-magic-link.md](./7.3-email-magic-link.md)
Click email link = gasless check-in via platform relayer.

---

## 🚀 Execution Order

1. **7.1 Bounty Hunter** (2-3 days) - Kill Vercel cron
2. **7.3 Email Magic Link** (2 days) - Reduce friction
3. *(7.2 already done)*
