# 🧠 Brainstorm: Bounty Hunter + Email Flow

> **Date:** 2025-12-12
> **Topic:** Cơ chế gửi email khi Bounty Hunter trigger vault

---

## 📊 Current Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CURRENT EMAIL FLOW                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [Vercel Cron Job]  ─────────────────────┐                           │
│      │                                   │                           │
│      │ Every X hours                     │                           │
│      ▼                                   ▼                           │
│  [Check Vault Status]              [Send Reminder Emails]            │
│      │                                   │                           │
│      │ If expired                        └── Owner: Check-in alert   │
│      ▼                                                               │
│  [Trigger Release via Cron]                                          │
│      │                                                               │
│      │ After trigger                                                 │
│      ▼                                                               │
│  [Send Recipient Email]                                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     BOUNTY HUNTER FLOW (NEW)                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [Gravedigger Bot] ────────┐       [Any User's Frontend]             │
│      │                     │              │                          │
│      │ Scan expired vaults │              │ Manual trigger           │
│      ▼                     ▼              ▼                          │
│  ┌─────────────────────────────────────────┐                         │
│  │      BLOCKCHAIN: trigger_release()      │                         │
│  │  • Permissionless (anyone can call)     │                         │
│  │  • Pays bounty to hunter                │                         │
│  │  • Sets is_released = true              │                         │
│  └─────────────────────────────────────────┘                         │
│                     │                                                │
│                     │ ⚠️ NO EMAIL IS SENT!                           │
│                     │ (Smart contract can't send email)              │
│                     ▼                                                │
│               [RECIPIENT UNAWARE]                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ PROBLEM: Email Gap với Bounty Hunter

### Hiện tại:
| Flow | Ai trigger? | Email được gửi? |
|------|-------------|-----------------|
| **Cron Job** | Server (Vercel) | ✅ Có - sau khi detect + trigger |
| **Bounty Hunter** | Có thể là bất kỳ ai | ❌ KHÔNG - on-chain action only |
| **Manual Claim** | User | ❌ KHÔNG - nếu vault đã release |

### Root Cause:
- Smart contract chỉ làm việc on-chain → không thể gửi email
- Gravedigger SDK là bot off-chain, nhưng hiện tại **không call API send email**
- Không có "webhook" hay "event listener" để detect on-chain releases

---

## 🛠️ Proposed Solutions

### Option A: Gravedigger Gọi API Sau Khi Trigger ✅ Simple

```javascript
// gravedigger.ts - thêm vào sau triggerRelease()
async function notifyAfterTrigger(vaultAddress: string) {
    try {
        await fetch(`${API_URL}/api/vault/notify-release`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                vaultAddress,
                secret: process.env.GRAVEDIGGER_SECRET 
            })
        });
    } catch (e) {
        console.log('⚠️ Email notification failed (non-critical)');
    }
}
```

**Pros:**
- Simple implementation
- Gravedigger đã có info cần thiết

**Cons:**
- Phụ thuộc vào Gravedigger gọi API
- Nếu community chạy Gravedigger riêng → không gửi được email
- Secret key cần quản lý

---

### Option B: Cron Job Poll Trạng Thái Thay Đổi ✅ Current Approach

Cron job hiện tại đã scan **tất cả vaults** và check `isReleased`. 

```typescript
// Đã có trong check-status/route.ts
if (isReleased && !previouslyNotified) {
    await sendRecipientNotification(...);
    await markAsNotified(vaultAddress);
}
```

**Cần thêm:**
- Table `vault_release_notifications` để track đã gửi email chưa
- Cron job detect vault mới released → send email

**Pros:**
- Không phụ thuộc vào ai trigger
- Works cho mọi cách trigger (Gravedigger, manual, future bots)

**Cons:**
- Vẫn là centralized (cron job)
- Có delay (tùy vào poll interval)

---

### Option C: Solana Program Event + Off-chain Listener 🔥 Advanced

```rust
// In smart contract
emit!(VaultReleasedEvent {
    vault: vault.key(),
    recipient: vault.recipient,
    timestamp: clock.unix_timestamp,
});
```

```javascript
// Off-chain listener
connection.onProgramAccountChange(PROGRAM_ID, (accountInfo) => {
    // Detect release event → send email
});
```

**Pros:**
- Real-time notification
- Decentralized trigger, centralized notification

**Cons:**
- Cần modify smart contract
- Vẫn cần server để listen events
- Complex architecture

---

## ✅ RECOMMENDED: Option B + Cải Tiến

### Implementation Plan:

#### 1. Database: Thêm tracking table
```sql
CREATE TABLE vault_release_notifications (
    vault_address TEXT PRIMARY KEY,
    is_released BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP,
    triggered_by TEXT, -- 'cron', 'hunter', 'manual'
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. API Endpoint: `/api/vault/notify-release`
```typescript
// Được gọi bởi: Cron job, Gravedigger, hoặc Frontend sau trigger
export async function POST(req: Request) {
    const { vaultAddress } = await req.json();
    
    // Check on-chain: vault actually released?
    const isReleased = await checkVaultReleased(vaultAddress);
    if (!isReleased) return error("Vault not released");
    
    // Already notified?
    const notified = await checkAlreadyNotified(vaultAddress);
    if (notified) return { already: true };
    
    // Get recipient email from DB
    const email = await getRecipientEmail(vaultAddress);
    if (email) {
        await sendRecipientNotification(email, vaultAddress, ownerAddress);
        await markNotified(vaultAddress);
    }
    
    return { success: true };
}
```

#### 3. Gravedigger SDK: Thêm notification call
```typescript
// Sau khi trigger thành công
if (success) {
    await fetch(`${API_URL}/api/vault/notify-release`, {
        method: 'POST',
        body: JSON.stringify({ vaultAddress })
    });
}
```

#### 4. Cron Job: Backup sweep
```typescript
// Trong check-status cron
for (const vault of releasedVaults) {
    await fetch('/api/vault/notify-release', { vaultAddress });
}
```

---

## 🧪 How to Test?

### 1. Unit Test Email Functions
```bash
# .env test
RESEND_API_KEY=re_test_xxx
EMAIL_FROM=test@noreply.com

# Run test
npx jest src/utils/email.test.ts
```

### 2. End-to-End với Devnet

```bash
# Step 1: Tạo vault với release time ngắn (5 phút)
npm run dev
# Create vault → Time: 5 minutes → Recipient email: your@email.com

# Step 2: Chờ hết hạn, rồi trigger bằng Gravedigger
export RPC_URL=https://api.devnet.solana.com
export PRIVATE_KEY=<test-wallet>
npx ts-node scripts/gravedigger.ts

# Step 3: Check email inbox
```

### 3. Manual API Test
```bash
# Test send email endpoint trực tiếp
curl -X POST http://localhost:3000/api/vault/notify-release \
  -H "Content-Type: application/json" \
  -d '{"vaultAddress": "xxx..."}'
```

### 4. Resend Dashboard
- Login https://resend.com/dashboard
- Check "Emails" tab để xem logs
- Check "Scheduled" để xem delayed emails

---

## 📱 UI Visualization Ideas

### 1. Email Status trong VaultCard

```tsx
// VaultCard.tsx
<div className="flex items-center gap-2 text-sm">
    <Mail className="w-4 h-4" />
    <span>{emailSentAt ? `Notified ${formatDate(emailSentAt)}` : 'Pending notification'}</span>
</div>
```

### 2. Email Log Timeline

```
┌─────────────────────────────────────────────────┐
│ 📧 Email History                                │
├─────────────────────────────────────────────────┤
│ ✅ Dec 10, 2:30 PM - Reminder sent to owner     │
│ ✅ Dec 11, 8:00 AM - Urgent reminder sent       │
│ ⏳ Dec 12, 3:00 PM - Final warning scheduled    │
│ ○  Release notification (pending trigger)       │
└─────────────────────────────────────────────────┘
```

### 3. Admin Dashboard (Future)

```tsx
// /admin/email-logs
[Table with columns:]
- Vault Address
- Email Type (Reminder/Release/Subscribe)
- Recipient
- Sent At
- Status (Sent/Failed/Scheduled)
- Action (Resend)
```

### 4. Real-time Toast on Release

```tsx
// When Gravedigger triggers
useEffect(() => {
    const ws = new WebSocket('wss://...');
    ws.onmessage = (event) => {
        const { type, vaultAddress } = JSON.parse(event.data);
        if (type === 'VAULT_RELEASED') {
            toast.success(`Vault ${short(vaultAddress)} has been released!`);
        }
    };
}, []);
```

---

## 🎯 Summary & Next Steps

### ✅ Cơ chế hiện tại đã ổn cho:
1. **Owner Reminders** - Cron job gửi trước deadline
2. **Scheduled Notifications** - Resend's `scheduledAt` feature
3. **Notify Me Subscribe** - User đăng ký nhận email khi vault ready

### ⚠️ Gap cần fix:
1. **Bounty Hunter trigger** không gửi email
2. **Không track** email đã gửi hay chưa (duplicate risk)
3. **Không có UI** để xem email history

### 📋 Action Items:
1. [ ] Tạo table `vault_release_notifications`
2. [ ] Tạo API `/api/vault/notify-release`
3. [ ] Update `gravedigger.ts` gọi API sau trigger
4. [ ] Update Cron job để sweep released vaults
5. [ ] Thêm Email status badge vào VaultCard
6. [ ] (Optional) Email History modal

---

## 💡 Quick Win: Test Email Now

```bash
# Trong Resend dashboard, bạn có thể gửi test email:
# Settings → API Keys → Test với RESEND_API_KEY

# Hoặc trong code:
import { Resend } from 'resend';
const resend = new Resend('re_xxx');

await resend.emails.send({
    from: 'test@resend.dev', // Sandbox domain
    to: 'your-email@gmail.com',
    subject: 'Test from Deadman Switch',
    html: '<h1>It works!</h1>'
});
```
