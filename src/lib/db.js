import { PrismaClient } from '@prisma/client';

// Prevent multiple Prisma instances in development (hot-reload issue)
const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
