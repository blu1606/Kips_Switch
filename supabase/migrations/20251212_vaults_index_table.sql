-- Vaults Index Table for DAS API Migration
-- Purpose: Fast vault lookup by owner/recipient instead of getProgramAccounts
-- Applied via Supabase MCP: 2025-12-12

CREATE TABLE IF NOT EXISTS vaults (
    pubkey TEXT PRIMARY KEY,           -- Vault public key (on-chain address)
    owner TEXT NOT NULL,               -- Owner wallet address
    recipient TEXT NOT NULL,           -- Recipient wallet address
    is_released BOOLEAN DEFAULT FALSE, -- Vault release status
    last_check_in TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookup by owner and recipient
CREATE INDEX IF NOT EXISTS idx_vaults_owner ON vaults(owner);
CREATE INDEX IF NOT EXISTS idx_vaults_recipient ON vaults(recipient);
CREATE INDEX IF NOT EXISTS idx_vaults_is_released ON vaults(is_released);

-- Enable RLS with Service Role access only
ALTER TABLE vaults ENABLE ROW LEVEL SECURITY;

-- Deny all public access - only service role can access
CREATE POLICY "Deny public access on vaults"
ON vaults FOR ALL TO anon USING (false);

-- Allow service role full access
CREATE POLICY "Service role full access on vaults"
ON vaults FOR ALL TO service_role USING (true) WITH CHECK (true);
