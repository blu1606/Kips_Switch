# 01. Smart Templates & Defaults

## 🎯 Goal
Reduce "Blank Page Paralysis" by providing one-click starting points for common use cases.

## 💡 Concept

Instead of starting with an empty form, present 3 distinct cards:

### 1. The "Crypto Failure" (Asset Backup)
*   **Use Case:** Passing on private keys/seed phrases.
*   **Default Timer:** 12 Months.
*   **Default Content Type:** Text (Secret Note).
*   **UI Hint:** "Securely store your seed phrase. Only released if you don't check in for a year."

### 2. The "Last Letter" (Emotional)
*   **Use Case:** Farewell video or letter to family.
*   **Default Timer:** 3 Months.
*   **Default Content Type:** File Upload (Video/PDF).
*   **UI Hint:** "Leave a memory. Released to your loved ones if something happens."

### 3. The "Whistleblower" (Short-term)
*   **Use Case:** Leaking information if detained.
*   **Default Timer:** 3 Days (72 Hours).
*   **Default Content Type:** Multi-file (Documents).
*   **UI Hint:** "Insurance policy. Releases quickly if you go offline."

### 4. Custom
*   **Use Case:** Power users.
*   **Defaults:** Empty.

## 🛠️ Implementation Plan
*   **New Component:** `TemplateSelector` (Grid of 3 cards).
*   **Logic:** Selecting a template pre-fills the `CreateVaultContext` state (check-in interval, name placeholder).
*   **UX:** This creates momentum. The user has already made a decision ("I want a Crypto Backup") before typing a single word.

## ✅ Execution Steps
1.  [ ] Design 3 icons/cards for templates.
2.  [ ] Add `TemplateSelector` as the **Step 0** of the Wizard.
3.  [ ] Update `CreateVaultWizard` to accept initial state.
