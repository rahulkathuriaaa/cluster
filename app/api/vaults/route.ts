import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: Create a new vault
export async function POST(request: NextRequest) {
    try {
        const { name, totalPrize, availablePrize, vaultSponsor, sponsorLinks } =
            await request.json();

        if (
            !name ||
            totalPrize === undefined ||
            availablePrize === undefined ||
            !vaultSponsor
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const vault = await prisma.vault.create({
            data: {
                name,
                totalPrize,
                availablePrize,
                vaultSponsor,
                sponsorLinks: sponsorLinks || [],
            },
        });

        return NextResponse.json(vault);
    } catch (error) {
        console.error("Error creating vault:", error);
        return NextResponse.json(
            { error: "Failed to create vault" },
            { status: 500 }
        );
    }
}

// GET: Get all vaults or a specific vault by ID
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            // Get a specific vault
            const vault = await prisma.vault.findUnique({
                where: { id },
            });

            if (!vault) {
                return NextResponse.json(
                    { error: "Vault not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(vault);
        } else {
            // Get all vaults
            const vaults = await prisma.vault.findMany({
                orderBy: {
                    createdAt: "desc",
                },
            });

            return NextResponse.json(vaults);
        }
    } catch (error) {
        console.error("Error fetching vaults:", error);
        return NextResponse.json(
            { error: "Failed to fetch vaults" },
            { status: 500 }
        );
    }
}

// PATCH: Update a vault
export async function PATCH(request: NextRequest) {
    try {
        const { id, availablePrize, sponsorLinks } = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: "Vault ID is required" },
                { status: 400 }
            );
        }

        const vault = await prisma.vault.findUnique({
            where: { id },
        });

        if (!vault) {
            return NextResponse.json(
                { error: "Vault not found" },
                { status: 404 }
            );
        }

        const updatedVault = await prisma.vault.update({
            where: { id },
            data: {
                ...(availablePrize !== undefined && { availablePrize }),
                ...(sponsorLinks && { sponsorLinks }),
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(updatedVault);
    } catch (error) {
        console.error("Error updating vault:", error);
        return NextResponse.json(
            { error: "Failed to update vault" },
            { status: 500 }
        );
    }
}
