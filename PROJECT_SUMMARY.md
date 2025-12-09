# 📋 Deadman's Switch - Project Summary

> **Updated:** 2025-12-09  
> **Program ID:** `HnFEhMS84CabpztHCDdGGN8798NtXW4aG17XpB` (Devnet)

## 🎯 What it is
Solana dApp: Owner tạo vault chứa secret → auto-release cho recipient khi owner ngừng check-in.

## ✅ DONE (Phase 1-4)

| Phase | Core Features |
|-------|---------------|
| **1. Foundation** | Anchor contract (6 instructions), Wallet connect, Devnet deployed |
| **2. Encryption** | AES-256-GCM client-side, IPFS/Pinata, Password + Wallet modes |
| **3. Claim** | Recipient portal, decrypt+view in-browser, claim_and_close |
| **4. Automation** | Cron API, Resend email, Design system, Custom fonts, Animations |

**Contract Instructions:** `initialize_vault`, `ping`, `trigger_release`, `update_vault`, `close_vault`, `claim_and_close`

**Encryption:** Zero-knowledge (browser-only), PBKDF2 (password), Deterministic key (wallet)

## 🎨 UI DONE

- **Navbar:** 3-part floating layout (logo | nav AnimatedMenuBar | wallet)
- **Check-in:** HoldCheckInButton với magnetic particle effect, optimistic UI
- **Design:** Inter/Space Grotesk/JetBrains Mono, pulse-alive animation, dark theme

## ⏳ PENDING

- [ ] Mainnet deployment
- [ ] Vercel deploy (enable cron)
- [ ] Database for owner/recipient emails

## 🧠 BRAINSTORM IDEAS (Phase 6+)

### Priority 1: Frictionless Check-in
- **Delegated wallet:** Hot wallet chỉ có quyền `ping` (contract change)
- **Snooze via email:** Magic link → server pays gas → gasless ping
- **Solana Blinks:** Check-in từ Twitter/X

### Priority 2: Cinematic Legacy Reveal ⭐ Quick Win
- 3D Safe countdown (Spline/Three.js)
- Fade to black → final message plays → assets reveal slowly
- Frontend only, no contract change

### Priority 3: Tamagotchi Vault (Gamification)
- Spirit NFT dynamic metadata based on check-in frequency
- Happy/Sick/Ghost states, streak rewards

### Priority 4: Council of Guardians (Social Recovery)
- M-of-N guardians vote "Confirm Death" → vault opens
- Or vote "Lost Key" → rotate owner key
- Complex contract + UI

### Other Ideas
- Panic Button (duress fake check-in)
- PWA + biometric check-in

## 🔧 Cron Issue (Exploring)

Vercel cron pricing concern → alternatives:
- Client-side checks (when recipient visits)
- GitHub Actions (free cron)
- Decentralized oracles

## 📁 Key Paths

```
src/app/              # Pages: create, dashboard, claim
src/components/       # wizard/, claim/, dashboard/, layout/
src/hooks/            # useVault, useRecipientVaults
src/utils/            # crypto, ipfs, anchor, email
deadmans-switch/      # Anchor contract
traction/             # Specs & roadmap docs
```

## 🔐 Security

- Zero-knowledge encryption (browser only)
- On-chain `has_one` constraints
- Cron auth via `CRON_SECRET` header
