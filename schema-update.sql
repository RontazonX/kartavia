-- Run this query in your Supabase SQL Editor to add the owner_email column
-- This allows the admin to assign a manager to a partner/desa wisata

ALTER TABLE public.partners 
ADD COLUMN IF NOT EXISTS owner_email TEXT;
