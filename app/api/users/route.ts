import { NextRequest, NextResponse } from "next/server";
import { getUserByWalletAddress, createUser } from "@/lib/actions";

// POST: Create or update a user
export async function POST(request: NextRequest) {
    try {
        const { walletAddress, credits } = await request.json();

        if (!walletAddress) {
            return NextResponse.json(
                { error: "Wallet address is required" },
                { status: 400 }
            );
        }

        console.log(
            "Creating/updating user with wallet address:",
            walletAddress
        );

        // Normalize wallet address to lowercase
        const normalizedAddress = walletAddress.toLowerCase();

        // Check if user already exists
        let user = await getUserByWalletAddress(normalizedAddress);

        if (!user) {
            console.log(
                "Creating new user with wallet address:",
                normalizedAddress
            );
            // Create new user with default 5 credits or specified credits
            user = await createUser(
                normalizedAddress,
                credits !== undefined ? credits : 5
            );
        }

        console.log("User created/updated:", user);
        return NextResponse.json(user);
    } catch (error) {
        console.error("Error creating/updating user:", error);
        return NextResponse.json(
            { error: "Failed to create/update user" },
            { status: 500 }
        );
    }
}

// GET: Get user by wallet address
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

        console.log("Fetching user with wallet address:", walletAddress);

        // Normalize wallet address to lowercase
        const normalizedAddress = walletAddress.toLowerCase();

        const user = await getUserByWalletAddress(normalizedAddress);

        if (!user) {
            console.log(
                "User not found for wallet address:",
                normalizedAddress
            );
            return NextResponse.json({ error: "User not found" });
        }

        console.log("User found:", user);
        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}

// PATCH: Update user credits
export async function PATCH(request: NextRequest) {
    try {
        const { walletAddress, credits } = await request.json();

        if (!walletAddress || credits === undefined) {
            return NextResponse.json(
                { error: "Wallet address and credits are required" },
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

        const updatedUser = await getUserByWalletAddress(normalizedAddress);

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user credits:", error);
        return NextResponse.json(
            { error: "Failed to update user credits" },
            { status: 500 }
        );
    }
}
