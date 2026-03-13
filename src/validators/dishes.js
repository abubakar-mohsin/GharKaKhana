// src/validators/dishes.js
// ─────────────────────────────────────────────────────────────────────────────
// Zod validation schemas for dish API query parameters.
// Used in: src/app/api/dishes/route.js (GET — filtered dish list)
//          src/app/api/dishes/[id]/route.js (GET — single dish)
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod'

// Helper: splits a comma-separated string into an array of trimmed values
const csvToArray = (val) => val.split(',').map((v) => v.trim()).filter(Boolean)

// ─── Dish List Query Schema ─────────────────────────────────────────────────
// Validates and transforms all 9 filter dimensions + search + pagination
export const dishListQuerySchema = z.object({
  // Text search
  q: z.string().max(200).optional(),

  // Filter 1: Base type
  base: z
    .enum(['rice', 'roti', 'both', 'standalone'])
    .optional(),

  // Filter 2: Dietary type
  dietary: z
    .enum(['veg', 'non_veg', 'vegan'])
    .optional(),

  // Filter 3: Protein type (comma-separated OR)
  protein: z
    .string()
    .optional()
    .transform((val) => (val ? csvToArray(val) : undefined))
    .pipe(
      z.array(z.enum(['chicken', 'mutton', 'beef', 'fish', 'lentil', 'paneer', 'egg'])).optional()
    ),

  // Filter 4: Spice level (comma-separated OR)
  spice: z
    .string()
    .optional()
    .transform((val) => (val ? csvToArray(val) : undefined))
    .pipe(
      z.array(z.enum(['mild', 'medium', 'hot', 'extra_hot'])).optional()
    ),

  // Filter 5: Time category
  time: z
    .enum(['quick', 'medium', 'elaborate'])
    .optional(),

  // Filter 6: Tags (comma-separated OR via dish_tags relation)
  tags: z
    .string()
    .optional()
    .transform((val) => (val ? csvToArray(val) : undefined))
    .pipe(z.array(z.string().min(1)).optional()),

  // Filter 7: Meal time (comma-separated OR, hasSome on MealTime[] array)
  meal: z
    .string()
    .optional()
    .transform((val) => (val ? csvToArray(val) : undefined))
    .pipe(
      z.array(z.enum(['breakfast', 'lunch', 'dinner', 'snack'])).optional()
    ),

  // Filter 8: Region (free text, case insensitive)
  region: z.string().max(100).optional(),

  // Filter 9: Festive flag
  festive: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),

  // Pagination
  cursor: z.string().uuid().optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().min(1).max(100)),
})

// ─── Single Dish Param Schema ───────────────────────────────────────────────
export const dishIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid dish ID format' }),
})
