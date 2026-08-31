-- Fix schema for destinations table
ALTER TABLE public.destinations 
ADD COLUMN IF NOT EXISTS duration text,
ADD COLUMN IF NOT EXISTS highlights jsonb,
ADD COLUMN IF NOT EXISTS partner_id uuid,
ADD COLUMN IF NOT EXISTS reviews_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS itinerary jsonb;

-- Allow insert, update, and delete for everyone (karena tidak pakai service role key)
CREATE POLICY "Allow ALL for everyone on destinations" 
ON public.destinations 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Tambahkan relasi antara destinations dan partners agar halaman detail tidak error
ALTER TABLE public.destinations 
ADD CONSTRAINT fk_destinations_partner 
FOREIGN KEY (partner_id) 
REFERENCES public.partners(id);



-- Fix missing time_slot in bookings table
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS time_slot text;

-- Fix missing guests in bookings table
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guests integer DEFAULT 1;

-- Comprehensive fix for bookings table
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS time_slot text, ADD COLUMN IF NOT EXISTS guests integer DEFAULT 1, ADD COLUMN IF NOT EXISTS booking_date date, ADD COLUMN IF NOT EXISTS total_price numeric, ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
