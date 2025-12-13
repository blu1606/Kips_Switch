# Product Requirements Document (PRD)

| Metadata | Details |
| :--- | :--- |
| **Project Name** | Deadman's Switch (Digital Guardian) |
| **Version** | 1.1 (Consumer App Pivot) |
| **Status** | Active |
| **Language** | English |
| **Target** | Solana (Mainnet) |

## 1. Goals and Background Context

### 1.1 Goals
*   **Win "Best Consumer App":** Shift focus from pure utility to engaging, daily-use application via Gamification (Kip).
*   **Remove Friction:** Implement "Flash Onboarding" to allow users to understand the value before connecting a wallet.
*   **Maintain Security:** Keep the core Zero-Knowledge architecture while improving UX.

### 1.2 Background Context
Legacy solutions are morbid and boring. Users don't want to think about death. By reframing the app as "Keeping your Digital Guardian alive," we tap into the Tamagotchi effect, increasing retention and peace of mind.

---

## 2. Requirements

### 2.1 Functional Requirements (FR)

**FR1: Vault Creation & Encryption**
*   **FR1.1:** User uploads file/text (max 50MB).
*   **FR1.2:** Client-side AES-GCM encryption. Server NEVER sees raw data.
*   **FR1.3:** Encrypted data -> IPFS (Pinata).
*   **FR1.4:** Anchor Program stores: `ipfs_cid`, `encrypted_key`, `recipient`, `time_interval`.

**FR2: Gamified Check-in (Proof of Life)**
*   **FR2.1:** **Kip Avatar** visualizes vault health (Happy -> Worried -> Scared -> Ghost).
*   **FR2.2:** "Feed Kip" button executes `ping()` instruction on Solana.
*   **FR2.3:** Success animation (Confetti/Heart) to reward user.

**FR3: Trigger & Notification**
*   **FR3.1:** Cron job checks on-chain state.
*   **FR3.2:** Emails sent via Resend (Warning emails include Kip's "worried" face).

**FR4: Claim & Decryption**
*   **FR4.1:** Recipient connects wallet.
*   **FR4.2:** If `is_released == true`, allow download & decrypt.

**FR5: Flash Onboarding (New)**
*   **FR5.1:** Valid "Try Demo" mode without wallet connection.
*   **FR5.2:** Generates temporary "Burner Wallet" in background.
*   **FR5.3:** Simulates full Create -> Die -> Claim cycle in 60 seconds.

**FR6: AI Micro-UX (New)**
*   **FR6.1:** **Anti-Doxxer:** Client-side regex to warn if user pastes Private Key in Title/Description.
*   **FR6.2:** **Kip's Voice:** Context-aware messages from Kip ("I'm hungry, feed me!").

### 2.2 Non-Functional Requirements (NFR)
*   **NFR1 (Security):** Zero-Knowledge is paramount.
*   **NFR2 (Speed):** Solana transactions must be confirmed < 2s for good UX.
*   **NFR3 (Cost):** Minimize rent costs (Solana) for the user.

---

## 3. User Interface Design Goals

### 3.1 Core Screens
1.  **Hybrid Landing Page:**
    *   3D Parallax Kip (Follows mouse).
    *   "Try Demo" prominent button.
2.  **Dashboard (The Habitat):**
    *   Kip takes center stage.
    *   Health bar / Timer clearly visible.
3.  **Claim Portal:**
    *   Cinematic reveal (Safe unlocking animation).

### 3.2 Tech Stack
*   **Blockchain:** Solana (Anchor).
*   **Frontend:** Next.js + TailwindCSS.
*   **Wallets:** Solana Wallet Adapter (Phantom, Solflare).

---

## 4. Technical Assumptions
*   **Network:** Solana Devnet for testing, Mainnet for Prod.
*   **Smart Contract:** Anchor Framework (Rust).
*   **Storage:** Pinata (IPFS).
