import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DeadmansSwitch } from "../target/types/deadmans_switch";
import { expect } from "chai";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";

describe("deadmans-switch", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DeadmansSwitch as Program<DeadmansSwitch>;

  // Test accounts
  const owner = provider.wallet;
  const recipient = Keypair.generate();
  const stranger = Keypair.generate();

  // Vault PDA
  let vaultPda: PublicKey;
  let vaultBump: number;

  // Test data
  const testIpfsCid = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
  const testEncryptedKey = "U2FsdGVkX1+abc123encryptedKeyData==";
  const testTimeInterval = new anchor.BN(60); // 60 seconds

  before(async () => {
    // Derive vault PDA
    [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), owner.publicKey.toBuffer()],
      program.programId
    );

    // Airdrop SOL to stranger for testing
    const sig = await provider.connection.requestAirdrop(
      stranger.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);
  });

  describe("initialize_vault", () => {
    it("creates a vault with correct data", async () => {
      const tx = await program.methods
        .initializeVault(
          testIpfsCid,
          testEncryptedKey,
          recipient.publicKey,
          testTimeInterval
        )
        .accounts({
          vault: vaultPda,
          owner: owner.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Initialize vault tx:", tx);

      // Fetch vault account
      const vault = await program.account.vault.fetch(vaultPda);

      expect(vault.owner.toBase58()).to.equal(owner.publicKey.toBase58());
      expect(vault.recipient.toBase58()).to.equal(recipient.publicKey.toBase58());
      expect(vault.ipfsCid).to.equal(testIpfsCid);
      expect(vault.encryptedKey).to.equal(testEncryptedKey);
      expect(vault.timeInterval.toNumber()).to.equal(testTimeInterval.toNumber());
      expect(vault.isReleased).to.equal(false);
      expect(vault.bump).to.equal(vaultBump);
      expect(vault.lastCheckIn.toNumber()).to.be.greaterThan(0);
    });

    it("fails with invalid time interval (0)", async () => {
      const newOwner = Keypair.generate();

      // Airdrop SOL
      const sig = await provider.connection.requestAirdrop(
        newOwner.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(sig);

      const [newVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), newOwner.publicKey.toBuffer()],
        program.programId
      );

      try {
        await program.methods
          .initializeVault(
            testIpfsCid,
            testEncryptedKey,
            recipient.publicKey,
            new anchor.BN(0) // Invalid: 0 seconds
          )
          .accounts({
            vault: newVaultPda,
            owner: newOwner.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([newOwner])
          .rpc();

        expect.fail("Should have thrown InvalidTimeInterval error");
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal("InvalidTimeInterval");
      }
    });
  });

  describe("ping", () => {
    it("owner can ping to reset timer", async () => {
      const vaultBefore = await program.account.vault.fetch(vaultPda);
      const lastCheckInBefore = vaultBefore.lastCheckIn.toNumber();

      // Wait a tiny bit to ensure timestamp changes
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const tx = await program.methods
        .ping()
        .accounts({
          vault: vaultPda,
          owner: owner.publicKey,
        })
        .rpc();

      console.log("Ping tx:", tx);

      const vaultAfter = await program.account.vault.fetch(vaultPda);
      expect(vaultAfter.lastCheckIn.toNumber()).to.be.greaterThan(lastCheckInBefore);
    });

    it("non-owner cannot ping", async () => {
      try {
        await program.methods
          .ping()
          .accounts({
            vault: vaultPda,
            owner: stranger.publicKey,
          })
          .signers([stranger])
          .rpc();

        expect.fail("Should have thrown Unauthorized error");
      } catch (err: any) {
        // Can be ConstraintSeeds, ConstraintHasOne or Unauthorized depending on Anchor version
        expect(err.error.errorCode.code).to.be.oneOf(["Unauthorized", "ConstraintHasOne", "ConstraintSeeds"]);
      }
    });
  });

  describe("trigger_release", () => {
    it("cannot release before expiry", async () => {
      try {
        await program.methods
          .triggerRelease()
          .accounts({
            vault: vaultPda,
          })
          .rpc();

        expect.fail("Should have thrown NotExpired error");
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal("NotExpired");
      }
    });

    it("can release after expiry", async () => {
      // Create a new vault with very short interval for testing
      const shortIntervalOwner = Keypair.generate();

      const sig = await provider.connection.requestAirdrop(
        shortIntervalOwner.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(sig);

      const [shortVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), shortIntervalOwner.publicKey.toBuffer()],
        program.programId
      );

      // Initialize with 1 second interval
      await program.methods
        .initializeVault(
          testIpfsCid,
          testEncryptedKey,
          recipient.publicKey,
          new anchor.BN(1) // 1 second
        )
        .accounts({
          vault: shortVaultPda,
          owner: shortIntervalOwner.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([shortIntervalOwner])
        .rpc();

      // Wait for expiry (need to wait for block time to advance)
      console.log("Waiting for vault to expire...");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Trigger release
      const tx = await program.methods
        .triggerRelease()
        .accounts({
          vault: shortVaultPda,
        })
        .rpc();

      console.log("Release tx:", tx);

      const vault = await program.account.vault.fetch(shortVaultPda);
      expect(vault.isReleased).to.equal(true);
    });

    it("cannot release already released vault", async () => {
      // Create another vault that we'll release
      const releasedOwner = Keypair.generate();

      const sig = await provider.connection.requestAirdrop(
        releasedOwner.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(sig);

      const [releasedVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), releasedOwner.publicKey.toBuffer()],
        program.programId
      );

      // Initialize with 1 second interval
      await program.methods
        .initializeVault(
          testIpfsCid,
          testEncryptedKey,
          recipient.publicKey,
          new anchor.BN(1)
        )
        .accounts({
          vault: releasedVaultPda,
          owner: releasedOwner.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([releasedOwner])
        .rpc();

      // Wait for expiry
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // First release
      await program.methods
        .triggerRelease()
        .accounts({
          vault: releasedVaultPda,
        })
        .rpc();

      // Try to release again
      try {
        await program.methods
          .triggerRelease()
          .accounts({
            vault: releasedVaultPda,
          })
          .rpc();

        expect.fail("Should have thrown AlreadyReleased error");
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal("AlreadyReleased");
      }
    });

    it("cannot ping after release", async () => {
      // Create vault and release it
      const pingAfterOwner = Keypair.generate();

      const sig = await provider.connection.requestAirdrop(
        pingAfterOwner.publicKey,
        2 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(sig);

      const [pingAfterVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), pingAfterOwner.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .initializeVault(
          testIpfsCid,
          testEncryptedKey,
          recipient.publicKey,
          new anchor.BN(1)
        )
        .accounts({
          vault: pingAfterVaultPda,
          owner: pingAfterOwner.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([pingAfterOwner])
        .rpc();

      await new Promise((resolve) => setTimeout(resolve, 3000));

      await program.methods
        .triggerRelease()
        .accounts({
          vault: pingAfterVaultPda,
        })
        .rpc();

      // Try to ping after release
      try {
        await program.methods
          .ping()
          .accounts({
            vault: pingAfterVaultPda,
            owner: pingAfterOwner.publicKey,
          })
          .signers([pingAfterOwner])
          .rpc();

        expect.fail("Should have thrown AlreadyReleased error");
      } catch (err: any) {
        expect(err.error.errorCode.code).to.equal("AlreadyReleased");
      }
    });
  });
});
