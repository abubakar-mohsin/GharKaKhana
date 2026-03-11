// src/validators/auth.js
// ─────────────────────────────────────────────────────────────────────────────
// Zod validation schemas for authentication forms.
// These run on the CLIENT (form validation) and SERVER (API validation).
// Never trust frontend validation alone — always re-validate in the API route.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod'

// ─── Login Schema ─────────────────────────────────────────────────────────────
// Used in: src/app/(public)/login/page.jsx
//          src/auth.js authorize() function
export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

// ─── Register Schema ──────────────────────────────────────────────────────────
// Used in: src/app/(public)/signup/page.jsx
//          src/app/api/auth/register/route.js
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(100, { message: 'Name must be under 100 characters' }),

    email: z
      .string()
      .email({ message: 'Invalid email address' })
      .toLowerCase(), // normalize email to lowercase before saving

    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

// ─── Types (JSDoc) ────────────────────────────────────────────────────────────
// Use these in your API routes and components for reference
// @typedef {z.infer<typeof loginSchema>} LoginInput
// @typedef {z.infer<typeof registerSchema>} RegisterInput