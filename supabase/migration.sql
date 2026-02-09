-- SmartCorp CRM — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- =================================================
-- 1. LEADS TABLE
-- =================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  city_state TEXT,
  project_type TEXT,          -- residential, commercial, medical, other
  timeline TEXT,              -- immediate, 1-3 months, 3-6 months, just exploring
  glass_size TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'quoted', 'won', 'lost')),
  source TEXT DEFAULT 'quote_form'
    CHECK (source IN ('quote_form', 'manual', 'google_sheet', 'phone', 'referral')),
  google_sheet_row_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_updated_at ON leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =================================================
-- 2. FOLLOW-UPS TABLE
-- =================================================
CREATE TABLE IF NOT EXISTS follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  follow_up_date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_followups_lead ON follow_ups (lead_id);
CREATE INDEX IF NOT EXISTS idx_followups_date ON follow_ups (follow_up_date);

-- =================================================
-- 3. GALLERY IMAGES TABLE (optional, for future use)
-- =================================================
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  alt TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =================================================
-- 4. ROW LEVEL SECURITY
-- =================================================
-- For now, since we use hardcoded auth, we use the service_role key 
-- on our serverless API and anon key on the client.
-- Enable RLS but allow anon INSERT for the quote form:

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT leads (quote form)
CREATE POLICY "Allow anon insert leads" ON leads
  FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated / service_role full access
CREATE POLICY "Allow service full access leads" ON leads
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- For the dashboard, we use the anon key with full SELECT/UPDATE/DELETE
-- (since auth is handled client-side with hardcoded password)
CREATE POLICY "Allow anon read leads" ON leads
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon update leads" ON leads
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon delete leads" ON leads
  FOR DELETE TO anon USING (true);

-- Follow-ups: full access for anon (auth is client-side)
CREATE POLICY "Allow anon all follow_ups" ON follow_ups
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- Gallery: read-only for anon
CREATE POLICY "Allow anon read gallery" ON gallery_images
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow service full gallery" ON gallery_images
  FOR ALL TO service_role USING (true) WITH CHECK (true);
