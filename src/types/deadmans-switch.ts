import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export type DeadmansSwitch = {
    "address": "HnFEhMS84CabpztHCDdGGN8798NxNse7NtXW4aG17XpB",
    "metadata": {
        "name": "deadmans_switch",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "version": "0.1.0",
    "name": "deadmans_switch",
    "instructions": [
        {
            "name": "claim_and_close",
            "docs": [
                "Claim the vault contents and close it."
            ],
            "discriminator": [177, 41, 244, 95, 42, 114, 27, 99],
            "accounts": [
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "recipient",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": []
        },
        {
            "name": "claim_sol",
            "docs": [
                "Claim locked SOL from a released vault."
            ],
            "discriminator": [139, 113, 179, 189, 190, 30, 132, 195],
            "accounts": [
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "recipient",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "system_program",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "claim_tokens",
            "docs": [
                "Claim locked SPL tokens from a released vault."
            ],
            "discriminator": [108, 216, 210, 231, 0, 212, 42, 64],
            "accounts": [
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "recipient",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "token_mint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "vault_token_account",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "recipient_token_account",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "token_program",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "associated_token_program",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "system_program",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "close_vault",
            "docs": [
                "Close the vault and reclaim rent back to owner."
            ],
            "discriminator": [141, 103, 17, 126, 72, 75, 29, 29],
            "accounts": [
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": []
        },
        {
            "name": "initialize_vault",
            "docs": [
                "Initialize a new vault with dead man's switch functionality."
            ],
            "discriminator": [48, 191, 163, 44, 71, 129, 63, 164],
            "accounts": [
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "system_program",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "seed",
                    "type": "u64"
                },
                {
                    "name": "ipfs_cid",
                    "type": "string"
                },
                {
                    "name": "encrypted_key",
                    "type": "string"
                },
                {
                    "name": "recipient",
                    "type": "pubkey"
                },
                {
                    "name": "time_interval",
                    "type": "i64"
                },
                {
                    "name": "bounty_lamports",
                    "type": "u64"
                },
                {
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "locked_lamports",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "lock_tokens",
            "docs": [
                "Lock SPL tokens into a vault for vesting."
            ],
            "discriminator": [136, 11, 32, 232, 161, 117, 54, 211],
            "accounts": [
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "token_mint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "owner_token_account",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "vault_token_account",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "token_program",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "associated_token_program",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "system_program",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "ping",
            "docs": [
                "Ping (check-in) to reset the dead man's switch timer."
            ],
            "discriminator": [173, 0, 94, 236, 73, 133, 225, 153],
            "accounts": [
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "signer",
                    "isMut": false,
                    "isSigner": true
                }
            ],
            "args": []
        },
        {
            "name": "set_delegate",
            "docs": [
                "Set or clear the delegate wallet that can ping on owner's behalf."
            ],
            "discriminator": [242, 30, 46, 76, 108, 235, 128, 181],
            "accounts": [
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "owner",
                    "isMut": false,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "new_delegate",
                    "type": {
                        "option": "pubkey"
                    }
                }
            ]
        },
        {
            "name": "top_up_bounty",
            "docs": [
                "Add more SOL to the bounty pool."
            ],
            "discriminator": [92, 218, 186, 142, 94, 191, 155, 242],
            "accounts": [
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "system_program",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "trigger_release",
            "docs": [
                "Trigger the release of vault contents if the timer has expired."
            ],
            "discriminator": [101, 202, 88, 152, 92, 22, 172, 51],
            "accounts": [
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "hunter",
                    "isMut": true,
                    "isSigner": true
                }
            ],
            "args": []
        },
        {
            "name": "update_vault",
            "docs": [
                "Update vault settings (recipient and/or interval)."
            ],
            "discriminator": [67, 229, 185, 188, 226, 11, 210, 60],
            "accounts": [
                {
                    "name": "vault",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "owner",
                    "isMut": false,
                    "isSigner": true
                }
            ],
            "args": [
                {
                    "name": "new_recipient",
                    "type": {
                        "option": "pubkey"
                    }
                },
                {
                    "name": "new_time_interval",
                    "type": {
                        "option": "i64"
                    }
                },
                {
                    "name": "new_name",
                    "type": {
                        "option": "string"
                    }
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "Vault",
            "discriminator": [211, 8, 232, 43, 2, 152, 117, 119],
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "owner",
                        "type": "pubkey"
                    },
                    {
                        "name": "recipient",
                        "type": "pubkey"
                    },
                    {
                        "name": "ipfs_cid",
                        "type": "string"
                    },
                    {
                        "name": "encrypted_key",
                        "type": "string"
                    },
                    {
                        "name": "time_interval",
                        "type": "i64"
                    },
                    {
                        "name": "last_check_in",
                        "type": "i64"
                    },
                    {
                        "name": "is_released",
                        "type": "bool"
                    },
                    {
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "name": "delegate",
                        "type": {
                            "option": "pubkey"
                        }
                    },
                    {
                        "name": "bounty_lamports",
                        "type": "u64"
                    },
                    {
                        "name": "seed",
                        "type": "u64"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    },
                    {
                        "name": "locked_lamports",
                        "type": "u64"
                    },
                    {
                        "name": "token_mint",
                        "type": {
                            "option": "publicKey"
                        }
                    },
                    {
                        "name": "locked_tokens",
                        "type": "u64"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "Unauthorized",
            "msg": "Only the vault owner or delegate can perform this action"
        },
        {
            "code": 6001,
            "name": "NotExpired",
            "msg": "Vault timer has not expired yet"
        },
        {
            "code": 6002,
            "name": "AlreadyReleased",
            "msg": "Vault has already been released"
        },
        {
            "code": 6003,
            "name": "IpfsCidTooLong",
            "msg": "IPFS CID exceeds maximum length"
        },
        {
            "code": 6004,
            "name": "EncryptedKeyTooLong",
            "msg": "Encrypted key exceeds maximum length"
        },
        {
            "code": 6005,
            "name": "NameTooLong",
            "msg": "Vault name exceeds maximum length"
        },
        {
            "code": 6006,
            "name": "NotRecipient",
            "msg": "Only the designated recipient can claim this vault"
        },
        {
            "code": 6007,
            "name": "CalculationOverflow",
            "msg": "Numerical overflow occurred"
        },
        {
            "code": 6008,
            "name": "NoLockedSol",
            "msg": "No locked SOL to claim"
        },
        {
            "code": 6009,
            "name": "NotReleased",
            "msg": "Vault must be released (expired) to claim assets"
        },
        {
            "code": 6010,
            "name": "NoLockedTokens",
            "msg": "No locked tokens to claim"
        },
        {
            "code": 6011,
            "name": "InvalidTokenMint",
            "msg": "Provided token mint does not match vault"
        }
    ]
};

export interface VaultAccount {
    owner: PublicKey;
    recipient: PublicKey;
    ipfsCid: string;
    encryptedKey: string;
    timeInterval: BN;
    lastCheckIn: BN;
    isReleased: boolean;
    name: string;
    delegate: PublicKey | null;
    bountyLamports: BN;
    seed: BN;
    bump: number;
    lockedLamports: BN;
    tokenMint: PublicKey | null;
    lockedTokens: BN;
}
