// src/lib/auth-helpers.js
// ─────────────────────────────────────────────────────────────────────────────
// Reusable authentication & authorization helpers for API routes.
//
// Usage:
//   import { requireSession, validateOwnership } from '@/lib/auth-helpers'
//
//   const { session, error } = await requireSession()
//   if (error) return error
//
//   const ownership = await validateMealLogOwnership(logId, session.user.id)
//   if (ownership.error) return ownership.error
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import prisma from '@/lib/db'

/**
 * Checks the session and returns the authenticated user.
 * If no session, returns a 401 JSON response.
 */
export async function requireSession() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      session: null,
      error: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
    }
  }

  return { session, error: null }
}

/**
 * Validates that a meal log exists and belongs to the given user.
 * Returns the meal log on success, or a JSON error response.
 *
 * @param {string} logId - UUID of the meal log
 * @param {string} userId - UUID of the authenticated user
 */
export async function validateMealLogOwnership(logId, userId) {
  const log = await prisma.mealLog.findUnique({
    where: { id: logId },
  })

  if (!log || log.deletedAt) {
    return {
      log: null,
      error: NextResponse.json(
        { error: 'Meal log not found' },
        { status: 404 }
      ),
    }
  }

  if (log.userId !== userId) {
    return {
      log: null,
      error: NextResponse.json(
        { error: 'Forbidden — you can only access your own meal logs' },
        { status: 403 }
      ),
    }
  }

  return { log, error: null }
}
