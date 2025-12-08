# Phase 3: Recipient Claim

## 🎯 Mục tiêu Phase
Xây dựng Claim Portal cho recipient: kiểm tra quyền truy cập, giải mã và download file.

## 📋 Scope tổng quan

| Task | File | Mô tả | Priority |
|------|------|-------|----------|
| Claim Portal UI | [3.1-claim-portal-ui.md](./3.1-claim-portal-ui.md) | Recipient dashboard layout | 🟡 High |
| Permission Check | [3.2-permission-check.md](./3.2-permission-check.md) | Verify vault access rights | 🔴 Critical |
| Decryption Flow | [3.3-decryption-flow.md](./3.3-decryption-flow.md) | Decrypt key → decrypt file → download | 🔴 Critical |

## 🔗 Dependencies
```
Phase 2 (Encryption working)
            ↓
    3.1-claim-portal-ui
            ↓
    3.2-permission-check
            ↓
    3.3-decryption-flow
```

## 👤 Target User: Recipient (Bob)
- Có thể non-technical hoặc stressed
- Flow phải đơn giản: **Connect → Click → Download**
- UI clear về trạng thái Vault (Locked vs Released)

## ✅ Definition of Done
- [ ] Recipient connect wallet thấy danh sách vault available
- [ ] Vault locked → hiện "Owner is Active", button disabled
- [ ] Vault released → có thể decrypt và download file
- [ ] File download đúng nội dung gốc

## ⏱️ Estimated Time
**Day 3** của 5-day sprint
