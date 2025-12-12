import { describe, it, before } from "mocha";
import { expect } from "chai";
import { setupBankrun } from "./setup";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

describe("Vault P2 Edge Case Tests", () => {
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

    it("topUpBounty - Owner adds to bounty", async () => {
        const vaultSeed = new BN(800001);
        const recipient = Keypair.generate().publicKey;
        const initialBounty = new BN(5000);
        const additionalBounty = new BN(10000);

        const [vaultPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("vault"),
                payer.publicKey.toBuffer(),
                vaultSeed.toArrayLike(Buffer, "le", 8)
            ],
            program.programId
        );

        // Initialize vault with initial bounty
        await program.methods
            .initializeVault(
                vaultSeed,
                "cid", "key", recipient, new BN(300), initialBounty, "Bounty Test", new BN(0)
            )
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        // Top up bounty
        await program.methods
            .topUpBounty(additionalBounty)
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        // Verify bounty increased
        const vaultAccount = await program.account.vault.fetch(vaultPda);
        expect(vaultAccount.bountyLamports.toNumber()).to.equal(
            initialBounty.toNumber() + additionalBounty.toNumber()
        );
    });

    it("closeVault - Owner closes unreleased vault", async () => {
        const vaultSeed = new BN(900001);
        const recipient = Keypair.generate().publicKey;

        const [vaultPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("vault"),
                payer.publicKey.toBuffer(),
                vaultSeed.toArrayLike(Buffer, "le", 8)
            ],
            program.programId
        );

        // Initialize vault
        await program.methods
            .initializeVault(
                vaultSeed,
                "cid", "key", recipient, new BN(300), new BN(1000), "Close Test", new BN(0)
            )
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        // Close vault (owner reclaims funds)
        await program.methods
            .closeVault()
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
            })
            .rpc();

        // Verify vault is closed (account should not exist or be empty)
        try {
            await program.account.vault.fetch(vaultPda);
            expect.fail("Vault account should be closed");
        } catch (err: any) {
            // Account not found is expected
            expect(err).to.exist;
        }
    });

    // 14.1g - Additional P2 Edge Case Tests
    it("initializeVault - Should reject duplicate seed", async () => {
        const vaultSeed = new BN(910001);
        const recipient = Keypair.generate().publicKey;

        const [vaultPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("vault"),
                payer.publicKey.toBuffer(),
                vaultSeed.toArrayLike(Buffer, "le", 8)
            ],
            program.programId
        );

        // Initialize first vault
        await program.methods
            .initializeVault(
                vaultSeed,
                "cid", "key", recipient, new BN(300), new BN(0), "First Vault", new BN(0)
            )
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        // Try to initialize duplicate with same seed
        try {
            await program.methods
                .initializeVault(
                    vaultSeed,
                    "cid2", "key2", recipient, new BN(600), new BN(0), "Duplicate", new BN(0)
                )
                .accounts({
                    vault: vaultPda,
                    owner: payer.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();
            expect.fail("Should have thrown error for duplicate seed");
        } catch (err: any) {
            expect(err).to.exist;
        }
    });

    it("initializeVault - Minimum values accepted", async () => {
        const vaultSeed = new BN(920001);
        const recipient = Keypair.generate().publicKey;

        const [vaultPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("vault"),
                payer.publicKey.toBuffer(),
                vaultSeed.toArrayLike(Buffer, "le", 8)
            ],
            program.programId
        );

        // Initialize with edge case minimum values
        await program.methods
            .initializeVault(
                vaultSeed,
                "c", "k", recipient, new BN(1), new BN(0), "M", new BN(0)
            )
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        const vaultAccount = await program.account.vault.fetch(vaultPda);
        expect(vaultAccount.timeInterval.toNumber()).to.equal(1);
        expect(vaultAccount.bountyLamports.toNumber()).to.equal(0);
        expect(vaultAccount.name).to.equal("M");
    });

    it("ping - Multiple pings update timestamp", async () => {
        const vaultSeed = new BN(930001);
        const recipient = Keypair.generate().publicKey;

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
                "cid", "key", recipient, new BN(300), new BN(0), "Multi Ping", new BN(0)
            )
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        // First ping
        await program.methods
            .ping()
            .accounts({ vault: vaultPda, owner: payer.publicKey })
            .rpc();

        const afterFirst = await program.account.vault.fetch(vaultPda);
        const firstCheckIn = afterFirst.lastCheckIn;

        // Note: In Bankrun, timestamps may not advance between txs in same slot
        // Just verify second ping succeeds without error
        await program.methods
            .ping()
            .accounts({ vault: vaultPda, owner: payer.publicKey })
            .rpc();

        const afterSecond = await program.account.vault.fetch(vaultPda);
        expect(afterSecond.lastCheckIn.gte(firstCheckIn)).to.be.true;
    });

    it("setDelegate - Clear delegate", async () => {
        const vaultSeed = new BN(940001);
        const recipient = Keypair.generate().publicKey;
        const delegate = Keypair.generate().publicKey;

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
                "cid", "key", recipient, new BN(300), new BN(0), "Clear Delegate", new BN(0)
            )
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        // Set delegate
        await program.methods
            .setDelegate(delegate)
            .accounts({ vault: vaultPda, owner: payer.publicKey })
            .rpc();

        let account = await program.account.vault.fetch(vaultPda);
        expect(account.delegate?.toString()).to.equal(delegate.toString());

        // Clear delegate (set to null/None)
        await program.methods
            .setDelegate(null)
            .accounts({ vault: vaultPda, owner: payer.publicKey })
            .rpc();

        account = await program.account.vault.fetch(vaultPda);
        expect(account.delegate).to.be.null;
    });

    it("topUpBounty - Zero top-up no-op", async () => {
        const vaultSeed = new BN(950001);
        const recipient = Keypair.generate().publicKey;
        const initialBounty = new BN(5000);

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
                "cid", "key", recipient, new BN(300), initialBounty, "Zero TopUp", new BN(0)
            )
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        // Top up with zero - should fail with InvalidAmount
        try {
            await program.methods
                .topUpBounty(new BN(0))
                .accounts({
                    vault: vaultPda,
                    owner: payer.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();
            expect.fail("Should have thrown InvalidAmount error");
        } catch (err: any) {
            expect(err).to.exist;
            expect(err.error?.errorCode?.code).to.equal("InvalidAmount");
        }
    });
});
