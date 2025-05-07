import { NextRequest, NextResponse } from "next/server";
import { getConversation, saveConversation } from "@/lib/actions";

// POST: Save a new conversation or update an existing one
export async function POST(request: NextRequest) {
    try {
        const { walletAddress, vaultId, messages } = await request.json();

        if (!walletAddress || !vaultId || !messages) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Save conversation
        const conversation = await saveConversation(
            walletAddress,
            vaultId,
            messages
        );

        return NextResponse.json(conversation);
    } catch (error) {
        console.error("Error saving conversation:", error);
        return NextResponse.json(
            { error: "Failed to save conversation" },
            { status: 500 }
        );
    }
}

// GET: Retrieve a conversation by walletAddress and vaultId
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const walletAddress = searchParams.get("walletAddress");
        const vaultId = searchParams.get("vaultId");

        if (!walletAddress || !vaultId) {
            return NextResponse.json(
                { error: "Missing walletAddress or vaultId" },
                { status: 400 }
            );
        }

        const conversation = await getConversation(walletAddress, vaultId);

        if (!conversation) {
            return NextResponse.json({ messages: [] });
        }

        return NextResponse.json(conversation);
    } catch (error) {
        console.error("Error retrieving conversation:", error);
        return NextResponse.json(
            { error: "Failed to retrieve conversation" },
            { status: 500 }
        );
    }
}
