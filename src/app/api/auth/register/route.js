// src/app/api/auth/register/route.js
// ─────────────────────────────────────────────────────────────────────────────
// Handles new user registration.
//
// What this route does step by step:
//   1. Validates the request body using registerSchema (Zod)
//   2. Checks if email is already taken
//   3. Hashes the password using bcrypt
//   4. Creates the user in the database
//   5. Creates a verification token
//   6. In development with SKIP_EMAIL_VERIFICATION=true → auto-verify and return
//   7. In production → sends the verification email via Resend
//   8. Returns success — user must verify email before logging in
//
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import prisma from '@/lib/db'
import { registerSchema } from '@/validators/auth'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(request) {
  try {

    // ── Step 1: Parse and validate request body ──────────────────────────────
    const body = await request.json()

    const validated = registerSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          fields: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { name, email, password } = validated.data

    // ── Step 2: Check if email already exists ────────────────────────────────
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'If this email is available, you will receive a verification link shortly.' },
        { status: 200 }
      )
    }

    // ── Step 3: Hash the password ────────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, 12)

    // ── Step 4: Create the user ──────────────────────────────────────────────
    let user
    try {
      user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
        },
      })
    } catch (dbError) {
      if (dbError.code === 'P2002') {
        return NextResponse.json(
          { message: 'If this email is available, you will receive a verification link shortly.' },
          { status: 200 }
        )
      }
      throw dbError
    }

    // ── Step 5: Create verification token ───────────────────────────────────
    const token = uuidv4()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    // ── Step 6: Development bypass ───────────────────────────────────────────
    // Resend free tier only sends to one verified email address.
    // In development with SKIP_EMAIL_VERIFICATION=true we auto-verify
    // the user immediately so you can test with any email address.
    // This block NEVER runs in production — NODE_ENV is always 'production'.
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.SKIP_EMAIL_VERIFICATION === 'true'
    ) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })

      await prisma.verificationToken.delete({
        where: { token },
      }).catch(() => {})

      return NextResponse.json(
        { message: 'Account created. You can sign in immediately (development mode).' },
        { status: 201 }
      )
    }

    // ── Step 7: Send verification email (production) ─────────────────────────
    try {
      await sendVerificationEmail(email, name, token)
    } catch (emailError) {
      console.error('Email send failed, cleaning up:', emailError)

      await prisma.verificationToken.delete({
        where: { token },
      }).catch(() => {})

      await prisma.user.delete({
        where: { id: user.id },
      }).catch(() => {})

      return NextResponse.json(
        { error: 'We could not send your verification email. Please try again in a few minutes.' },
        { status: 500 }
      )
    }

    // ── Step 8: Return success ───────────────────────────────────────────────
    return NextResponse.json(
      { message: 'Account created. Please check your email to verify your account.' },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
