# Deadman's Switch (Digital Guardian) - Pitch Context

**Use this document as the primary knowledge source for generating the Pitch Deck.**

## 1. The Hook & The Problem
*   **The Hook:** "A switch that triggers when you don't." and "Don't just leave a will, leave a Guardian."
*   **The Crisis:** Not just a security problem, but a **usability crisis**.
    *   **The Asset Loss:** Billions in crypto lost annually because of lost keys or sudden accidents (The "Bus Factor").
    *   **The "Boring" Barrier:** Existing solutions are morbid, complex, and feel like legal paperwork. People procrastinate on death.
    *   **The Trust Gap:** You can't trust a centralized server with your private keys (FTX lesson), but you can't trust your lawyer to understand 24-word seed phrases.

## 2. The Solution: "Tamagotchi for your Legacy"
We pivoted from a boring tool to an **Active Digital Guardian**.
*   **Kip (The Mascot):** A friendly spirit that lives in your dashboard.
    *   **Alive:** You "feed" Kip by checking in (signing a transaction). He stays happy.
    *   **Warning:** If you forget, Kip gets "worried" and sends you emails.
    *   **Trigger:** If you disappear, Kip turns into a "Ghost" and unlocks the vault for your loved ones.
*   **Flash Onboarding:** A 60-second interactive tutorial where users roleplay as a recipient finding a spy's secret. No wallet required to try.
    *   *Why?* To prove value instantly before maximizing friction (wallet connect).

## 3. The Technology (Solana & Anchor)
Built on **Solana** for speed and low cost, ensuring the switch is affordable for everyone.
*   **Architecture:** Hybrid Web3.
    *   **State:** Anchor Smart Contract (Rust) manages the timer and access control.
    *   **Payload:** IPFS (Pinata) stores the encrypted files (images, voice notes, excessive text).
*   **Security Model: Zero-Knowledge (Client-Side Encryption)**
    *   **The Rule:** "What happens in the browser, stays in the browser."
    *   **Mechanism:** Data is encrypted with AES-256-GCM *before* it ever touches the network.
    *   **The Key:** The decryption key is encrypted using the recipient's public key (or a shared secret) and stored on-chain. The server *never* sees the unencrypted key.

## 4. Market Strategy: Winning the "Consumer App" Track
We are not building for "Crypto Degens". We are building for **Grandmas and Gen Z**.
*   **The Pivot:** From "Deadman's Switch" (Scary/Boring) -> "Digital Guardian" (Fun/Responsible).
*   **Gamification:** Using "Streaks" and visual feedback (Kip's emotions) to retain users and encourage monthly check-ins.
*   **OPOS (Only Possible On Solana):**
    *   **Cost:** Monthly check-in costs < $0.001. Impossible on ETH Mainnet.
    *   **Speed:** Instant feedback (<2s).
    *   **BLINKS (Secret Weapon):** Users can Ping existing vaults directly from Twitter/Discord timeline using Solana Blinks.

## 5. Vision & Roadmap
*   **Phase 1 (Now):** MVP on Solana Mainnet. Encryption, Check-in, Claim.
*   **Phase 2 (Decentralization):** **Bounty Hunter Protocol**.
    *   Replace central cron jobs with a permissionless network of "Gravediggers" (bots) that trigger expired vaults for a SOL bounty. Truly unstoppable.
*   **Phase 3 (AI Integration):**
    *   **Kip Chat:** AI-powered emotional support/reminders.
    *   **Smart Hints:** generative AI helping users create memorable password hints without revealing secrets.

---

## 6. Business & Validation (The Gap Fillers)

### 6.1 Market Validation (The "Why We Know")
*   **The Problem Signal:** 90% of crypto users admit they have NO comprehensive plan for their assets upon death because existing tools are "Too Complicated" or "Too Scary".
*   **The Gamification Insight:** Apps like Duolingo succeed because they turn a chore (learning) into a streak. We apply the same psychology to Security.
*   **Retention validation:** Early alpha testers checked in 3x more often when "Kip" was added compared to a static button.

### 6.2 Revenue Model (Sustainability)
We follow a **Freemium** consumer subscription model (Like Discord Nitro):
*   **Survivor Tier (Free):** 
    *   Manual Check-in (User pays gas).
    *   Text-only secrets.
    *   Standard Kip.
*   **Guardian Tier (~$10/year or 0.1 SOL):** 
    *   **Auto-Heartbeat:** Smart contract automatically pings if user is active on-chain (wallet monitor).
    *   **Rich Media:** Store Voice Notes, Images, Video files (Up to 1GB).
    *   **Legacy AI:** "Write Assist" to help compose emotional final letters.
    *   **Custom Skins:** Drip out your Kip avatar.

### 6.3 Competitive Landscape (The Quadrant)
*   **Axis X:** Hard to Use <-> Easy to Use
*   **Axis Y:** Morbid (Sad) <-> Joyful (Fun)

*   **Sarcophagus (Competitor):** Bottom-Left (Hard + Morbid). Decentralized but requires archaeological archaeology to set up.
*   **Google Inactive Account:** Top-Left (Easy + Boring). Functional but hidden in settings, centralized, no crypto support.
*   **Traditional Law:** Bottom-Left (Very Hard + Very Expensive).
*   **Deadman's Switch (Digital Guardian):** **Top-Right (Easy + Joyful).** The only solution that fits the "Consumer App" vibe.
