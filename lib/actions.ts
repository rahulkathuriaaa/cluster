/**
 * This file contains server-side actions for database operations
 */

import prisma from "./prisma";
import type { Message } from "ai";

export type WalletAddress = string;

// User operations
export async function getUserByWalletAddress(walletAddress: WalletAddress) {
    try {
        const normalizedAddress = walletAddress.toLowerCase();

        return await prisma.user.findUnique({
            where: { walletAddress: normalizedAddress },
        });
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
}

export async function createUser(
    walletAddress: WalletAddress,
    credits: number = 5
) {
    try {
        const normalizedAddress = walletAddress.toLowerCase();

        return await prisma.user.create({
            data: {
                walletAddress: normalizedAddress,
                credits,
            },
        });
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

export async function updateUserCredits(
    walletAddress: WalletAddress,
    operation: "add" | "remove",
    amount: number
) {
    try {
        const normalizedAddress = walletAddress.toLowerCase();
        const user = await prisma.user.findUnique({
            where: { walletAddress: normalizedAddress },
        });

        if (!user) {
            throw new Error("User not found");
        }

        let newCredits = user.credits;
        if (operation === "add") {
            newCredits += amount;
        } else {
            newCredits = Math.max(0, newCredits - amount);
        }

        return await prisma.user.update({
            where: { walletAddress: normalizedAddress },
            data: {
                credits: newCredits,
                lastActive: new Date(),
            },
        });
    } catch (error) {
        console.error("Error updating user credits:", error);
        throw error;
    }
}

// Vault operations
export async function getVaultById(id: string) {
    try {
        return await prisma.vault.findUnique({
            where: { id },
        });
    } catch (error) {
        console.error("Error getting vault:", error);
        throw error;
    }
}

export async function getDefaultVault() {
    try {
        const vaults = await prisma.vault.findMany({
            orderBy: { createdAt: "desc" },
            take: 1,
        });

        return vaults[0] || null;
    } catch (error) {
        console.error("Error getting default vault:", error);
        throw error;
    }
}

export async function createVault(
    name: string,
    totalPrize: number,
    availablePrize: number,
    vaultSponsor: string,
    sponsorLinks: string[] = []
) {
    try {
        return await prisma.vault.create({
            data: {
                name,
                totalPrize,
                availablePrize,
                vaultSponsor,
                sponsorLinks,
            },
        });
    } catch (error) {
        console.error("Error creating vault:", error);
        throw error;
    }
}

// Transaction operations
export async function createTransaction(
    walletAddress: WalletAddress,
    vaultId: string,
    amount: number
) {
    try {
        const normalizedAddress = walletAddress.toLowerCase();
        const user = await getUserByWalletAddress(normalizedAddress);

        if (!user) {
            throw new Error("User not found");
        }

        const vault = await getVaultById(vaultId);
        if (!vault) {
            throw new Error("Vault not found");
        }

        const transaction = await prisma.transaction.create({
            data: {
                userId: user.id,
                vaultId,
                amount,
            },
        });

        // Add credits if this is a purchase (0.5 APT = 1 credit)
        if (amount > 0) {
            const creditsToAdd = amount === 0.5 ? 1 : Math.floor(amount / 0.5);
            await updateUserCredits(normalizedAddress, "add", creditsToAdd);

            // Get the updated user
            const updatedUser = await getUserByWalletAddress(normalizedAddress);

            return {
                transaction,
                user: updatedUser,
                creditsAdded: creditsToAdd,
            };
        }

        return { transaction };
    } catch (error) {
        console.error("Error creating transaction:", error);
        throw error;
    }
}

// Conversation operations
export async function saveConversation(
    walletAddress: WalletAddress,
    vaultId: string,
    messages: Message[]
) {
    try {
        const normalizedAddress = walletAddress.toLowerCase();
        const user = await getUserByWalletAddress(normalizedAddress);

        if (!user) {
            throw new Error("User not found");
        }

        const vault = await getVaultById(vaultId);
        if (!vault) {
            throw new Error("Vault not found");
        }

        // Find existing conversation
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                userId: user.id,
                vaultId,
            },
        });

        // Convert messages to JSON compatible format
        const messagesJson = JSON.parse(JSON.stringify(messages));

        if (existingConversation) {
            // Update existing conversation
            return await prisma.conversation.update({
                where: { id: existingConversation.id },
                data: {
                    messages: messagesJson as any,
                    updatedAt: new Date(),
                },
            });
        } else {
            // Create new conversation
            return await prisma.conversation.create({
                data: {
                    userId: user.id,
                    vaultId,
                    messages: messagesJson as any,
                },
            });
        }
    } catch (error) {
        console.error("Error saving conversation:", error);
        throw error;
    }
}

export async function getConversation(
    walletAddress: WalletAddress,
    vaultId: string
) {
    try {
        const normalizedAddress = walletAddress.toLowerCase();
        const user = await getUserByWalletAddress(normalizedAddress);

        if (!user) {
            return null;
        }

        return await prisma.conversation.findFirst({
            where: {
                userId: user.id,
                vaultId,
            },
        });
    } catch (error) {
        console.error("Error getting conversation:", error);
        throw error;
    }
}
