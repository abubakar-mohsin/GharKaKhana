// src/validators/meal-logs.js
// ─────────────────────────────────────────────────────────────────────────────
// Zod validation schemas for meal log API endpoints.
// Used in: src/app/api/meal-logs/route.js         (POST — create, GET — list)
//          src/app/api/meal-logs/[id]/route.js     (GET, PATCH, DELETE)
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod'

// ─── Create Meal Log Schema ─────────────────────────────────────────────────
// POST /api/meal-logs
// Business rule: exactly one of dishId or customMealName must be provided
export const createMealLogSchema = z
  .object({
    dishId: z
      .string()
      .uuid({ message: 'Invalid dish ID format' })
      .nullish(),

    customMealName: z
      .string()
      .trim()
      .min(1, 'Custom meal name cannot be empty')
      .max(200, 'Custom meal name too long')
      .nullish(),

    logDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'logDate must be YYYY-MM-DD format'),

    mealTime: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'], {
      message: 'mealTime must be BREAKFAST, LUNCH, DINNER, or SNACK',
    }),

    servings: z
      .number()
      .min(0.25, 'Servings must be at least 0.25')
      .max(10, 'Servings cannot exceed 10')
      .default(1.0),

    notes: z
      .string()
      .trim()
      .max(500, 'Notes cannot exceed 500 characters')
      .nullish(),
  })
  .refine(
    (data) => data.dishId || data.customMealName,
    { message: 'Either dishId or customMealName must be provided', path: ['dishId'] }
  )
  .refine(
    (data) => !(data.dishId && data.customMealName),
    { message: 'Cannot provide both dishId and customMealName', path: ['customMealName'] }
  )

// ─── Update Meal Log Schema ────────────────────────────────────────────────
// PATCH /api/meal-logs/:id
// Only servings and notes can be edited (no meal swapping)
export const updateMealLogSchema = z
  .object({
    servings: z
      .number()
      .min(0.25, 'Servings must be at least 0.25')
      .max(10, 'Servings cannot exceed 10')
      .optional(),

    notes: z
      .string()
      .trim()
      .max(500, 'Notes cannot exceed 500 characters')
      .nullish(),
  })
  .refine(
    (data) => data.servings !== undefined || data.notes !== undefined,
    { message: 'At least one field (servings or notes) must be provided' }
  )

// ─── Meal Log ID Param Schema ──────────────────────────────────────────────
// Used to validate :id param in /api/meal-logs/[id]
export const mealLogIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid meal log ID format' }),
})

// ─── Meal Log List Query Schema ─────────────────────────────────────────────
// GET /api/meal-logs?range=week|month&cursor=<uuid>&limit=20
export const mealLogListQuerySchema = z.object({
  range: z
    .enum(['week', 'month'], { message: 'range must be "week" or "month"' })
    .default('week'),

  cursor: z.string().uuid().optional(),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().min(1).max(100)),
})
