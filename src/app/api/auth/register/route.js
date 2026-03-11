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
//   6. Sends the verification email via Resend
//   7. Returns success — user must verify email before logging in
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
      // Return all validation errors so the frontend can show them
      return NextResponse.json(
        {
          error: 'Validation failed',
          fields: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { name, email, password } = validated.data
    // Note: confirmPassword is validated by Zod but not needed here

    // ── Step 2: Check if email already exists ────────────────────────────────
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // Do not reveal whether an email is registered — security best practice
      // We return the same message whether email exists or not
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // ── Step 3: Hash the password ────────────────────────────────────────────
    // bcrypt cost factor 12 — good balance of security and speed
    // Higher = slower to hash = harder for attackers to brute force
    const passwordHash = await bcrypt.hash(password, 12)

    // ── Step 4: Create the user ──────────────────────────────────────────────
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        // emailVerified is null by default — user cannot log in until verified
        // role defaults to MEMBER — set in schema
        // dietaryType, spiceTolerance, healthGoal all have schema defaults
      },
    })

    // ── Step 5: Create verification token ───────────────────────────────────
    // This token is stored in the VerificationToken table (NextAuth model)
    // It expires in 24 hours
    const token = uuidv4()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

    await prisma.verificationToken.create({
      data: {
        identifier: email, // NextAuth uses identifier + token as composite key
        token,
        expires,
      },
    })

    // ── Step 6: Send verification email ─────────────────────────────────────
    await sendVerificationEmail(email, name, token)

    // ── Step 7: Return success ───────────────────────────────────────────────
    // Never return the password hash or sensitive fields
    return NextResponse.json(
      {
        message: 'Account created. Please check your email to verify your account.',
        userId: user.id,
      },
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