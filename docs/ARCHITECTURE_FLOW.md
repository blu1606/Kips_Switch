# 🏗️ Deadman's Switch - Architecture Flow

> **A comprehensive visual guide to the system architecture**

---

## 1. System Overview

```mermaid
graph TB
    subgraph "👤 Users"
        Owner[("🔒 Vault Owner")]
        Recipient[("📩 Recipient")]
    end

    subgraph "🖥️ Frontend - Next.js 14"
        Landing["Landing Page"]
        Dashboard["Dashboard"]
        Create["Create Wizard"]
        Claim["Claim Portal"]
        Demo["Demo Mode"]
    end

    subgraph "🔗 Blockchain - Solana"
        Program["Anchor Program"]
        PDA["Vault PDAs"]
    end

    subgraph "☁️ External Services"
        IPFS["IPFS / Pinata"]
        Email["Resend API"]
        Cron["Vercel Cron"]
    end

    Owner --> Landing
    Owner --> Dashboard
    Owner --> Create
    Recipient --> Claim
    
    Create --> IPFS
    Create --> Program
    Dashboard --> Program
    Claim --> Program
    Claim --> IPFS
    
    Program --> PDA
    Cron --> Program
    Cron --> Email
    Email --> Recipient
```

---

## 2. Component Architecture

```mermaid
graph TB
    subgraph "📱 src/app/ - Pages"
        A1["/ - Landing"]
        A2["/create - Vault Creation Wizard"]
        A3["/dashboard - Owner Dashboard"]
        A4["/claim - Recipient Claim Portal"]
        A5["/demo - Interactive Demo"]
        A6["/archive - Released Vaults"]
    end

    subgraph "🧩 src/components/"
        subgraph "Wizard Flow"
            W1["TemplateSelector"]
            W2["StepRecipient"]
            W3["StepContent"]
            W4["StepUploadSecret"]
            W5["StepReview"]
        end
        
        subgraph "Dashboard"
            D1["VaultGrid"]
            D2["VaultCard"]
            D3["CheckInButton"]
            D4["VaultDetailsModal"]
        end
        
        subgraph "Claim"
            C1["ClaimForm"]
            C2["ClaimModal"]
            C3["VaultReveal"]
            C4["Safe3D Animation"]
        end
        
        subgraph "Kip Mascot"
            K1["KipSpirit"]
            K2["KipChat"]
        end
    end

    A2 --> W1 --> W2 --> W3 --> W4 --> W5
    A3 --> D1 --> D2
    D2 --> D3
    D2 --> D4
    A4 --> C1 --> C2 --> C3
    C3 --> C4
    A3 --> K1
```

---

## 3. Smart Contract Architecture

```mermaid
graph LR
    subgraph "📦 Anchor Program"
        subgraph "State"
            S1["Vault Account"]
        end
        
        subgraph "Instructions"
            I1["initialize_vault"]
            I2["ping"]
            I3["trigger_release"]
            I4["update_vault"]
            I5["close_vault"]
            I6["claim_and_close"]
            I7["claim_sol"]
            I8["claim_tokens"]
            I9["lock_tokens"]
            I10["set_delegate"]
            I11["top_up_bounty"]
        end
    end

    I1 --> |Creates| S1
    I2 --> |Updates timestamp| S1
    I3 --> |Sets is_released| S1
    I4 --> |Modifies| S1
    I5 --> |Closes| S1
    I6 --> |Transfers & Closes| S1
```

### Vault Account Structure

```mermaid
classDiagram
    class Vault {
        +Pubkey owner
        +Pubkey recipient
        +String name
        +String ipfs_cid
        +String encrypted_key
        +i64 time_interval
        +i64 last_check_in
        +bool is_released
        +u8 bump
        +u64 bounty_lamports
        +Option~Pubkey~ delegate
    }
```

---

## 4. Data Flow: Create Vault

```mermaid
sequenceDiagram
    participant O as Owner
    participant UI as Create Wizard
    participant C as Crypto Utils
    participant IPFS as Pinata/IPFS
    participant S as Solana Program

    O->>UI: 1. Select Template
    O->>UI: 2. Enter Recipient Info
    O->>UI: 3. Add Content (text/files/voice)
    
    UI->>C: 4. Generate AES Key
    C->>C: 5. Encrypt Content
    C-->>UI: Encrypted Blob
    
    UI->>IPFS: 6. Upload Encrypted Blob
    IPFS-->>UI: 7. Return CID
    
    UI->>C: 8. Encrypt AES Key (password/wallet)
    C-->>UI: Encrypted Key
    
    UI->>S: 9. initialize_vault(recipient, cid, encrypted_key, interval)
    S->>S: 10. Create PDA Account
    S-->>UI: 11. Vault Created ✓
```

---

## 5. Data Flow: Check-In (Ping)

```mermaid
sequenceDiagram
    participant O as Owner
    participant UI as Dashboard
    participant S as Solana Program

    O->>UI: 1. Hold Check-In Button
    UI->>S: 2. ping() instruction
    S->>S: 3. Update last_check_in = now()
    S-->>UI: 4. Success
    UI->>UI: 5. Show "Alive" animation 💚
```

---

## 6. Data Flow: Trigger & Claim

