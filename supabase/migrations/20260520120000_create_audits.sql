-- Create the audits table
CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY,
    email TEXT,
    form_state JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    pricing_snapshot JSONB NOT NULL,
    pricing_outdated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying by outdated status
CREATE INDEX IF NOT EXISTS idx_audits_pricing_outdated ON audits (pricing_outdated);
