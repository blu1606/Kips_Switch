# Technical Spec: T.3 Anchor Coder IDL Parsing

## 🎯 Goal
Replace manual `Buffer.slice()` parsing with Anchor's IDL-based decoder for type-safe, maintainable vault data parsing.

---

## 📐 Design

### Problem
Current `parseVaultData()` manually reads Buffer offsets:
```typescript
const owner = new PublicKey(data.slice(8, 40)); // Brittle!
```
If the Solana struct changes, this breaks silently.

### Solution
Use Anchor's `coder.accounts.decode()` with the IDL:
```typescript
import { BorshAccountsCoder } from '@coral-xyz/anchor';
import idl from '@/idl/deadmans_switch.json';

const coder = new BorshAccountsCoder(idl as any);
const vault = coder.decode('vault', accountData);
```

---

## 🛠️ Implementation

### Files to Modify

#### [MODIFY] `src/types/vault.ts`
- Import IDL and create Anchor coder
- Replace `parseVaultData()` with `decodeVaultAccount()`

#### [VERIFY] `src/idl/deadmans_switch.json`
- Confirm IDL exists and matches deployed program

---

## ✅ Verification

```bash
pnpm run build
# Test cron endpoint manually
curl -X POST http://localhost:3000/api/cron/check-status \
  -H "Authorization: Bearer $CRON_SECRET"
```

---

## ⚠️ Notes

- IDL must be synced with on-chain program
- If program updates, run `anchor build` to regenerate IDL
