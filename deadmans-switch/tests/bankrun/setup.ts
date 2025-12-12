import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { DeadmansSwitch } from "../../target/types/deadmans_switch"; // Adjust path if needed
import IDL from "../../target/idl/deadmans_switch.json"; // Or src/idl/deadmans_switch.json

export const PROGRAM_ID = new PublicKey("HnFEhMS84CabpztHCDdGGN8798NxNse7NtXW4aG17XpB");

export async function setupBankrun() {
    const context = await startAnchor(
        "./", // path to root of anchor project
        [], // extra accounts
        [] // extra programs
    );

    const provider = new BankrunProvider(context);

    // Removed debug logs
    const program = new Program<DeadmansSwitch>(
        IDL as any,
        provider
    );

    return {
        context,
        provider,
        program,
        banksClient: context.banksClient,
        payer: context.payer
    };
}
