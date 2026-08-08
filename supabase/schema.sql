-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create tables
create table public.destinations (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  location text not null,
  price numeric not null default 0,
  rating numeric not null default 0,
  reviews_count integer not null default 0,
  category text not null,
  description text not null,
  highlights jsonb not null default '[]'::jsonb,
  duration text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  destination_id uuid references public.destinations not null,
  booking_date date not null,
  guests integer not null default 1,
  total_price numeric not null,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Setup Storage (if not already existing)
insert into storage.buckets (id, name, public) values ('destination-images', 'destination-images', true)
on conflict (id) do nothing;

create policy "Public Access" on storage.objects for select
using ( bucket_id = 'destination-images' );

-- 3. Row Level Security (RLS)
alter table public.destinations enable row level security;
alter table public.bookings enable row level security;

-- Destinations are viewable by everyone
create policy "Destinations are viewable by everyone" on public.destinations
  for select using (true);

-- Bookings are viewable only by the user who created them
create policy "Users can view their own bookings" on public.bookings
  for select using (auth.uid() = user_id);

create policy "Users can insert their own bookings" on public.bookings
  for insert with check (auth.uid() = user_id);

-- 4. Insert Mock Data
insert into public.destinations (id, title, location, price, rating, reviews_count, category, description, highlights, duration, image_url) values
(uuid_generate_v4(), 'Candi Prambanan', 'Sleman, Yogyakarta', 50000, 4.9, 1245, 'Attraction', 'Prambanan is the largest Hindu temple site in Indonesia and one of the biggest in Southeast Asia.', '["UNESCO World Heritage Site", "Spectacular sunset view", "Ramayana Ballet performance (optional)"]', '3-4 hours', null),
(uuid_generate_v4(), 'Keraton Yogyakarta', 'Yogyakarta City', 15000, 4.8, 890, 'Attraction', 'The official palace of the Ngayogyakarta Hadiningrat Sultanate.', '["Cultural Heritage", "Museum", "Traditional Dance"]', '2-3 hours', null),
(uuid_generate_v4(), 'Mount Merapi Jeep Tour', 'Kaliurang', 350000, 4.9, 560, 'Tour', 'Explore the foothills of Mount Merapi using a classic 4x4 Jeep.', '["Off-road adventure", "Alien Rock", "Bunker Kaliadem"]', '2 hours', null),
(uuid_generate_v4(), 'Malioboro Street', 'Yogyakarta City', 0, 4.7, 3400, 'Attraction', 'The most famous street in Jogja for shopping and street food.', '["Shopping", "Street Food", "Night Walk"]', 'Flexible', null);

-- 5. Reviews Table
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  destination_id uuid references public.destinations not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reviews enable row level security;
create policy "Reviews are viewable by everyone" on public.reviews for select using (true);
create policy "Users can insert their own reviews" on public.reviews for insert with check (auth.uid() = user_id);

-- 6. Admins Table
create table public.admins (
  email text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.admins enable row level security;
create policy "Admins are viewable by everyone" on public.admins for select using (true);

-- Insert default admin
insert into public.admins (email) values ('admin@kartavia.com') on conflict do nothing;
