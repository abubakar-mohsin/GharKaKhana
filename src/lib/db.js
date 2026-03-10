// src/lib/db.js
// ─────────────────────────────────────────────────────────────────────────────
// Creates a single Prisma database connection for the entire app.
//
// Why the globalThis trick?
//   In development, Next.js hot-reloads your code on every save.
//   Without this, each reload creates a NEW database connection.
//   After a few reloads you'd have dozens of open connections — Supabase
//   would block you. globalThis persists across hot-reloads so we always
//   reuse the same single connection.
//
// In production this is not a problem — the server starts once and stays.
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma  // default export — matches "import prisma from '@/lib/db'"