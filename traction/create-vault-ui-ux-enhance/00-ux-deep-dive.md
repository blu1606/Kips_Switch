# 🧠 UX Deep Dive: The "Create Vault" Experience

> "Designing for the anxious user in a high-stakes environment."

## 1. The Psychology of the User
When a user clicks "Create Vault", they are in a specific mental state:
1.  **High Stakes:** They are securing something valuable (assets) or emotional (secrets).
2.  **High Anxiety:** "What if I do it wrong?", "What if I lose the key?", "What if it releases too early?".
3.  **Cognitive Load:** They need to gather files, recipient addresses, and think about time intervals simultaneously.

**Current Problem:**
The current UI likely treats this as a "Form Filling" exercise. It asks for data: `Title`, `File`, `Recipient`, `Interval`. This is functional but **cold** and **error-prone**.

## 2. The "Convenience" Paradox
Users say they want "Fast", but for high-security tasks, "Fast" feels "Unsafe".
*   **True Convenience** here is not speed; it is **Clarity** and **Confidence**.
*   The UX should slow the user down *intentionally* at critical moments (Key Generation) and speed them up at trivial ones (Naming).

## 3. Core Friction Points
1.  **"Who is the Recipient?"**:
    *   *Reality:* Users often don't have the Recipient's Solana wallet address handy.
    *   *Friction:* Stopping to ask/find the address breaks the flow.
    *   *Fix:* Allow "Assign Later" or "Generate Claim Link".
2.  **"The Blank Canvas"**:
    *   *Reality:* "What should I write? How long should the timer be?"
    *   *Fix:* **Templates** (e.g., "Crypto Backup", "Message to Family", "Whistleblower").
3.  **"Did it work?"**:
    *   *Reality:* After clicking "Create", the vault just appears.
    *   *Fix:* **A "Test Run" Option**. "Create a 5-minute test vault to see the claim process."

## 4. The Design Philosophy: "The Secure Tunnel"
The Create Flow should be a **Cinematic Wizard**:
*   **No Navigation:** Remove the navbar. Remove distractions.
*   **One Focus per Screen:** Don't mix "Upload File" with "Set Timer".
*   **Visual Metaphors:** When encryption happens, *show* the file locking. When the timer is set, *show* a clock ticking.

---

## 5. Strategic Recommendations

| Feature | Concept | Impact (Confidence) |
|---------|---------|---------------------|
| **Templates** | One-click presets for Time/Type | ⭐⭐⭐⭐⭐ (High) |
| **Tunnel UI** | Full-screen, focused wizard | ⭐⭐⭐⭐ (Med-High) |
| **Key Ceremony** | Enforced verification of the password/key | ⭐⭐⭐⭐⭐ (Critical) |
| **Test Drive** | Intro mode to simulate the lifecycle | ⭐⭐⭐ (Good Onboarding) |
