# 02. The "Tunnel Vision" Wizard (Guided Flow)

## 🎯 Goal
Eliminate distraction and improve focus by moving from a standard form to a "Cinematic Tunnel" experience.

## 💡 Concept

### 1. The "Tunnel" Container
*   **Full Screen:** Hides the main App Navbar and Sidebar.
*   **Exit Strategy:** clearly visible "Save Draft & Exit" or "Cancel" button (top right).
*   **Progress:** "Life Line" progress bar at the bottom.

### 2. Step-by-Step Breakdown

#### Step 1: The Artifact (Content)
*   **Focus:** What are we protecting?
*   **Action:** Drag & drop file OR big text area.
*   **Micro-interaction:** When file is dropped, show a padlock locking onto it.

#### Step 2: The Trigger (Time)
*   **Focus:** When do we release?
*   **UI:** Slider + Human readable text.
*   **Text:** "If I don't signal I'm alive for **[ 30 Days ]**, release this."

#### Step 3: The Beneficiary (Recipient)
*   **Focus:** Who gets it?
*   **Improvement:**
    *   Input: Wallet Address.
    *   **New Toggle:** "I don't have their address yet" (Allows creating without recipient, adding later before depositing? OR just allow `0x0` and update later).
    *   *Note:* Contract requires recipient. Maybe use User's own wallet as placeholder and force update later? Or just keep it mandatory but provide a "Copy Invite Link" feature helper.

#### Step 4: The Seal (Encryption) 🛑 CRITICAL
*   **Focus:** Security.
*   **Action:**
    1.  User enters Password (or selects Wallet Mode).
    2.  **Forces Confirmation:** User must re-type or click "I have saved this".
    3.  **Visual:** Matrix-style rain or scrambling text animation turning the content into `***********`.

#### Step 5: The Pact (Transaction)
*   **Focus:** Payment & Confirmation.
*   **Visual:** Ticket/Receipt summary.
*   **Action:** "Sign & Mint Vault".

## ✅ Execution Steps
1.  [ ] Create `TunnelLayout` (no navbar).
2.  [ ] Update `CreateVaultPage` to use `TunnelLayout`.
3.  [ ] Refactor Wizard steps into centered, isolated components.
4.  [ ] Add "Locking" animation for Step 4.
