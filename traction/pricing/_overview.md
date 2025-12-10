# Pricing Strategy: The Psychology of Paying for Digital Immortality

> **Goal:** Define a freemium model that converts users while remaining cost-efficient.
> **Perspective:** Deep think as a User / Judge.

## 🧠 User Psychology: "Why Would I Pay?"

### The Fear Factor (Primary Driver)
*"What if I'm hit by a bus tomorrow?"*
- Users don't pay for features. They pay for **peace of mind**.
- **Free Tier:** Proves the product works.
- **Premium Tier:** Insures against catastrophic failure.

### The Value Ladder
| User Type | Mindset | Willingness to Pay |
|-----------|---------|---------------------|
| **Curious** | "Let me try this." | $0 (Demo) |
| **Casual** | "I'll set one up for fun." | $0 (Free Tier) |
| **Serious** | "This is my actual crypto backup." | $49/yr |
| **Paranoid** | "I need 100% guarantee." | $99+ (Premium) |

## 💎 Feature Matrix: Free vs Premium

### FREE TIER (Hook)
Goal: **Get users to create their first vault and feel the "Aha!"**

| Feature | Limit | Rationale |
|---------|-------|-----------|
| **Active Vaults** | 2 | Enough to test (1 for self-backup, 1 for loved one) |
| **Storage per Vault** | 5 MB | Text/Images fine. Videos need upgrade. |
| **Check-in Timer** | 7-365 days | Full flexibility |
| **Encryption** | AES-256 Standard | No compromise on security |
| **Claiming** | Self-claim (requires SOL) | Basic UX |
| **Kip Personality** | Yes | Brand hook |

### PREMIUM TIER: "Legacy+" ($49/year)
Goal: **Remove all friction for serious users.**

| Feature | Value Proposition | Implementation Cost |
|---------|-------------------|---------------------|
| **Unlimited Vaults** | Peace of mind | 0 (Blockchain state) |
| **Gasless Claim (11.2)** | Grandma can claim | Medium (Relayer) |
| **Priority Email Notifications** | Never miss a reminder | Low (Resend tiers) |
| **Multi-Media (Video)** | Record a goodbye video | Medium (IPFS bandwidth) |
| **Silent Alarm (6.5)** | Duress protection | Low (Already built) |
| **Custom Check-in Reminders** | SMS/WhatsApp | Medium (Twilio) |

### ENTERPRISE/VIP: "Guardian" ($99 Lifetime / 1 SOL NFT)
Goal: **For whales and early adopters.**

| Feature | Value | Notes |
|---------|-------|-------|
| Everything in Legacy+ | - | - |
| **Guardian Key Sharding (11.1)** | "3-Key Safety Net" | High effort, but Killer USP |
| **Founder's Badge NFT** | Social proof | Marketing hook |
| **Early Access to Features** | Community building | - |

## 💰 Pricing Decision: Why $49/year?

### Competitor Analysis
| Product | Price | Features |
|---------|-------|----------|
| Safe Haven (ETH) | $99/year | Basic inheritance |
| Ledger Recover | $9.99/month (~$120/yr) | Custodial, controversial |
| **Deadman's Switch** | **$49/year** | Non-custodial, on-chain |

### User Perception
- **< $50:** "Coffee subscription price." Impulse buy.
- **$50-100:** "I'm investing in my family's future." Serious commitment.
- **> $100:** Needs strong justification. Enterprise.

## 🛒 Payment Integration (Cost-Efficient)

### MVP (No Account System)
**Method:** Wallet-based subscription.
1.  User connects wallet.
2.  User sends 0.5 SOL (or USDC equivalent) to a specific address.
3.  Backend checks transaction on-chain.
4.  Premium flag stored in a simple DB (wallet_address -> premium_until).

**Pros:** No traditional auth. Crypto-native.
**Cons:** Price volatility (mitigate by accepting USDC).

### V2 (With Account)
**Method:** Stripe for fiat OR on-chain for SOL/USDC.
- Magic Link login (email only, no password).
- Links wallet to email.
- Allows credit card payment.

## 📐 Pricing Section UI Spec

### Location
Add as a new section on Landing Page, **after Use Cases, before FAQ**.

### Design
- 2-3 cards (Free, Legacy+, Guardian).
- Dark theme, glass-panel style.
- Highlight "Legacy+" as "Most Popular".
- CTA: "Start Free" for free, "Upgrade" for paid.

### Component: `PricingSection.tsx`
- Use existing design system (no shadcn imports needed, use `btn-primary` etc.).
- Responsive: 3 cols on desktop, stack on mobile.

## ✅ Execution Plan

1.  [ ] Create `components/landing/PricingSection.tsx`.
2.  [ ] Add feature comparison data.
3.  [ ] Integrate into `page.tsx` (after `UseCaseGrid`).
4.  [ ] (V1) No payment integration (just show plans, CTA -> waitlist/connect wallet).
5.  [ ] (V2) Add wallet-based payment verification.
