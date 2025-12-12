# R.2 Wizard Robustness Refactor

> **Status:** Planned
> **Type:** Technical Debt / Reliability
> **Goal:** Improve the maintainability of the Wizard's secret upload step and prevent white-screen crashes during crypto operations.

## 🎯 Objectives

### A.1 Refactor `StepUploadSecret` (A.1)
- **Problem:** `StepUploadSecret.tsx` is becoming complex with mixed encryption modes (Wallet vs Password) and embedded UI for toggles.
- **Solution:** Extract the mode selection and password input into a dedicated sub-component.
- **Action:**
  - Create `src/components/wizard/EncryptionModeSelector.tsx`.
  - Move toggle logic and Password/Hint inputs there.
  - Simplify `StepUploadSecret.tsx` to handle just the data flow.

### A.2 Wizard Error Boundary (A.2)
- **Problem:** Cryptographic operations (key generation, encryption) can fail (e.g., quota exceeded, browser incompatibility). Current error handling is localized or missing, leading to potential app crashes.
- **Solution:** Wrap the Wizard flow in a React Error Boundary.
- **Action:**
  - Create `src/components/ui/WizardErrorBoundary.tsx`.
  - Wrap `VaultWizard` (search for parent component) or individual steps.
  - Show a "Safe Fallback" UI: "Something went wrong with encryption. Your data is safe (not uploaded). [Retry]"

## 🛠️ Implementation Plan

### Phase 1: Decomposition
1.  **Extract `EncryptionModeSelector`**:
    - Props: `mode`, `onChange`, `password`, `onPasswordChange`, etc.
    - Result: `StepUploadSecret` lines reduced by ~40%.

### Phase 2: Safety Net
2.  **Create Error Boundary**:
    - Use `react-error-boundary` or custom class component.
    - Catch errors in render and lifecycle.

## ✅ Verification
- Test switching modes (Wallet <-> Password).
- Simulate a crypto error (stub `crypto.subtle`) and verify the Fallback UI appears.
