import { PrismaClient } from "../lib/generated/prisma";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting database connections during hot reloads
declare global {
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
