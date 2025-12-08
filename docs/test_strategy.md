# Testing Strategy: Deadman's Switch (MVP)

| Metadata | Details |
| :--- | :--- |
| **Project** | Deadman's Switch (Solana) |
| **Phase** | MVP (5-Day Sprint) |
| **Approach** | Risk-Based / Fail-Fast |
| **Primary Tools** | Anchor Test (Mocha/Chai), Manual UI Walkthrough |

## 1\. Testing Philosophy

**"Trust but Verify."**
Since this is a trustless legacy protocol, the failure of the Smart Contract or Encryption means total product failure.

  * **Smart Contract:** 100% Automated Coverage for Logic & Security constraints.
  * **Frontend/Integration:** Manual "Critical Path" Testing.
  * **Encryption:** Verification of "Zero-Knowledge" properties.

-----

## 2\. Level 1: Smart Contract Testing (Automated)

*Tool: Anchor Framework (TypeScript Tests)*
*Location: `anchor/tests/deadmans-switch.ts`*

This is the most critical layer. We must verify these scenarios before deploying to Mainnet.

### 2.1 Critical Test Cases (Must Pass)

1.  **Initialize Vault:**
      * Verify a user can create a Vault with valid parameters.
      * Verify `last_check_in` is set to current timestamp.
      * Verify `is_released` is `false` initially.
      * **Constraint:** Ensure one wallet cannot overwrite an existing vault without closing it (if applicable).
2.  **Check-in (Ping):**
      * Verify `owner` can call `ping()`.
      * Verify `last_check_in` updates to new timestamp.
      * **Security:** Verify a **stranger** cannot call `ping()` for someone else's vault.
3.  **Time Logic (The "Switch"):**
      * Simulate "Time Travel" (using `provider.connection` to check block times).
      * Verify `trigger_release` FAILS if time \< interval.
      * Verify `trigger_release` SUCCEEDS if time \> interval.
4.  **Claim/Access:**
      * Verify `is_released` flag flips correctly.
      * (Note: Actual data decryption happens off-chain, contract just flags permission).

### 2.2 Anchor Test Snippet (Ready to Vibe Code)

```typescript
it("Prevents unauthorized ping", async () => {
  try {
    await program.methods.ping()
      .accounts({ vault: vaultPDA, owner: stranger.publicKey }) // Wrong signer
      .signers([stranger])
      .rpc();
    assert.fail("Should have failed");
  } catch (e) {
    assert.include(e.message, "Constraint"); // Or specific error code
  }
});
```

-----

## 3\. Level 2: Client-Side Encryption Verification (Manual & Unit)

*Tool: Jest (or simple console verification)*

We must prove that the server/IPFS **never** receives unencrypted data.

### 3.1 Verification Steps

1.  **Encryption Cycle:**
      * Input: "Secret Message 123"
      * Action: Encrypt with Key A.
      * Output: Ensure output is base64 ciphertext, not plain text.
2.  **Decryption Cycle:**
      * Input: Ciphertext from Step 1.
      * Action: Decrypt with Key A.
      * Output: Must match "Secret Message 123" exactly.
3.  **Wrong Key Test:**
      * Attempt decrypt with Key B.
      * Output: Should throw error or return garbage (empty).
4.  **Network Inspection (Browser DevTools):**
      * Open Network Tab.
      * Upload file.
      * Inspect Request Payload to Pinata.
      * **PASS Condition:** Payload must look like random garbage/ciphertext. If you see the filename or content, **FAIL IMMEDIATELY**.

-----

## 4\. Level 3: Integration & UI (Manual Walkthrough)

*Tool: You (The User)*

Since we don't have time for Cypress/Playwright, follow this **"Happy Path" Script** on Day 4:

### 4.1 The Owner Flow

1.  Connect Wallet (Phantom/Solflare).
2.  Switch to Base/Solana Devnet.
3.  Fill "Create Vault" form (File \< 50MB).
4.  Confirm Transaction.
5.  **Verify:** Toast shows "Success", Vault appears on Dashboard.
6.  Click "Check In".
7.  **Verify:** Timer resets to Max.

### 4.2 The Recipient Flow (Simulated)

1.  Disconnect Owner Wallet.
2.  Connect Recipient Wallet.
3.  Navigate to Claim Page.
4.  **Scenario A (Alive):** Verify "Vault Locked" message. Button disabled.
5.  **Scenario B (Expired):** (You may need to tweak contract time or wait).
      * Verify "Vault Released" message.
      * Click "Decrypt".
      * **Verify:** File downloads and opens correctly.

-----

## 5\. Level 4: "The 5-Day Safety Net" (Edge Cases)

Since we are rushing, check these common "Vibe Coding" bugs:

1.  **File Too Large:**
      * Try uploading a 100MB video.
      * **Expectation:** UI should block it *before* trying to encrypt (to save browser memory). Show error: "Max file size is 50MB".
2.  **Wallet Disconnect:**
      * Reload page. Does the app remember the wallet? Or crash?
3.  **Insufficient Funds:**
      * Try creating a vault with a wallet having 0 SOL.
      * **Expectation:** Friendly error "You need SOL for gas", not a white screen crash.

-----

## 6\. Deployment Checklist (Day 5 Morning)

  - [ ] **Contract:** `build` and `deploy` to Mainnet.
  - [ ] **Constants:** Update `programId` in frontend config to Mainnet address.
  - [ ] **Env Vars:** Set `NEXT_PUBLIC_PINATA_KEY` and `NEXT_PUBLIC_NETWORK="mainnet"`.
  - [ ] **Smoke Test:** Create 1 real Vault on Mainnet with 0.01 SOL to verify end-to-end.
