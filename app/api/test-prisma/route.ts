import { NextResponse } from "next/server";
import { PrismaClient } from "../../../lib/generated/prisma";

// Create a direct instance for testing
const testPrisma = new PrismaClient();

export async function GET() {
    try {
        // Just test if we can create a new instance
        return NextResponse.json({
            status: "Prisma client initialized successfully",
        });
    } catch (error) {
        console.error("Prisma client error:", error);
        return NextResponse.json(
            { error: "Failed to initialize Prisma client" },
            { status: 500 }
        );
    }
}
