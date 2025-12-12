# 🛠️ R.3 Refactor: Write Assist & Blinks

> **Status:** 📝 Proposed
> **Priority:** P3 (Polish)
> **Goal:** Decouple monolithic UI components and modularize API logic for scalability and maintainability.

## 1. 🎯 Objectives

1.  **Modularize `WriteAssistModal`:** Break down the 370-line "God Component" into manageable steps and hooks.
2.  **Optimize `ping/route.ts`:** Move business logic (vault lookup) out of the controller to prepare for DAS API migration.
3.  **Improve Reusability:** Make typewriter effects and tone cards reusable across the app.

## 2. 📐 Design Strategy

### A. Write Assist Architectures
**Current:**
- `WriteAssistModal` (Logic + UI + Animation + API)

**Proposed:**
- `hooks/useTypewriter.ts` (Logic)
- `components/messaging/wizard/` (UI)
    - `StepRecipient.tsx`
    - `StepContext.tsx`
    - `StepTone.tsx`
    - `StepResult.tsx`
- `WriteAssistModal.tsx` (Orchestrator only)

### B. Blinks API Architecture
**Current:**
- `route.ts` (Controller + Data Logic + Transaction Logic)

**Proposed:**
- `route.ts` (Controller only)
- `services/vault.ts` (Data Logic - `findVaultsByOwner`)
- `utils/instructions.ts` (Transaction Logic - `createPingInstruction`)

## 3. 🛠️ Implementation Steps

### Phase 1: Logic Extraction (Low Effort)
- [ ] **R.3.1** Extract `useTypewriter` hook to `src/hooks/useTypewriter.ts`
- [ ] **R.3.2** Extract `TONE_CARDS` to `src/constants/ai.ts`
- [ ] **R.3.3** Extract `findVaultsByOwner` to `src/services/vault.ts`

### Phase 2: Component Decomposition (High Value)
- [ ] **R.3.4** Create `WriteAssistWizard` sub-components
- [ ] **R.3.5** Refactor `WriteAssistModal` to use sub-components

## 4. ✅ Verification
- [ ] Verify `WriteAssistModal` still functions (open, generate, copy, use).
- [ ] Verify Blinks API (`test-blinks.ts`) still works with refactored service.
