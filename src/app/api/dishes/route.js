// src/app/api/dishes/route.js
// ─────────────────────────────────────────────────────────────────────────────
// Public API endpoint — returns filtered dishes from the catalog.
// No authentication required — guests can browse dishes.
//
// GET /api/dishes?q=&baseType=ALL&dietaryType=ALL&spiceLevel=ALL&isQuick=false&isHealthy=false
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)

    const search     = searchParams.get('q') || ''
    const baseType   = searchParams.get('baseType')
    const dietaryType = searchParams.get('dietaryType')
    const spiceLevel = searchParams.get('spiceLevel')
    const isHealthy  = searchParams.get('isHealthy') === 'true'
    const isQuick    = searchParams.get('isQuick') === 'true'

    const where = {
      deletedAt: null,
      AND: [],
    }

    if (search) {
      where.AND.push({
        OR: [
          { name:        { contains: search, mode: 'insensitive' } },
          { nameUrdu:    { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      })
    }

    if (baseType && baseType !== 'ALL')         where.AND.push({ baseType })
    if (dietaryType && dietaryType !== 'ALL')   where.AND.push({ dietaryType })
    if (spiceLevel && spiceLevel !== 'ALL')     where.AND.push({ spiceLevel })
    if (isHealthy)                              where.AND.push({ isHealthy: true })
    if (isQuick)                                where.AND.push({ isQuick: true })

    if (where.AND.length === 0) delete where.AND

    const dishes = await prisma.dish.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(dishes)

  } catch (error) {
    console.error('API_DISHES_GET_ERROR:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}