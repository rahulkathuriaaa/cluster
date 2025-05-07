import { NextRequest, NextResponse } from "next/server";
import { getUserByWalletAddress, updateUserCredits } from "@/lib/actions";

// GET: Get user credits by wallet address
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const walletAddress = searchParams.get("walletAddress");

        if (!walletAddress) {
            return NextResponse.json(
                { error: "Wallet address is required" },
                { status: 400 }
            );
        }

        // Normalize wallet address to lowercase
        const normalizedAddress = walletAddress.toLowerCase();

        const user = await getUserByWalletAddress(normalizedAddress);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ credits: user.credits });
    } catch (error) {
        console.error("Error fetching user credits:", error);
        return NextResponse.json(
            { error: "Failed to fetch user credits" },
            { status: 500 }
        );
    }
}

// POST: Add or remove credits
export async function POST(request: NextRequest) {
    try {
        const {
            walletAddress,
            amount,
            operation = "add",
        } = await request.json();

        if (!walletAddress || amount === undefined) {
            return NextResponse.json(
                { error: "Wallet address and amount are required" },
                { status: 400 }
            );
        }

        if (operation !== "add" && operation !== "remove") {
            return NextResponse.json(
                { error: "Operation must be 'add' or 'remove'" },
                { status: 400 }
            );
        }

        // Normalize wallet address to lowercase
        const normalizedAddress = walletAddress.toLowerCase();

        // Find user
        const user = await getUserByWalletAddress(normalizedAddress);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Update user credits
        const updatedUser = await updateUserCredits(
            normalizedAddress,
            operation,
            amount
        );

        return NextResponse.json({
            previousCredits: user.credits,
            currentCredits: updatedUser.credits,
            operation,
            amount,
        });
    } catch (error) {
        console.error("Error updating user credits:", error);
        return NextResponse.json(
            { error: "Failed to update user credits" },
            { status: 500 }
        );
    }
}
