-- ============================================================================
-- BESPOKE LUXURY WEDDING INVITATION - DATABASE SCHEMA MIGRATION
-- Engine: PostgreSQL 15+ (Supabase Managed Cloud)
-- Migration: 00001_initial_schema.sql
-- ============================================================================

-- 1. Buat Enum Status Kehadiran jika belum ada
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_enum') THEN
        CREATE TYPE attendance_enum AS ENUM ('attending', 'declined');
    END IF;
END $$;

-- 2. Buat Tabel public.rsvps
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name VARCHAR(60) NOT NULL,
    attendance_status attendance_enum NOT NULL,
    pax_count SMALLINT NOT NULL DEFAULT 1 CHECK (pax_count BETWEEN 1 AND 5),
    message VARCHAR(500) NOT NULL,
    ip_hash VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT check_guest_name_not_empty CHECK (char_length(trim(guest_name)) > 0),
    CONSTRAINT check_message_not_empty CHECK (char_length(trim(message)) > 0)
);

-- 3. Pembuatan Indeks Performa
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvps_ip_created ON public.rsvps (ip_hash, created_at DESC);

-- 4. Aktifkan Row Level Security (RLS)
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- 5. Bersihkan Policy Lama jika Ada
DROP POLICY IF EXISTS "Public can view sanitized wishes" ON public.rsvps;
DROP POLICY IF EXISTS "Public can submit RSVP" ON public.rsvps;
DROP POLICY IF EXISTS "Only admin can modify rsvps" ON public.rsvps;

-- 6. Pasang Security Policies Baru
CREATE POLICY "Public can view sanitized wishes"
    ON public.rsvps
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public can submit RSVP"
    ON public.rsvps
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Only admin can modify rsvps"
    ON public.rsvps
    FOR ALL
    TO service_role
    USING (true);

-- 7. Daftarkan Tabel ke Supabase Realtime Publication
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) AND NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'rsvps'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvps;
    END IF;
END $$;
