// src/middleware.js
// ─────────────────────────────────────────────────────────────────────────────
// Runs before every request in the app.
// Handles two things:
//   1. Rate limiting on auth endpoints — prevents brute force attacks
//   2. Route protection — redirects unauthenticated users to login
//      and unauthorized users to /forbidden
// ─────────────────────────────────────────────────────────────────────────────

import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { isAuthorized } from '@/lib/rbac'
import { Redis } from '@upstash/redis'

// ─── Rate Limiter Setup ───────────────────────────────────────────────────────
// We use Upstash Redis to count requests per IP address
// Redis is perfect for this — it's fast and supports automatic key expiry
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Rate limit config for auth endpoints
const RATE_LIMIT_REQUESTS = 5   // max requests allowed
const RATE_LIMIT_WINDOW = 60    // per 60 seconds
const RATE_LIMIT_BLOCK = 900    // block for 15 minutes after too many attempts

async function rateLimit(ip, endpoint) {
  const key = `rate:${endpoint}:${ip}`
  const blockKey = `blocked:${endpoint}:${ip}`

  // Check if this IP is currently blocked
  const isBlocked = await redis.get(blockKey)
  if (isBlocked) {
    return { limited: true, reason: 'blocked' }
  }

  // Increment the request counter
  const count = await redis.incr(key)

  // First request — set expiry window
  if (count === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW)
  }

  // Too many requests — block this IP
  if (count > RATE_LIMIT_REQUESTS) {
    await redis.set(blockKey, '1', { ex: RATE_LIMIT_BLOCK })
    return { limited: true, reason: 'too-many-attempts' }
  }

  return { limited: false }
}

export default auth(async (req) => {
  const { nextUrl } = req
  const { pathname } = nextUrl
  const session = req.auth

  // ─── Rate limiting on auth endpoints ──────────────────────────────────────
  // Only apply to login and register — not to session/csrf/providers
  const isAuthEndpoint =
    pathname === '/api/auth/callback/credentials' ||
    pathname === '/api/auth/register'

  if (isAuthEndpoint) {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      '127.0.0.1'

    const { limited } = await rateLimit(ip, pathname)

    if (limited) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      )
    }
  }

  // ─── Public routes — always allow ─────────────────────────────────────────
  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/forbidden',
    '/features',
    '/how-it-works',
    '/dishes',
  ]

  const isPublic =
    publicPaths.includes(pathname) ||
    pathname.startsWith('/api/auth') ||
    pathname === '/api/dishes'

  if (isPublic) return NextResponse.next()

  // ─── Unauthenticated — redirect to login ──────────────────────────────────
  if (!session) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ─── Authorized — role-based check ────────────────────────────────────────
  const userRole = session.user?.role

  if (!isAuthorized(userRole, pathname)) {
    return NextResponse.redirect(new URL('/forbidden', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}