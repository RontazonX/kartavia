# Kartavia Production Strategy

## Deployment Setup
- **Platform:** Vercel (Recommended for Next.js applications).
- **Build Command:** `npm run build`
- **Install Command:** `npm install`

## Environment Variables
The following environment variables are required in the production environment (e.g., Vercel Environment Variables settings):
- `NEXT_PUBLIC_SUPABASE_URL`: The URL of the Supabase project.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The public anonymized key for Supabase client usage.

## Performance Optimization
- **Image Optimization:** All images, especially heavy destination photos, must use the `next/image` component to ensure they are optimized, compressed, and served in modern formats (like WebP).
- **Server-Side Rendering (SSR):** Key pages (Home, Detail) should fetch data server-side to ensure search engines can properly index the content.
- **Caching:** Leverage Next.js data cache for relatively static data (like list of destinations) to reduce Supabase reads and decrease response times. Revalidation can be configured.

## CI/CD Pipeline
- **GitHub Integration:** Connect the GitHub repository directly to Vercel.
- **Preview Deployments:** Every pull request should trigger a preview deployment for QA.
- **Production Deployments:** Merging to the `main` branch automatically triggers a production build.

## SEO Best Practices
- Utilize the Next.js App Router Metadata API to dynamically generate `title`, `description`, and `openGraph` tags for every destination detail page.
- Ensure semantic HTML tags (`<header>`, `<main>`, `<article>`) are used throughout the application.
