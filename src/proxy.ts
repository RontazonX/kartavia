import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Basic in-memory store for rate limiting (per edge instance)
// Key: IP, Value: { count: number, resetTime: number }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Cache for security settings from Supabase
let securitySettingsCache: {
  anti_scraping_enabled: boolean;
  rate_limit_max: number;
  rate_limit_window: number;
  expiresAt: number;
} | null = null;

const SCRAPER_USER_AGENTS = [
  'python-requests', 'curl', 'wget', 'scrapy', 'headlesschrome', 
  'puppeteer', 'selenium', 'phantomjs', 'postmanruntime', 
  'axios', 'got', 'node-fetch', 'urllib', 'libwww-perl'
];

export async function proxy(request: NextRequest, event?: NextFetchEvent) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const isPlaywrightTest = request.headers.get('x-playwright-test') === 'true';

  // Fetch security settings with 5-minute cache
  const now = Date.now();
  if (!securitySettingsCache || now > securitySettingsCache.expiresAt) {
    const { data } = await supabase
      .from('homepage_settings')
      .select('data')
      .eq('section', 'security')
      .single();

    const settings = data?.data || {
      anti_scraping_enabled: true,
      rate_limit_max: 500,
      rate_limit_window: 60
    };

    securitySettingsCache = {
      ...settings,
      expiresAt: now + 5 * 60 * 1000 // 5 minutes cache
    };
  }

  const { anti_scraping_enabled, rate_limit_max, rate_limit_window } = securitySettingsCache!;

  // 1. Anti-Scraping: Block known scraping bots by User-Agent
  if (anti_scraping_enabled) {
    const isScraper = SCRAPER_USER_AGENTS.some(agent => userAgent.includes(agent));
    
    if (isScraper && !isPlaywrightTest) {
      const logPromise = Promise.resolve(supabase.rpc('increment_blocked_request')).catch(() => {});
      if (event) event.waitUntil(logPromise);

      return new NextResponse(
        JSON.stringify({ error: "Access Denied: Scraping tools are not allowed." }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 2. Simple Rate Limiting (Bypass for Playwright)
  const pathname = request.nextUrl.pathname;
  if (!isPlaywrightTest && !pathname.startsWith('/_next/') && !pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)) {
    const clientRecord = rateLimitMap.get(ip);
    const RATE_LIMIT_WINDOW_MS = rate_limit_window * 1000;

    if (clientRecord) {
      if (now > clientRecord.resetTime) {
        clientRecord.count = 1;
        clientRecord.resetTime = now + RATE_LIMIT_WINDOW_MS;
      } else {
        clientRecord.count++;
        if (clientRecord.count > rate_limit_max) {
          const logPromise = Promise.resolve(supabase.rpc('increment_blocked_request')).catch(() => {});
          if (event) event.waitUntil(logPromise);

          return new NextResponse(
            JSON.stringify({ error: "Too Many Requests. Please slow down." }),
            { 
              status: 429, 
              headers: { 
                'Content-Type': 'application/json',
                'Retry-After': Math.ceil((clientRecord.resetTime - now) / 1000).toString()
              }
            }
          );
        }
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    }

    // Log Page View for valid requests (not API, not assets)
    if (!pathname.startsWith('/api/')) {
      const viewPromise = Promise.resolve(supabase.rpc('increment_page_view')).catch(() => {});
      if (event) event.waitUntil(viewPromise);
    }
  }

  // Auth checking for protected routes
  const { data: { user } } = await supabase.auth.getUser();

  // Define protected routes
  const isProtectedAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isProtectedCheckoutRoute = request.nextUrl.pathname.startsWith('/checkout');
  const isProtectedProfileRoute = request.nextUrl.pathname.startsWith('/profile');

  if ((isProtectedAdminRoute || isProtectedCheckoutRoute || isProtectedProfileRoute) && !user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect_to', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

// Specify the paths that the middleware should run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
