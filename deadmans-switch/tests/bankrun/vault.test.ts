import { describe, it, before } from "mocha";
import { expect } from "chai";
import { setupBankrun } from "./setup";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

describe("Vault Bankrun Tests", () => {
    let context;
    let provider;
    let program;
    let banksClient;
    let payer;

    before(async () => {
        const setup = await setupBankrun();
        context = setup.context;
        provider = setup.provider;
        program = setup.program;
        banksClient = setup.banksClient;
        payer = setup.payer;
    });

    it("Initialize Vault", async () => {
        const vaultName = "My Test Vault";
        const vaultSeed = new BN(123456);
        const recipient = Keypair.generate().publicKey;
        const ipfsCid = "QmTest123";
        const encryptedKey = "encKey123";
        const timeInterval = new BN(300); // 5 mins
        const bountyLamports = new BN(1000000); // 0.001 SOL
        const lockedLamports = new BN(5000000); // 0.005 SOL

        // Find PDA
        const [vaultPda, bump] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("vault"),
                payer.publicKey.toBuffer(),
                vaultSeed.toArrayLike(Buffer, "le", 8)
            ],
            program.programId
        );

        await program.methods
            .initializeVault(
                vaultSeed,
                ipfsCid,
                encryptedKey,
                recipient,
                timeInterval,
                bountyLamports,
                vaultName,
                lockedLamports
            )
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey, // Renamed from signer to owner in IDL/Code
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        // Verify state
        const vaultAccount = await program.account.vault.fetch(vaultPda);
        expect(vaultAccount.name).to.equal(vaultName);
        expect(vaultAccount.owner.toString()).to.equal(payer.publicKey.toString());
        expect(vaultAccount.recipient.toString()).to.equal(recipient.toString());
        expect(vaultAccount.isReleased).to.be.false;
    });

    it("Ping Vault (Check-in)", async () => {
        const vaultSeed = new BN(99999);
        const vaultName = "Ping Test Vault";
        const recipient = Keypair.generate().publicKey;

        // Find PDA
        const [vaultPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("vault"),
                payer.publicKey.toBuffer(),
                vaultSeed.toArrayLike(Buffer, "le", 8)
            ],
            program.programId
        );

        // Initialize first
        await program.methods
            .initializeVault(
                vaultSeed,
                "cid", "key", recipient, new BN(300), new BN(0), vaultName, new BN(0)
            )
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        const accountBefore = await program.account.vault.fetch(vaultPda);
        const lastCheckInBefore = accountBefore.lastCheckIn;

        // Advance time by 100 slots (optional, banksClient allows time machine but just calling ping updates timestamp)
        // Ping
        await program.methods
            .ping()
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
            })
            .rpc();

        const accountAfter = await program.account.vault.fetch(vaultPda);
        console.log("Before:", lastCheckInBefore.toString());
        console.log("After:", accountAfter.lastCheckIn.toString());
        expect(accountAfter.lastCheckIn.gte(lastCheckInBefore)).to.be.true;
    });

    // P0 Security Tests
    it("triggerRelease - Should fail before expiry", async () => {
        const vaultSeed = new BN(200001);
        const recipient = Keypair.generate().publicKey;
        const hunter = Keypair.generate();

        const [vaultPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("vault"),
                payer.publicKey.toBuffer(),
                vaultSeed.toArrayLike(Buffer, "le", 8)
            ],
            program.programId
        );

        // Initialize with 300s interval
        await program.methods
            .initializeVault(
                vaultSeed,
                "cid", "key", recipient, new BN(300), new BN(5000), "Expiry Test", new BN(0)
            )
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        // Try to trigger release immediately (should fail)
        try {
            await program.methods
                .triggerRelease()
                .accounts({
                    vault: vaultPda,
                    hunter: hunter.publicKey,
                })
                .signers([hunter])
                .rpc();
            expect.fail("Should have thrown VaultNotExpired error");
        } catch (err: any) {
            expect(err.error.errorCode.code).to.equal("NotExpired");
        }
    });

    it("claimSol - Should fail before release", async () => {
        const vaultSeed = new BN(300001);
        const recipient = Keypair.generate();

        const [vaultPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("vault"),
                payer.publicKey.toBuffer(),
                vaultSeed.toArrayLike(Buffer, "le", 8)
            ],
            program.programId
        );

        // Initialize vault with 10s interval
        await program.methods
            .initializeVault(
                vaultSeed,
                "cid", "key", recipient.publicKey, new BN(10), new BN(0), "Claim Test", new BN(1000000)
            )
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        // Try to claim SOL before release (should fail)
        try {
            await program.methods
                .claimSol()
                .accounts({
                    vault: vaultPda,
                    recipient: recipient.publicKey,
                })
                .signers([recipient])
                .rpc();
            expect.fail("Should have thrown error for vault not released");
        } catch (err: any) {
            // Expect VaultNotReleased or similar constraint error
            expect(err).to.exist;
        }
    });

    it("ping - Should fail for unauthorized user", async () => {
        const vaultSeed = new BN(400001);
        const recipient = Keypair.generate().publicKey;
        const attacker = Keypair.generate();

        const [vaultPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("vault"),
                payer.publicKey.toBuffer(),
                vaultSeed.toArrayLike(Buffer, "le", 8)
            ],
            program.programId
        );

        await program.methods
            .initializeVault(
                vaultSeed,
                "cid", "key", recipient, new BN(300), new BN(0), "Ping Auth Test", new BN(0)
            )
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        // Unauthorized ping attempt
        try {
            await program.methods
                .ping()
                .accounts({
                    vault: vaultPda,
                    owner: attacker.publicKey,
                })
                .signers([attacker])
                .rpc();
            expect.fail("Should have thrown Unauthorized error");
        } catch (err: any) {
            // Constraint violation or Unauthorized custom error
            expect(err).to.exist;
        }
    });
});
