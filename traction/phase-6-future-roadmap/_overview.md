# 🎯 Phase 6: Future Roadmap & Enhancements

This document analyzes high-value feature ideas to enhance Deadman's Switch from a functional tool to an engaging, intelligent product.

## 🗺️ Roadmap Overview

| Feature Area | Concept | Impact (Value) | Feasibility | Priority |
|--------------|---------|----------------|-------------|----------|
| **UX Improvement** | Frictionless Heartbeat | ⭐⭐⭐⭐⭐ (High) | 🟢 Easy/Medium | 1 |
| **Experience** | Cinematic Legacy Reveal | ⭐⭐⭐⭐⭐ (High) | 🟢 Easy | 2 |
| **Gamification** | The Tamagotchi Vault | ⭐⭐⭐⭐ (Med-High)| 🟡 Medium | 3 |
| **Security** | The Council of Guardians | ⭐⭐⭐⭐⭐ (High) | 🔴 Hard | 4 |
| **Safety** | Panic Button (Duress) | ⭐⭐⭐ (Med) | 🟡 Medium | 5 |

---

## 🚀 1. The Frictionless Heartbeat (Optimized Check-in)
**Problem:** Frequent check-ins are annoying. High friction = user churn = accidental release.

### Solutions
1.  **Solana Blinks (Actions):** check-in directly from Twitter/X.
    *   *Feasibility:* Medium. Requires integration with Dialect/Blink protocol.
    *   *Benefit:* Extremely low friction. Virality.
2.  **"Snooze" via Email (Magic Link):**
    *   *Mechanism:* Click link in email -> Server verifies token -> Server pays gas to call `ping` (Gasless for user).
    *   *Feasibility:* Easy. We already have Supabase + Resend.
    *   *Benefit:* No wallet connection needed. Life-saver when traveling/no ledger.
3.  **Delegated Check-in:**
    *   *Mechanism:* Assign a "hot wallet" (mobile) that only has permission to `ping` (not `update` or `close`).
    *   *Feasibility:* Easy (Smart Contract tweak).
    *   *Benefit:* Security of Cold Storage + Convenience of Hot Wallet.

**Recommendation:** Implement **Delegated Check-in** first (Contract change), then **Snooze via Email** (Web2 hybrid).

---

## 🎬 2. Cinematic Legacy Reveal (Emotional UX)
**Problem:** Downloading a ZIP file is cold and transactional. Inheritance is emotional.

### Concept structure
1.  **The Lock (Pending):** 3D Safe/Countdown (Spline/Three.js) instead of static text.
2.  **The Reveal (Unlocked):**
    *   Black screen fade-out.
    *   "Final Message" (Video/Text) plays automatically.
    *   Assets appear slowly with ethereal sound/animation.

**Implementation:**
- Pure Frontend (React + Framer Motion).
- No contract changes.
- **High Value / Low Effort.**

---

## 👾 3. The Tamagotchi Vault (Gamification)
**Problem:** Check-in is a chore.
**Solution:** Check-in = Feeding a digital pet.

### Concept
- **Mint:** Create Vault -> Mint "Spirit NFT".
- **Dynamic Metadata:**
    - `LastCheckIn < 24h`: Happy Spirit.
    - `LastCheckIn > 7 days`: Sick Spirit.
    - `Expired`: Stone/Ghost.
- **Reward:** Longest streak = Evolved Spirit (Tradeable?).

**Implementation:**
- Requires Metaplex standard (Dynamic NFT).
- Contract needs to emit events or NFT metadata update logic.
- **Medium Effort.** Good for retention.

---

## 🛡️ 4. The Council of Guardians (Social Recovery)
**Problem:** Time-based trigger is brittle (coma, jail, lost internet).

### Concept
- **M-of-N Guardians:** Owner appoints 3 friends.
- **Override:**
    - If timer expires -> Guardians notified.
    - Guardians vote "Confirm Death" -> Vault Opens.
    - OR: Guardians vote "Lost Key" -> Rotates Owner Key.

**Implementation:**
- Complex Smart Contract logic (Multisig).
- UI for Guardians to vote.
- **High Effort / High Value.** Enterprise feature.

---

## 🚨 5. Intelligent Vault extensions
- **Panic Button:** "Fake Check-in" that looks valid but secretly burns the key or alerts emergency contacts.
- **Social Recovery:** Restore access if owner key is lost (distinct from Guardian trigger).

---

## 📋 Compliance & Execution Plan

We will adopt the **Traction** folder structure for these new phases.

- `traction/phase-6-future-roadmap/6.1-frictionless-checkin.md`
- `traction/phase-6-future-roadmap/6.2-cinematic-reveal.md`
- `traction/phase-6-future-roadmap/6.3-tamagotchi-vault.md`
- `traction/phase-6-future-roadmap/6.4-council-guardians.md`

We will start drafting detailed specs for **6.2 Cinematic Reveal** (Quick Win) and **6.1 Frictionless Check-in** (High Impact).
