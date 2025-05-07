import { NextRequest, NextResponse } from "next/server";
import { createTransaction, getUserByWalletAddress } from "@/lib/actions";
import prisma from "@/lib/prisma";

// POST: Create a new transaction
export async function POST(request: NextRequest) {
    try {
        const { walletAddress, vaultId, amount } = await request.json();

        if (!walletAddress || !vaultId || amount === undefined) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Normalize wallet address to lowercase
        const normalizedAddress = walletAddress.toLowerCase();

        // Create transaction and update credits if needed
        const result = await createTransaction(
            normalizedAddress,
            vaultId,
            amount
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error creating transaction:", error);
        return NextResponse.json(
            { error: "Failed to create transaction" },
            { status: 500 }
        );
    }
}

// GET: Get transactions for a user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const walletAddress = searchParams.get("walletAddress");
        const vaultId = searchParams.get("vaultId");

        if (!walletAddress) {
            return NextResponse.json(
                { error: "Wallet address is required" },
                { status: 400 }
            );
        }

        // Normalize wallet address to lowercase
        const normalizedAddress = walletAddress.toLowerCase();

        // Find user
        const user = await getUserByWalletAddress(normalizedAddress);

        if (!user) {
            return NextResponse.json({ transactions: [] });
        }

        const whereClause: any = { userId: user.id };

        if (vaultId) {
            whereClause.vaultId = vaultId;
        }

        const transactions = await prisma.transaction.findMany({
            where: whereClause,
            orderBy: {
                timestamp: "desc",
            },
            include: {
                vault: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json({ transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}
