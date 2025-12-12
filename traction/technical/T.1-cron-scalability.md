# Technical Spec: T.1 Cron & Scalability Optimization

## 1. GitHub Actions Scheduler (Free Cron)
Instead of Vercel Cron (Premium), we use GitHub Actions.

### Workflow File: `.github/workflows/scheduler.yml`
```yaml
name: Deadman Scheduler
on:
  schedule:
    - cron: '0 * * * *' # Every hour
  workflow_dispatch: # Manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Call Cron API
        run: |
          curl -X POST ${{ secrets.NEXT_PUBLIC_APP_URL }}/api/cron/check-status \
          -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## 2. Scalability Fixes (The "O(N)" Problem)

### Problem
`connection.getProgramAccounts(PROGRAM_ID)` fetches **every single vault**.
- 100 vaults: 100KB (OK)
- 10,000 vaults: 10MB (Slow)
- 100,000 vaults: 100MB (Crash)

### Immediate Solution (Pre-Indexer)
Use `memcmp` filters to only fetch Relevant Vaults. We can't filter by "time < now" easily without an Indexer or specific on-chain structure, but we *can* filter by state if we update the contract/struct.

**Current Limitations:** The Vault struct doesn't have an indexed "status" byte at a fixed offset that easily correlates to "Needs Check-in".
**Optimization:**
1. **Discriminator Filter:** Ensure we ONLY fetch Vault accounts, not other PDAs.
```typescript
{
  memcmp: {
    offset: 0,
    bytes: VAULT_DISCRIMINATOR // defined in anchor.ts
  }
}
```
2. **Robust Parsing:** Replace vulnerable `data.slice` with a safe helper.

## 3. Data Integrity & Safety
Refactor `src/app/api/cron/check-status/route.ts` to use a safe parser.

```typescript
// Safe Buffer Reader
function safeParseVault(data: Buffer) {
    try {
        // Use Anchor Layout or robust manual parsing with bounds checks
        // ...
    } catch (e) {
        return null; // Skip corrupted accounts instead of crashing
    }
}
```

## 4. Supabase Integration
We will use Supabase mainly for the `vault_contacts` lookup.
**Action:** Verify `vault_contacts` table exists using Supabase MCP.
