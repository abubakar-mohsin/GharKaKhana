import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/rbac';

export default auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  const session = req.auth; // populated by NextAuth v5

  // ─── Public routes – always allow ─────────────────────────────────────────
  const publicPaths = ['/', '/login', '/signup', '/forbidden'];
  const isPublic =
    publicPaths.includes(pathname) ||
    pathname.startsWith('/api/auth');

  if (isPublic) return NextResponse.next();

  // ─── Unauthenticated – redirect to login ──────────────────────────────────
  if (!session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ─── Authorised – role-based check ────────────────────────────────────────
  const userRole = session.user?.role;

  if (!isAuthorized(userRole, pathname)) {
    return NextResponse.redirect(new URL('/forbidden', req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Run middleware on all routes except static assets and next internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
