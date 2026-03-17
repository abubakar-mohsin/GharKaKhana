// src/app/api/meal-logs/[id]/route.js
// ─────────────────────────────────────────────────────────────────────────────
// Authenticated API endpoints for a single meal log.
//
// GET    /api/meal-logs/:id  — fetch one meal log (owner only)
// PATCH  /api/meal-logs/:id  — edit servings/notes (owner only)
// DELETE /api/meal-logs/:id  — soft delete (owner only)
//
// Auth: all requests require a valid session.
//       Ownership is validated on every request.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireSession, validateMealLogOwnership } from '@/lib/auth-helpers'
import { mealLogIdParamSchema, updateMealLogSchema } from '@/validators'

// ─── GET — Fetch Single Meal Log ────────────────────────────────────────────
export async function GET(request, { params }) {
  try {
    const { session, error: authError } = await requireSession()
    if (authError) return authError

    // Validate param
    const { id } = await params
    const paramResult = mealLogIdParamSchema.safeParse({ id })
    if (!paramResult.success) {
      return NextResponse.json(
        { error: 'Invalid meal log ID format' },
        { status: 400 }
      )
    }

    // Ownership check
    const { log, error: ownerError } = await validateMealLogOwnership(
      id,
      session.user.id
    )
    if (ownerError) return ownerError

    // Fetch full log with dish data
    const fullLog = await prisma.mealLog.findUnique({
      where: { id },
      include: {
        dish: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            description: true,
            dietaryType: true,
            spiceLevel: true,
            prepTimeMinutes: true,
            nutrition: true,
          },
        },
      },
    })

    return NextResponse.json({ data: fullLog })
  } catch (error) {
    console.error('API_MEAL_LOG_GET_ERROR:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// ─── PATCH — Edit Meal Log (servings & notes only) ──────────────────────────
export async function PATCH(request, { params }) {
  try {
    const { session, error: authError } = await requireSession()
    if (authError) return authError

    // Validate param
    const { id } = await params
    const paramResult = mealLogIdParamSchema.safeParse({ id })
    if (!paramResult.success) {
      return NextResponse.json(
        { error: 'Invalid meal log ID format' },
        { status: 400 }
      )
    }

    // Ownership check
    const { error: ownerError } = await validateMealLogOwnership(
      id,
      session.user.id
    )
    if (ownerError) return ownerError

    // Validate body — only servings and notes allowed
    const body = await request.json()
    const result = updateMealLogSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Build update data — only include fields that were provided
    const updateData = {}
    if (result.data.servings !== undefined) updateData.servings = result.data.servings
    if (result.data.notes !== undefined) updateData.notes = result.data.notes

    const updated = await prisma.mealLog.update({
      where: { id },
      data: updateData,
      include: {
        dish: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            dietaryType: true,
            spiceLevel: true,
          },
        },
      },
    })

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('API_MEAL_LOG_PATCH_ERROR:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// ─── DELETE — Soft Delete Meal Log ──────────────────────────────────────────
export async function DELETE(request, { params }) {
  try {
    const { session, error: authError } = await requireSession()
    if (authError) return authError

    // Validate param
    const { id } = await params
    const paramResult = mealLogIdParamSchema.safeParse({ id })
    if (!paramResult.success) {
      return NextResponse.json(
        { error: 'Invalid meal log ID format' },
        { status: 400 }
      )
    }

    // Ownership check
    const { error: ownerError } = await validateMealLogOwnership(
      id,
      session.user.id
    )
    if (ownerError) return ownerError

    // Soft delete — set deletedAt timestamp, never hard delete
    await prisma.mealLog.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json(
      { message: 'Meal log deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('API_MEAL_LOG_DELETE_ERROR:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
