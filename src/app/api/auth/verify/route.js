// src/app/api/auth/verify/route.js
// ─────────────────────────────────────────────────────────────────────────────
// Handles email verification when user clicks the link in their email.
//
// What this route does:
//   1. Reads the token from the URL query parameter
//   2. Finds the token in the VerificationToken table
//   3. Checks it has not expired
//   4. Marks the user's emailVerified as the current timestamp
//   5. Deletes the token — it can only be used once
//   6. Redirects user to login page with a success message
//
// GET /api/auth/verify?token=abc-123
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request) {
  try {

    // ── Step 1: Get token from URL ───────────────────────────────────────────
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(
        new URL('/login?error=missing-token', request.url)
      )
    }

    // ── Step 2: Find token in database ───────────────────────────────────────
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL('/login?error=invalid-token', request.url)
      )
    }

    // ── Step 3: Check token has not expired ──────────────────────────────────
    if (verificationToken.expires < new Date()) {
      // Delete expired token — clean up
      await prisma.verificationToken.delete({
        where: { token },
      })
      return NextResponse.redirect(
        new URL('/login?error=token-expired', request.url)
      )
    }

    // ── Step 4: Mark user as verified ────────────────────────────────────────
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    })

    // ── Step 5: Delete the token — single use only ───────────────────────────
    await prisma.verificationToken.delete({
      where: { token },
    })

    // ── Step 6: Redirect to login with success message ───────────────────────
    return NextResponse.redirect(
      new URL('/login?verified=true', request.url)
    )

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.redirect(
      new URL('/login?error=server-error', request.url)
    )
  }
}
