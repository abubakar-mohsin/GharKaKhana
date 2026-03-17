// src/app/api/meal-logs/route.js
// ─────────────────────────────────────────────────────────────────────────────
// Authenticated API endpoints for meal logging.
//
// POST /api/meal-logs          — log a new meal (personal)
// GET  /api/meal-logs?range=   — list the current user's meal logs
//
// Auth: all requests require a valid session.
//       userId is ALWAYS taken from session — never from request body.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireSession } from '@/lib/auth-helpers'
import { createMealLogSchema, mealLogListQuerySchema } from '@/validators'

// ─── POST — Create Meal Log ─────────────────────────────────────────────────
export async function POST(request) {
  try {
    // 1. Auth check — userId comes from session, never from body
    const { session, error: authError } = await requireSession()
    if (authError) return authError

    const userId = session.user.id

    // 2. Parse & validate body
    const body = await request.json()
    const result = createMealLogSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { dishId, customMealName, logDate, mealTime, servings, notes } = result.data

    // 3. If dishId is provided, verify the dish exists
    if (dishId) {
      const dish = await prisma.dish.findUnique({
        where: { id: dishId },
        select: { id: true, deletedAt: true },
      })

      if (!dish || dish.deletedAt) {
        return NextResponse.json(
          { error: 'Dish not found or has been removed' },
          { status: 404 }
        )
      }
    }

    // 4. Create the meal log
    const mealLog = await prisma.mealLog.create({
      data: {
        userId,
        dishId: dishId || null,
        customMealName: customMealName || null,
        logDate: new Date(logDate),
        mealTime,
        servings,
        notes: notes || null,
        source: 'PERSONAL',
      },
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

    return NextResponse.json({ data: mealLog }, { status: 201 })
  } catch (error) {
    console.error('API_MEAL_LOGS_POST_ERROR:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// ─── GET — List User's Meal Logs ────────────────────────────────────────────
export async function GET(request) {
  try {
    // 1. Auth check
    const { session, error: authError } = await requireSession()
    if (authError) return authError

    const userId = session.user.id

    // 2. Parse & validate query params
    const { searchParams } = new URL(request.url)
    const raw = {
      range: searchParams.get('range') || undefined,
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.get('limit') || undefined,
    }

    const result = mealLogListQuerySchema.safeParse(raw)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { range, cursor, limit } = result.data

    // 3. Calculate date range
    const now = new Date()
    const startDate = new Date(now)
    if (range === 'week') {
      startDate.setDate(now.getDate() - 7)
    } else {
      startDate.setDate(now.getDate() - 30)
    }

    // 4. Build query — only this user's logs, exclude deleted, newest first
    const where = {
      userId,
      deletedAt: null,
      logDate: { gte: startDate },
    }

    const queryOptions = {
      where,
      orderBy: { logDate: 'desc' },
      take: limit + 1,
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
    }

    if (cursor) {
      queryOptions.cursor = { id: cursor }
      queryOptions.skip = 1
    }

    const logs = await prisma.mealLog.findMany(queryOptions)

    // 5. Cursor-based pagination
    const hasNextPage = logs.length > limit
    if (hasNextPage) logs.pop()

    const nextCursor = hasNextPage ? logs[logs.length - 1].id : null

    return NextResponse.json({
      data: logs,
      nextCursor,
      hasNextPage,
    })
  } catch (error) {
    console.error('API_MEAL_LOGS_GET_ERROR:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
