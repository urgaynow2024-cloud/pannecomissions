import { PrismaClient } from "@prisma/client";

const prisma = (global as any).prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

(global as any).prisma = prisma;

export default prisma;
