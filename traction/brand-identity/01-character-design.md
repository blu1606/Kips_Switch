# 🎨 Character Design: Kip & The States of Life

## 1. Visual Identity Spec
Based on the reference image:
*   **Color Palette:**
    *   **Core:** `#34D399` (Emerald 400) to `#10B981` (Emerald 500).
    *   **Glow:** `#6EE7B7` (Emerald 300) with blur.
    *   **Eyes/Mouth:** `#064E3B` (Emerald 900) - Deep forest green, better contrast than black.
*   **Shape:** Perfect circle that slightly "squishes" when it hits the bottom (jelly physics).
*   **Particles:** Tiny floating dots around him (representing data bytes).

## 2. Emotional States (The "Tamagotchi" Loop)

We don't map these to "Time Remaining" directly, but to "Health".

### A. 🟢 Healthy (Standard State)
*   **Condition:** Time > 50%.
*   **Visual:** Bright green, round, slow bobbing motion.
*   **Face:** `^ u ^` or `• ‿ •`
*   **Behavior:** Follows the mouse cursor with its eyes.
*   **Message:** "All good!"

### B. 🟡 Hungry (Warning State)
*   **Condition:** Time < 50% (or < 7 days).
*   **Visual:** Slightly dimmer, color shifts to Yellow-Green (Lime).
*   **Face:** `• _ •` (Neutral/Waiting) or `> _ <` (Need attention).
*   **Behavior:** Bounces occasionally to get attention.
*   **Message:** "Getting hungry..."

### C. 🔴 Critical (Danger State)
*   **Condition:** Time < 24 hours.
*   **Visual:** Orange/Red tint. Trembling/Shivering animation.
*   **Face:** `T _ T` or `O _ O` (Panicked).
*   **Behavior:** Sweat drop particles. Pulsing rapidly (The Heartbeat).
*   **Message:** "PLEASE HELP!"

### D. 👻 Released (Ghost State)
*   **Condition:** Timer Expired.
*   **Visual:** Translucent Blue/White. Halo appears.
*   **Face:** `X _ X` (dizzy) or `- _ -` (peaceful sleep).
*   **Behavior:** Floats up and fades away (The Release).

### E. ✨ Eating (Action State)
*   **Condition:** User clicks "Check-in".
*   **Visual:** Mouth opens `O`. Particles flow FROM the button INTO Kip. He glows intensely white-hot for a second.
*   **Sound:** A satisfying "Chime" or "Munch" sound.

## 3. The "My Vaults" Avatar System
Instead of generic icons for different vaults, generate a **Unique Kip** for each vault (using the Vault Pubkey as a seed).
*   **Variation 1:** Different hues (Teal, Cyan, Mint).
*   **Variation 2:** Accessories (Glasses, Leaf on head, Antenna).
*   **Result:** "That's my 'Savings Kip'. That's my 'Love Letter Kip'."