```mermaid
sequenceDiagram
    participant Cron as Vercel Cron
    participant S as Solana Program
    participant E as Resend Email
    participant R as Recipient
    participant UI as Claim Portal
    participant IPFS as Pinata/IPFS
    participant C as Crypto Utils

    Note over Cron: Every 5 minutes
    Cron->>S: 1. Fetch all Vault accounts
    S-->>Cron: 2. Return vaults
    
    Cron->>Cron: 3. Check: now > last_check_in + interval?
    
    alt Vault Expired
        Cron->>S: 4. trigger_release()
        S->>S: 5. Set is_released = true
        Cron->>E: 6. Send claim email
        E->>R: 7. "Your vault is ready"
    end
    
    R->>UI: 8. Connect Wallet / Enter Password
    UI->>S: 9. Verify is_released && recipient matches
    S-->>UI: 10. Return CID + Encrypted Key
    
    UI->>IPFS: 11. Fetch encrypted blob
    IPFS-->>UI: 12. Encrypted content
    
    UI->>C: 13. Decrypt key (wallet sig / password)
    C->>C: 14. Decrypt content with AES key
    C-->>UI: 15. Decrypted content
    
    UI->>R: 16. Show revealed content 🎉
```

---

## 7. Encryption Model

```mermaid
flowchart TB
    subgraph "🔐 Client-Side Encryption"
        A["Raw Content"] --> B["AES-256-GCM Encrypt"]
        B --> C["Encrypted Blob → IPFS"]
        
        D["AES Key"] --> E{"Encryption Mode"}
        
        E --> |Password Mode| F["PBKDF2 Derived Key"]
        E --> |Wallet Mode| G["Wallet Signature Hash"]
        
        F --> H["Encrypted AES Key → Blockchain"]
        G --> H
    end
    
    subgraph "🔓 Decryption (Recipient)"
        I["Encrypted Key from Chain"] --> J{"Decryption Mode"}
        J --> |Password| K["PBKDF2 + User Password"]
        J --> |Wallet| L["Wallet Sign Message"]
        K --> M["Recovered AES Key"]
        L --> M
        M --> N["Decrypt Blob from IPFS"]
        N --> O["✨ Revealed Content"]
    end
```

---

## 8. API Routes Structure

```mermaid
graph TB
    subgraph "🔌 src/app/api/"
        subgraph "Vault Operations"
            V1["POST /vault/create"]
            V2["POST /vault/update"]
            V3["DELETE /vault/close"]
            V4["POST /vault/claim"]
        end
        
        subgraph "Check-In"
            P1["POST /magic-ping - Email link ping"]
        end
        
        subgraph "Cron Jobs"
            C1["GET /cron/check-status"]
        end
        
        subgraph "Notifications"
            A1["POST /alert - Send emails"]
        end
        
        subgraph "AI Features"
            AI1["POST /ai/smart-timer"]
            AI2["POST /ai/antidoxx"]
        end
        
        subgraph "System"
            S1["GET /system/health"]
        end
    end
```

---

## 9. Utility Modules

```mermaid
graph LR
    subgraph "🛠️ src/utils/"
        U1["anchor.ts - Solana connection & program"]
        U2["crypto.ts - AES encryption/decryption"]
        U3["ipfs.ts - Pinata upload/download"]
        U4["email.ts - Resend templates"]
        U5["kip.ts - Mascot state logic"]
        U6["safetyScanner.ts - Anti-doxx regex"]
        U7["vaultBundle.ts - Multi-media zip handler"]
        U8["solanaParsers.ts - Account parsing"]
    end
```

---

## 10. Tech Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 (App Router) | React SSR, API Routes |
| **Styling** | Tailwind CSS + Framer Motion | UI & Animations |
| **Blockchain** | Solana (Devnet) | Trust Layer |
| **Smart Contract** | Rust + Anchor | Vault Logic |
| **Storage** | IPFS via Pinata | Encrypted Content |
| **Email** | Resend API | Notifications |
| **Cron** | Vercel Cron | Status Checks |
| **Database** | Supabase | User preferences (optional) |

---

## 11. Security Architecture

```mermaid
flowchart TB
    subgraph "🛡️ Security Layers"
        L1["1. Client-Side Encryption"]
        L2["2. Zero-Knowledge Design"]
        L3["3. PDA Ownership Constraints"]
        L4["4. Time-Based Triggers"]
        L5["5. Permissionless Release"]
    end
    
    L1 --> |AES-256-GCM| S1["Keys never leave browser"]
    L2 --> |Server blind| S2["Server sees only encrypted blobs"]
    L3 --> |Anchor constraints| S3["Only owner can ping/update"]
    L4 --> |On-chain clock| S4["Trustless expiration"]
    L5 --> |Anyone can trigger| S5["No single point of failure"]
```

---

## 12. Deployment Architecture

```mermaid
graph TB
    subgraph "☁️ Vercel"
        V1["Next.js Frontend"]
        V2["API Routes"]
        V3["Cron Functions"]
    end
    
    subgraph "🌐 Solana"
        S1["Devnet Program"]
        S2["Vault PDAs"]
    end
    
    subgraph "📦 IPFS"
        I1["Pinata Gateway"]
        I2["Pinned Files"]
    end
    
    subgraph "📧 Email"
        E1["Resend API"]
    end
    
    V1 --> S1
    V2 --> S1
    V2 --> I1
    V2 --> E1
    V3 --> S1
    V3 --> E1
    S1 --> S2
    I1 --> I2
```

---

> **Last Updated:** 2025-12-11
