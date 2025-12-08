# UI/UX Specification: Deadman's Switch (MVP)

| Metadata | Details |
| :--- | :--- |
| **Project Name** | Deadman's Switch (Digital Legacy Protocol) |
| **Version** | 1.0 (MVP) |
| **Status** | Draft |
| **Style** | Cyberpunk / Minimalist Dark Mode |

## 1\. UX Goals & Principles

### 1.1 Core Principles

1.  **Trust through Transparency:** Since this is a "Trustless" app, the UI should clearly show what is happening (e.g., "Encrypting file locally...", "Uploading to IPFS...", "Waiting for Signature..."). Never leave the user guessing.
2.  **Privacy First:** Visually reinforce that data is encrypted. Use lock icons, green shields, and clear success states when encryption finishes *before* upload.
3.  **Critical State Clarity:** The difference between "Alive" (Safe) and "Released" (Danger/Open) must be instantly recognizable via color (Green vs. Red/Orange).
4.  **Frictionless Connect:** Use **RainbowKit** (or Solana equivalent UI) for seamless wallet connection.

### 1.2 Target Personas

  * **The Crypto Holder (Alice):** Tech-savvy but paranoid. Wants to confirm her keys are safe. Needs a "set it and forget it" dashboard.
  * **The Heir (Bob):** Likely non-technical or stressed. The "Claim" flow must be extremely simple: Connect -\> Click Button -\> Download.

-----

## 2\. Sitemap & Navigation

```mermaid
graph TD
    A[Landing Page] --> B{Wallet Connected?}
    B -->|No| A
    B -->|Yes| C[Dashboard]
    C --> D[Create Vault Wizard]
    C --> E[Vault Detail / Settings]
    A --> F[Claim Portal (Recipient View)]
    F --> G[Decrypt & Download]
```

  * **Primary Navigation:** Minimal Header (Logo + "Launch App" / Wallet Connect).
  * **Footer:** Links to Github (Trust), Smart Contract Address (Verification).

-----

## 3\. Key User Flows (Wireframes Description)

### 3.1 Flow: Create Vault (The "Wizard")

*Goal: Alice uploads a file and sets up the switch.*

  * **Step 1: The Secret**

      * **UI:** Large Dropzone area. Text: "Drag & drop your secret file (Max 50MB)".
      * **Interaction:** User drops file -\> Progress bar "Compressing..." -\> "Encrypting (Client-side)..." -\> **Success Icon**.
      * *Critical UX:* Display the **"Decryption Key"** (generated hash) to Alice here. "SAVE THIS KEY. You may need to give this to your heir manually if wallet-encryption fails."

  * **Step 2: The Heir**

      * **UI:** Input field "Recipient Wallet Address" (Solana address validation).
      * **UI:** Input field "Recipient Email" (Optional - for notification).

  * **Step 3: The Heartbeat**

      * **UI:** Slider or Card Selection for "Check-in Interval".
      * **Options:** 30 Days (Default), 90 Days, 1 Year.

  * **Step 4: Confirm & Sign**

      * **UI:** Summary Card showing: File Size, Recipient, Interval.
      * **Action:** "Create Vault" Button.
      * **Feedback:** Wallet Popup -\> Spinner "Confirming Transaction..." -\> Success Modal "Vault Active".

### 3.2 Flow: Check-in (The "Pulse")

*Goal: Alice confirms she is alive.*

  * **Screen:** Dashboard.
  * **UI Element:** A massive, pulsing **Green Button** labeled "I'M ALIVE".
  * **Context:** Below the button, a countdown timer: "Time remaining: 29d 12h 30m".
  * **Action:** Click Button -\> Wallet Confirm (0 SOL + gas) -\> Success Toast "Timer Reset\!".

### 3.3 Flow: Claim (The "Release")

*Goal: Bob receives the assets.*

  * **Screen:** Claim Portal (accessed via link in Email).
  * **State 1 (Locked):** If Bob connects but Vault is active -\> Show "Vault is Locked. Owner is Active." (Greyed out).
  * **State 2 (Released):** If Vault is expired -\> Show "Vault Released".
      * **Action:** Button "Decrypt & Download".
      * **Logic:**
        1.  App fetches Encrypted File from IPFS.
        2.  App fetches Encrypted Key from Chain.
        3.  App prompts Bob to sign/decrypt the key with his wallet.
        4.  App decrypts file -\> Browser triggers Download.

-----

## 4\. Visual Design System

### 4.1 Color Palette (Dark Theme)

  * **Background:** `#0F172A` (Slate 900 - Deep crypto dark).
  * **Surface:** `#1E293B` (Slate 800 - Cards/Modals).
  * **Primary (Alive/Safe):** `#10B981` (Emerald 500 - "Matrix" Green).
  * **Danger (Expired/Dead):** `#EF4444` (Red 500).
  * **Accent (Action):** `#6366F1` (Indigo 500 - Solana vibes).
  * **Text:** `#F8FAFC` (Slate 50 - High contrast).

### 4.2 Typography

  * **Font:** `Inter` or `Space Grotesk` (for headers - gives a techy/blockchain feel).
  * **Mono:** `JetBrains Mono` (for displaying Wallet Addresses and Hashes).

### 4.3 Components (Shadcn/Tailwind)

  * **Buttons:** Sharp corners or slightly rounded (`rounded-md`). High hover contrast.
  * **Inputs:** Dark background, light border focus.
  * **Toasts:** Bottom-right notifications for all blockchain actions (Pending, Success, Error).

-----

## 5\. Responsive Strategy

  * **Mobile First:** The "Check-in" button must be easily clickable on a phone (User might be in a hospital bed).
  * **Desktop:** "Create Vault" wizard takes advantage of wider screens for file management.
