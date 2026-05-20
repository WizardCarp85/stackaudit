-- Add missing columns to the audits table to support pricing change detection
-- and full context recreation.

ALTER TABLE audits 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS form_state jsonb,
ADD COLUMN IF NOT EXISTS pricing_snapshot jsonb,
ADD COLUMN IF NOT EXISTS needs_review boolean DEFAULT false;

-- Create an index on needs_review to speed up the change-detection queries
CREATE INDEX IF NOT EXISTS idx_audits_needs_review ON audits(needs_review);
