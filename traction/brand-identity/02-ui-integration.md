# 💻 UI Integration Plan

How do we weave "Kip" into the frontend without making it look like a child's game? Subtlety is key.

## 1. The Living Dashboard (Header)
*   **Current:** Just a "Check In" button.
*   **New:**
    *   Kip sits **on top** of the Check-In button (or floats next to the timer).
    *   **Interaction:**
        *   **Standard:** He breathes (scales up/down 5% every 3s).
        *   **Hover Button:** He looks at the cursor excited `> u <`.
        *   **Click (Hold):** The "Check-in" button isn't just a button. It involves **Hold to Charge**. As you hold, energy flows into Kip. When the circle fills, he bursts with happiness (Confetti/Particles) -> Transaction Sent.

## 2. Empty States (No Vaults Created)
*   **Current:** "You have no vaults."
*   **New:** A lonely, transparent/sketch version of Kip floating in the void.
*   **Text:** "It's lonely here. Create a Keeper to hold your secrets."

## 3. Loading Screens
*   Instead of a spinning circle:
    *   A grid of small Kips blinking sequentially.
    *   Or Kip jumping rope with a blockchain hash string.

## 4. Favicon & App Icon
*   **Favicon:** The bright green face `• ‿ •` on a dark background. Instantly recognizable in browser tabs.

## 5. Mobile PWA Integration
*   **App Icon:** Kip's face close-up.
*   **Push Notifications:**
    *   *Bad:* "Vault 882... expired."
    *   *Good:* [Icon: 🥺] "Kip is fading... feed him?"

## 6. Implementation Tech Stack
*   **SVG/Lottie:** Avoid heavy 3D for the main dashboard (battery drain). Use Lottie JSON files for expressions.
*   **Framer Motion:** Perfect for the "Breathing" and "Hover" physics.
*   **Rive:** Consider Rive.app if we want state machines (e.g., Eye tracking mouse) inside the animation file itself.

## 7. Next Steps for Dev
1.  [ ] Export the "Blob" vector assets (Happy, Sad, Neutral).
2.  [ ] Create a `KipAvatar` React component.
3.  [ ] Replace the "HoldCheckInButton" particle effect to target the Kip component instead of just flying up.
