// src/app/api/dishes/[id]/route.js
// ─────────────────────────────────────────────────────────────────────────────
// Public API endpoint — returns a single dish by UUID with full details.
// No authentication required — guests can view dish details.
//
// GET /api/dishes/:id
//
// Includes relations: tags, nutrition, recipe
// Returns 404 if not found or soft-deleted. Returns 400 if invalid UUID.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { dishIdParamSchema } from '@/validators'

export async function GET(_request, { params }) {
  try {
    // ── Validate UUID param ─────────────────────────────────────────────
    const result = dishIdParamSchema.safeParse(await params)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid dish ID format', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { id } = result.data

    // ── Fetch dish with all relations ───────────────────────────────────
    const dish = await prisma.dish.findFirst({
      where: { id, deletedAt: null },
      include: {
        tags:      { select: { id: true, tag: true } },
        nutrition: true,
        recipe:    true,
      },
    })

    if (!dish) {
      return NextResponse.json(
        { error: 'Dish not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(dish)
  } catch (error) {
    console.error('API_DISH_GET_BY_ID_ERROR:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
