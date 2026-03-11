// src/lib/email.js
// ─────────────────────────────────────────────────────────────────────────────
// Email sending utility using Resend.
// All emails sent by GharKaKhana go through this file.
//
// Why a separate utility file?
//   If we ever switch from Resend to another email provider,
//   we only change this one file — nothing else in the app changes.
// ─────────────────────────────────────────────────────────────────────────────

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// The "from" address for all emails
// During development Resend allows onboarding@resend.dev for free
// In production you will replace this with your own domain e.g. no-reply@gharkhana.com
const FROM_EMAIL = 'GharKaKhana <onboarding@resend.dev>'

// ─── Send Verification Email ──────────────────────────────────────────────────
/**
 * Sends an email verification link to a newly registered user.
 * The token is stored in the VerificationToken table by the register API.
 * When the user clicks the link, the verify API checks this token.
 *
 * @param {string} email - recipient email address
 * @param {string} name  - recipient name for personalisation
 * @param {string} token - the verification token from the database
 */
export async function sendVerificationEmail(email, name, token) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Verify your GharKaKhana account',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #b45309;">Welcome to GharKaKhana, ${name}!</h2>
        <p>Thank you for registering. Please verify your email address to activate your account.</p>
        <a
          href="${verifyUrl}"
          style="
            display: inline-block;
            margin: 24px 0;
            padding: 12px 24px;
            background: #b45309;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
          "
        >
          Verify My Email
        </a>
        <p style="color: #6b7280; font-size: 14px;">
          This link expires in 24 hours. If you did not create an account, ignore this email.
        </p>
        <p style="color: #6b7280; font-size: 14px;">
          Or copy this link into your browser:<br/>
          <span style="color: #b45309;">${verifyUrl}</span>
        </p>
      </div>
    `,
  })

  // If Resend returns an error, throw it so the register API can handle it
  if (error) {
    console.error('Failed to send verification email:', error)
    throw new Error('Failed to send verification email')
  }

  return data
}
