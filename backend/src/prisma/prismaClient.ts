import { PrismaClient } from "@prisma/client";

// Ensure we don’t create multiple instances in development (due to hot reloads)
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // helpful for debugging
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
