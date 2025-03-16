import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';


export default async function middleware(req: NextRequest) {
  const intlMiddleware = createMiddleware(routing);

  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/api')) {
    // You can add custom logic to modify or log API requests here
    console.log(`API request intercepted to ${pathname} endpoint`);

    // Example: Add custom header
    const response = NextResponse.next();
    response.headers.set('X-Custom-Header', 'my-header-value');

    return response; // Proceed with the API request
  }

  // Use the next-intl middleware for internationalization on all other requests
  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
