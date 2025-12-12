import { describe, it, before } from "mocha";
import { expect } from "chai";
import { setupBankrun } from "./setup";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

describe("Vault P1 Core Functionality Tests", () => {
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

    it("initializeVault - Should reject name too long", async () => {
        const vaultSeed = new BN(500001);
        const recipient = Keypair.generate().publicKey;
        const tooLongName = "A".repeat(65); // Assuming MAX_VAULT_NAME_LEN = 64

        const [vaultPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("vault"),
                payer.publicKey.toBuffer(),
                vaultSeed.toArrayLike(Buffer, "le", 8)
            ],
            program.programId
        );

        try {
            await program.methods
                .initializeVault(
                    vaultSeed,
                    "cid", "key", recipient, new BN(300), new BN(0), tooLongName, new BN(0)
                )
                .accounts({
                    vault: vaultPda,
                    owner: payer.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();
            expect.fail("Should have thrown NameTooLong error");
        } catch (err: any) {
            expect(err).to.exist;
        }
    });

    it("setDelegate - Owner sets delegate successfully", async () => {
        const vaultSeed = new BN(600001);
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

        // Initialize vault
        await program.methods
            .initializeVault(
                vaultSeed,
                "cid", "key", recipient, new BN(300), new BN(0), "Delegate Test", new BN(0)
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
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
            })
            .rpc();

        // Verify delegate was set
        const vaultAccount = await program.account.vault.fetch(vaultPda);
        expect(vaultAccount.delegate?.toString()).to.equal(delegate.toString());
    });

    it("updateVault - Owner updates vault name", async () => {
        const vaultSeed = new BN(700001);
        const recipient = Keypair.generate().publicKey;
        const newName = "Updated Vault Name";

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
                "oldCid", "oldKey", recipient, new BN(300), new BN(0), "Old Name", new BN(0)
            )
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        // Update vault
        await program.methods
            .updateVault(recipient, new BN(600), newName)
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
            })
            .rpc();

        // Verify update
        const vaultAccount = await program.account.vault.fetch(vaultPda);
        expect(vaultAccount.name).to.equal(newName);
        expect(vaultAccount.timeInterval.toNumber()).to.equal(600);
    });

    // 14.1f - Additional P1 tests
    it("initializeVault - Should reject zero time_interval", async () => {
        const vaultSeed = new BN(750001);
        const recipient = Keypair.generate().publicKey;

        const [vaultPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("vault"),
                payer.publicKey.toBuffer(),
                vaultSeed.toArrayLike(Buffer, "le", 8)
            ],
            program.programId
        );

        try {
            await program.methods
                .initializeVault(
                    vaultSeed,
                    "cid", "key", recipient, new BN(0), new BN(0), "Zero Interval", new BN(0)
                )
                .accounts({
                    vault: vaultPda,
                    owner: payer.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();
            expect.fail("Should have thrown InvalidTimeInterval error");
        } catch (err: any) {
            expect(err).to.exist;
        }
    });

    it("updateVault - Non-owner cannot update", async () => {
        const vaultSeed = new BN(760001);
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

        // Initialize vault as owner
        await program.methods
            .initializeVault(
                vaultSeed,
                "cid", "key", recipient, new BN(300), new BN(0), "Update Auth Test", new BN(0)
            )
            .accounts({
                vault: vaultPda,
                owner: payer.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        // Attacker tries to update
        try {
            await program.methods
                .updateVault(recipient, new BN(600), "Hacked Name")
                .accounts({
                    vault: vaultPda,
                    owner: attacker.publicKey,
                })
                .signers([attacker])
                .rpc();
            expect.fail("Should have thrown constraint error");
        } catch (err: any) {
            expect(err).to.exist;
        }
    });
});
