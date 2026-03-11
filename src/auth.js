// src/auth.js
// ─────────────────────────────────────────────────────────────────────────────
// Central NextAuth v5 configuration for GharKaKhana.
// Handles Google OAuth and email/password login.
// Attaches user.id and user.role to every session.
// ─────────────────────────────────────────────────────────────────────────────

import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'

export const { handlers, auth, signIn, signOut } = NextAuth({

  adapter: PrismaAdapter(prisma),

  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [

    // ── Google OAuth ──────────────────────────────────────────────────────────
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture, // must be "image" — this is what PrismaAdapter expects
          role: 'MEMBER',
        }
      },
    }),

    // ── Email + Password ──────────────────────────────────────────────────────
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
            deletedAt: null,
          },
        })

        if (!user || !user.passwordHash) {
          throw new Error('Invalid credentials')
        }

        if (!user.emailVerified) {
          throw new Error('Please verify your email before logging in')
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!passwordMatch) {
          throw new Error('Invalid credentials')
        }

        return user
      },
    }),
  ],

  callbacks: {

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.emailVerified = user.emailVerified
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.emailVerified = token.emailVerified
      }
      return session
    },
  },

  // ─── Events ─────────────────────────────────────────────────────────────────
  // Events fire AFTER an action completes.
  // We use createUser to copy the Google profile picture into our avatarUrl field
  // and ensure the role is set correctly.
  //
  // Why do we need this?
  //   PrismaAdapter creates the User row using NextAuth's standard fields.
  //   It knows about "image" but not our custom "avatarUrl" field.
  //   So we listen for the createUser event and update the row ourselves.
  events: {
    async createUser({ user }) {
      if (user.image) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            avatarUrl: user.image, // copy Google picture into our custom field
            role: 'MEMBER',        // ensure role is set correctly
          },
        })
      }
    },
  },

})