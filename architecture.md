# Kartavia Architecture

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (configured for a clean, white-themed premium aesthetic)
- **Database / Backend:** Supabase (PostgreSQL, Authentication, Storage)
- **Icons:** Lucide React

## Project Structure
```text
kartavia/
├── src/
│   ├── app/
│   │   ├── (auth)/        # Login/Register routes (if any)
│   │   ├── explore/       # Search and explore page
│   │   ├── detail/[id]/   # Destination/Product detail page
│   │   ├── layout.tsx     # Root layout (Navbar, Footer)
│   │   └── page.tsx       # Home page
│   ├── components/
│   │   ├── ui/            # Reusable UI components (Buttons, Inputs, Cards)
│   │   └── shared/        # Shared components (Navbar, Footer, Hero)
│   ├── lib/
│   │   ├── supabase.ts    # Supabase client setup
│   │   └── utils.ts       # Utility functions
│   └── types/             # TypeScript definitions

## Naming Conventions
- **Files/Components:** Use functional names instead of `index.tsx` for components (e.g. `Sidebar.tsx` instead of `Sidebar/index.tsx`). This applies to all components to make searching and maintaining the codebase easier.

├── public/                # Static assets (images, icons)
├── architecture.md
├── design.md
├── production.md
└── package.json
```

## Data Models (Supabase)

### `destinations`
Stores information about tourist attractions, tours, and car rentals.
- `id`: uuid (PK)
- `title`: text
- `description`: text
- `category`: text (e.g., 'tour', 'ticket', 'rental')
- `price`: numeric
- `image_url`: text
- `rating`: numeric
- `location`: text

### `bookings` (Future scope)
- `id`: uuid (PK)
- `user_id`: uuid (FK to auth.users)
- `destination_id`: uuid (FK to destinations)
- `date`: date
- `status`: text

### `reviews` (Future scope)
- `id`: uuid (PK)
- `destination_id`: uuid (FK to destinations)
- `user_id`: uuid (FK to auth.users)
- `rating`: integer
- `comment`: text

## Data Fetching Strategy
- We will leverage Next.js Server Components (`app/page.tsx`, `app/explore/page.tsx`) to fetch data directly from Supabase for optimal performance and SEO.
- Client Components (`"use client"`) will be used specifically for interactive UI elements (e.g., search bars, filtering logic, and booking modals).
