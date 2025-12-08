# Product Requirements Document (PRD)

| Metadata | Details |
| :--- | :--- |
| **Project Name** | Deadman's Switch (Digital Legacy Protocol) |
| **Version** | 1.0 (MVP) |
| **Status** | Draft |
| **Language** | English |
| **Target** | Base L2 (Mainnet) |

## [cite_start]1. Goals and Background Context [cite: 503]

### 1.1 Goals
* **Deliver a functional MVP in 5 days** that handles the end-to-end flow: Vault Creation → Check-in → Trigger → Claim.
* **Ensure Zero-Knowledge Privacy:** No unencrypted data is ever sent to the server or blockchain; all encryption happens client-side.
* **Minimize Technical Risk:** Use proven, simple mechanisms (Direct Transaction for check-in, Client-side AES for encryption) to ensure delivery.
* **Low Cost Operation:** Utilize Base L2 for low gas fees and IPFS (Pinata) for storage to keep costs negligible for the user.

### 1.2 Background Context
In the Web3 era, asset and data self-custody creates a critical risk: if a user loses access or passes away, their assets are lost forever. Traditional legal solutions are slow, expensive, and lack privacy. This project aims to build a decentralized "Deadman's Switch" that automatically transfers encrypted information (private keys, messages) to a designated recipient if the owner fails to confirm their "liveness" within a set timeframe.

---

## [cite_start]2. Requirements [cite: 509]

### 2.1 Functional Requirements (FR)

**FR1: Vault Creation & Encryption**
* **FR1.1:** User must be able to upload a file (max 50MB) or input text.
* **FR1.2:** System must compress and encrypt this data using AES-GCM *client-side* before any network request.
* **FR1.3:** Encrypted data must be uploaded to IPFS (via Pinata); the system must retrieve the CID.
* **FR1.4:** User must encrypt the AES Key using the Recipient's Public Key (or a shared secret mechanism feasible within 5 days). *Refinement: For MVP speed, we may store the AES key encrypted by the Recipient's Wallet Public Key if available, or force user to input a secondary secure method.* -> **Decision:** User signs/encrypts Key for Recipient Address.
* **FR1.5:** User confirms transaction on Smart Contract to store: `IPFS_CID`, `Encrypted_Key`, `Recipient_Address`, `Time_Interval`.

**FR2: Check-in Mechanism (Proof of Life)**
* **FR2.1:** Dashboard must display a countdown timer based on `lastCheckIn + timeInterval`.
* **FR2.2:** User clicks "I'm Alive" button to trigger a metamask transaction calling `ping()`.
* **FR2.3:** Smart Contract updates `lastCheckIn` to `block.timestamp`.

**FR3: Trigger & Notification**
* **FR3.1:** Backend Cron job (running hourly) queries the Smart Contract for expired switches.
* **FR3.2:** If `block.timestamp > lastCheckIn + timeInterval`, the system sends an email notification to the Recipient (via Resend/SendGrid).
* **FR3.3:** System sends reminder emails to the Owner at 7 days, 3 days, and 24 hours before expiration.

**FR4: Claim & Decryption**
* **FR4.1:** Recipient connects wallet to the DApp.
* **FR4.2:** Application checks if connected wallet matches `Recipient_Address` in any active switch.
* **FR4.3:** If Switch is `EXPIRED` (or `isReleased` is true), allow Recipient to download the Encrypted File and the Encrypted Key.
* **FR4.4:** Client-side decryption: Recipient uses their wallet to decrypt the Key, then uses the Key to decrypt the File.

### 2.2 Non-Functional Requirements (NFR)

* **NFR1 (Security):** Plain text/original files must NEVER leave the user's browser memory.
* **NFR2 (Performance):** File upload limit set to 50MB to prevent browser crash during encryption.
* **NFR3 (Usability):** UI must clearly communicate "Living" vs "Deceased" states.
* **NFR4 (Cost):** Smart contract logic must be minimized to reduce gas costs on Base L2.

---

## [cite_start]3. User Interface Design Goals [cite: 512]

### 3.1 Core Screens
1.  **Landing Page:** Value prop ("Trustless Inheritance"), "Launch App" button.
2.  **Dashboard (Owner View):**
    * Status Card: "Alive", Next Check-in Due Date.
    * Action Button: "I'M ALIVE" (Big, Green).
    * Configuration: Edit Alert Email.
3.  **Create Vault Wizard:**
    * Step 1: Upload/Input Secret.
    * Step 2: Enter Recipient Wallet & Email.
    * Step 3: Set Interval (30 days default).
    * Step 4: Sign & Commit.
4.  **Recipient Claim Portal:**
    * Connect Wallet.
    * List of Available Legacies.
    * "Decrypt & Download" Action.

### 3.2 Tech Preferences
* **Framework:** Next.js (App Router).
* **Styling:** TailwindCSS + Shadcn/UI (for speed).
* **Wallet:** RainbowKit + Wagmi.

---

## [cite_start]4. Technical Assumptions [cite: 520]

* **Blockchain:** Base Sepolia (Dev), Base Mainnet (Prod).
* **Smart Contract:** Solidity 0.8.x.
    * *Key Functions:* `createVault`, `ping`, `isExpired` (view).
* **Storage:** IPFS via Pinata Gateway.
* **Encryption Lib:** `crypto-js` or `Web Crypto API`.
* **Backend:** Next.js API Routes (Serverless) + Vercel Cron.
* **Email:** Resend API.

---

## [cite_start]5. Epic List [cite: 524]

This breakdown is optimized for your **5-Day Vibe Coding** schedule.

**Epic 1: The Core (Smart Contract & Basic UI) - Day 1**
* Establish project scaffolding (Next.js + Hardhat/Foundry).
* Develop Solidity Contract (Store data, update timestamp).
* Deploy to Base Sepolia.
* Basic UI to connect wallet and call `createVault`.

**Epic 2: The Logic (Encryption & Storage) - Day 2**
* Implement Client-side AES encryption/decryption utilities.
* Integrate Pinata API for IPFS upload.
* Connect UI Form -> Encrypt -> Upload -> Contract Call.

**Epic 3: The Consumer (Recipient Claim) - Day 3**
* Build Recipient Dashboard.
* Implement "Check Permission" logic (Read from Graph or Contract).
* Implement Decryption flow (Wallet decrypt -> File decrypt).

**Epic 4: The Trigger (Automation & Polish) - Day 4 & 5**
* Setup Next.js Cron job for deadline checking.
* Integrate Resend for Email notifications.
* UI Polish (Tailwind/Shadcn), Landing Page, and Testing.
