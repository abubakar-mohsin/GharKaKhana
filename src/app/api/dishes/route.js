// src/app/api/dishes/route.js
// ─────────────────────────────────────────────────────────────────────────────
// Public API endpoint — returns a paginated, filtered list of dishes.
// No authentication required — guests can browse the menu.
//
// GET /api/dishes?q=biryani&base=rice&dietary=non_veg&protein=chicken,mutton
//                &spice=hot&time=medium&tags=high_protein&meal=lunch,dinner
//                &region=Punjab&festive=false&cursor=<uuid>&limit=20
//
// FILTER RULES:
//   Across dimensions → AND logic (all must match)
//   Within a dimension → OR logic (any can match, comma-separated)
//
// PAGINATION:
//   Cursor-based using take: limit+1 trick.
//   Returns { data, nextCursor, hasNextPage }
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { dishListQuerySchema } from '@/validators'

// Maps lowercase URL values → Prisma enum values
const BASE_TYPE_MAP = { rice: 'RICE_BASED', roti: 'ROTI_BASED', both: 'BOTH', standalone: 'STANDALONE' }
const DIETARY_MAP   = { veg: 'VEG', non_veg: 'NON_VEG', vegan: 'VEGAN' }
const PROTEIN_MAP   = { chicken: 'CHICKEN', mutton: 'MUTTON', beef: 'BEEF', fish: 'FISH', lentil: 'LENTIL', paneer: 'PANEER', egg: 'EGG' }
const SPICE_MAP     = { mild: 'MILD', medium: 'MEDIUM', hot: 'HOT', extra_hot: 'EXTRA_HOT' }
const MEAL_MAP      = { breakfast: 'BREAKFAST', lunch: 'LUNCH', dinner: 'DINNER', snack: 'SNACK' }

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    // ── Collect raw params ────────────────────────────────────────────────
    const raw = {
      q:        searchParams.get('q')        || undefined,
      base:     searchParams.get('base')     || undefined,
      dietary:  searchParams.get('dietary')  || undefined,
      protein:  searchParams.get('protein')  || undefined,
      spice:    searchParams.get('spice')    || undefined,
      time:     searchParams.get('time')     || undefined,
      tags:     searchParams.get('tags')     || undefined,
      meal:     searchParams.get('meal')     || undefined,
      region:   searchParams.get('region')   || undefined,
      festive:  searchParams.get('festive')  || undefined,
      cursor:   searchParams.get('cursor')   || undefined,
      limit:    searchParams.get('limit')    || undefined,
    }

    // ── Validate with Zod ─────────────────────────────────────────────────
    const result = dishListQuerySchema.safeParse(raw)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { q, base, dietary, protein, spice, time, tags, meal, region, festive, cursor, limit } = result.data

    // ── Build Prisma WHERE ────────────────────────────────────────────────
    const where = { deletedAt: null, AND: [] }

    // Text search — name and description (case insensitive)
    if (q) {
      where.AND.push({
        OR: [
          { name:        { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      })
    }

    // Filter 1: Base type (single value)
    if (base) {
      where.AND.push({ baseType: BASE_TYPE_MAP[base] })
    }

    // Filter 2: Dietary type (single value)
    if (dietary) {
      where.AND.push({ dietaryType: DIETARY_MAP[dietary] })
    }

    // Filter 3: Protein type (OR within dimension)
    if (protein?.length) {
      where.AND.push({ proteinType: { in: protein.map((p) => PROTEIN_MAP[p]) } })
    }

    // Filter 4: Spice level (OR within dimension)
    if (spice?.length) {
      where.AND.push({ spiceLevel: { in: spice.map((s) => SPICE_MAP[s]) } })
    }

    // Filter 5: Time category → maps to prepTimeMinutes ranges
    if (time) {
      if (time === 'quick') {
        where.AND.push({ prepTimeMinutes: { lt: 30 } })
      } else if (time === 'medium') {
        where.AND.push({ prepTimeMinutes: { gte: 30, lte: 60 } })
      } else if (time === 'elaborate') {
        where.AND.push({ prepTimeMinutes: { gt: 60 } })
      }
    }

    // Filter 6: Tags (OR within dimension via relation — some tags.tag IN [...])
    if (tags?.length) {
      where.AND.push({
        tags: { some: { tag: { in: tags, mode: 'insensitive' } } },
      })
    }

    // Filter 7: Meal time (OR within dimension — PostgreSQL array hasSome)
    if (meal?.length) {
      where.AND.push({ mealTimes: { hasSome: meal.map((m) => MEAL_MAP[m]) } })
    }

    // Filter 8: Region (case insensitive contains)
    if (region) {
      where.AND.push({ region: { contains: region, mode: 'insensitive' } })
    }

    // Filter 9: Festive flag
    if (festive !== undefined) {
      where.AND.push({ isFestive: festive })
    }

    // Clean up empty AND array
    if (where.AND.length === 0) delete where.AND

    // ── Cursor-based pagination ───────────────────────────────────────────
    // take: limit+1 trick — fetch one extra to know if there's a next page
    const queryOptions = {
      where,
      orderBy: { name: 'asc' },
      take: limit + 1,
      include: { tags: { select: { tag: true } } },
    }

    if (cursor) {
      queryOptions.cursor = { id: cursor }
      queryOptions.skip = 1 // skip the cursor item itself
    }

    const dishes = await prisma.dish.findMany(queryOptions)

    // ── Determine pagination info ─────────────────────────────────────────
    const hasNextPage = dishes.length > limit
    if (hasNextPage) dishes.pop() // remove the extra item

    const nextCursor = hasNextPage ? dishes[dishes.length - 1].id : null

    return NextResponse.json({
      data: dishes,
      nextCursor,
      hasNextPage,
    })
  } catch (error) {
    console.error('API_DISHES_GET_ERROR:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
