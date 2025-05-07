"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWallet, WalletReadyState } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useChat } from "ai/react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Orbitron, VT323 } from "next/font/google";
import "./styles.css"; // Import custom styles for scrollbar
import "./panel-styles.css"; // Import panel styles with angled corners

// Font setup
const orbitron = Orbitron({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

const vt323 = VT323({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
});

// This function adds a class to the body to prevent layout shift when scrollbars appear
const usePreventLayoutShift = () => {
    useEffect(() => {
        // Add class to html that sets a consistent scrollbar width
        document.documentElement.classList.add("scrollbar-stable");

        // Clean up on unmount
        return () => {
            document.documentElement.classList.remove("scrollbar-stable");
        };
    }, []);
};

// Custom component to show wallet balance in the UI style
const CustomWalletInfo = () => {
    const { account, connected, wallet, network } = useWallet();
    const [balance, setBalance] = useState<string>("0");

    useEffect(() => {
        if (connected && account?.address) {
            console.log(
                "Wallet connected in CustomWalletInfo:",
                account.address
            );
            // Fetch balance from Aptos network
            fetch(
                `https://fullnode.testnet.aptoslabs.com/v1/accounts/${account.address}/resources`
            )
                .then((response) => response.json())
                .then((resources) => {
                    const coinResource = resources.find(
                        (r: any) =>
                            r.type ===
                            "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
                    );
                    if (coinResource) {
                        const rawBalance = coinResource.data.coin.value;
                        // Convert from octas (10^8) to APT
                        const formattedBalance = (
                            parseInt(rawBalance) / 100000000
                        ).toFixed(4);
                        setBalance(formattedBalance);
                        console.log("Wallet balance:", formattedBalance, "APT");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching balance:", error);
                });
        } else {
            setBalance("0");
            console.log("Wallet not connected in CustomWalletInfo");
        }
    }, [account, connected]);

    if (!connected) {
        return (
            <div className="mb-4">
                <WalletSelector />
            </div>
        );
    }

    return (
        <div className="mb-4">
            <div className="tech-panel p-3 mb-2">
                <div className="corner-tr"></div>
                <div className="corner-bl"></div>
                <div className="corner-br"></div>
                <div className="extended-corner-tl"></div>

                <div className="text-sm text-[#FFD700] font-semibold">
                    WALLET BALANCE:
                </div>
                <div className="text-2xl font-bold text-white">
                    {balance} APT
                </div>
                <div className="text-xs text-gray-400 truncate">
                    {account?.address?.slice(0, 6)}...
                    {account?.address?.slice(-4)}
                </div>
            </div>
            <WalletSelector />
        </div>
    );
};

// Typing indicator component
const TypingIndicator = () => {
    return (
        <div className="assistant-message flex items-center">
            <div className="flex space-x-1">
                <div
                    className="h-2 w-2 bg-[#FFD700] rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                ></div>
                <div
                    className="h-2 w-2 bg-[#FFD700] rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                ></div>
                <div
                    className="h-2 w-2 bg-[#FFD700] rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                ></div>
            </div>
            <span className="ml-2 text-sm text-gray-300">
                ZURA is thinking...
            </span>
        </div>
    );
};

// Define types for messages
type MessageType = {
    type: "user" | "bot";
    text: string;
};

// Define the expected message format from useChat
interface Message {
    id: string;
    role: "user" | "assistant" | "system" | "function" | "data" | "tool";
    content: string;
    createdAt?: Date;
}

export default function ZuraVaultInterface() {
    const { account, connected, signAndSubmitTransaction, wallet, wallets } =
        useWallet();

    // Use our custom hook to prevent layout shift
    usePreventLayoutShift();

    const router = useRouter();
    const [credits, setCredits] = useState(0);
    const [isBuying, setIsBuying] = useState(false);
    const [buyAmount, setBuyAmount] = useState(1);
    const [isSendingAPT, setIsSendingAPT] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [userId, setUserId] = useState("");
    const [vaultId, setVaultId] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [walletAddress, setWalletAddress] = useState("");

    // Ref for the messages container to enable auto-scrolling
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Configure the chat hook from AI library
    const {
        messages,
        input,
        setInput,
        handleInputChange,
        handleSubmit: aiHandleSubmit,
        isLoading: isChatLoading,
        setMessages,
    } = useChat({
        api: "/api/hello",
        onError: (error: any) => {
            console.error("Chat API error:", error);
        },
        onFinish: () => {
            // Save messages to database when response is complete
            if (walletAddress && vaultId) {
                saveConversation(messages);
            }
        },
        streamMode: "text",
    });

    // Function to scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Auto-scroll when conversation updates
    useEffect(() => {
        scrollToBottom();
    }, [messages, isChatLoading]);

    // Save conversation to database
    const saveConversation = async (messagesData: Message[]) => {
        try {
            if (!walletAddress || !vaultId) {
                console.error(
                    "Missing walletAddress or vaultId for conversation"
                );
                return;
            }

            console.log("Saving conversation for wallet:", walletAddress);

            await fetch("/api/conversations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress,
                    vaultId,
                    messages: messagesData,
                }),
            });
        } catch (error: any) {
            console.error("Error saving conversation:", error);
        }
    };

    // Fetch or create user when wallet is connected
    useEffect(() => {
        const fetchOrCreateUser = async () => {
            if (connected && account?.address) {
                try {
                    // Set wallet address for future API calls
                    setWalletAddress(account.address);
                    console.log("Wallet connected:", account.address);

                    // Try to get existing user
                    const response = await fetch(
                        `/api/users?walletAddress=${account.address}`
                    );

                    const userData = await response.json();

                    if (userData.error) {
                        console.log("User not found, creating new user");
                        // User doesn't exist, create a new one
                        const createResponse = await fetch("/api/users", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                walletAddress: account.address,
                            }),
                        });

                        if (createResponse.ok) {
                            const newUser = await createResponse.json();
                            setUserId(newUser.id);
                            setCredits(newUser.credits);
                            console.log("New user created:", newUser);
                        }
                    } else {
                        // User exists
                        setUserId(userData.id);
                        setCredits(userData.credits);
                        console.log("Existing user found:", userData);
                    }
                } catch (error) {
                    console.error("Error fetching/creating user:", error);
                }
            }
        };

        fetchOrCreateUser();
    }, [connected, account]);

    // Get or create default vault
    useEffect(() => {
        const getOrCreateVault = async () => {
            try {
                // Try to get existing vaults
                const response = await fetch("/api/vaults");

                if (response.ok) {
                    const vaults = await response.json();
                    if (vaults.length > 0) {
                        setVaultId(vaults[0].id);
                        console.log("Using existing vault:", vaults[0]);
                    } else {
                        // Create a default vault
                        const createResponse = await fetch("/api/vaults", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                name: "ZURA Vault",
                                totalPrize: 1000,
                                availablePrize: 1000,
                                vaultSponsor: "Cluster",
                                sponsorLinks: ["https://cluster.app"],
                            }),
                        });

                        if (createResponse.ok) {
                            const newVault = await createResponse.json();
                            setVaultId(newVault.id);
                            console.log("Created new vault:", newVault);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching/creating vault:", error);
            }
        };

        getOrCreateVault();
    }, []);

    // Load conversation when walletAddress and vaultId are available
    useEffect(() => {
        const loadConversation = async () => {
            if (walletAddress && vaultId) {
                try {
                    console.log(
                        "Loading conversation for wallet:",
                        walletAddress
                    );
                    const response = await fetch(
                        `/api/conversations?walletAddress=${walletAddress}&vaultId=${vaultId}`
                    );

                    if (response.ok) {
                        const data = await response.json();
                        if (data.messages && data.messages.length > 0) {
                            console.log(
                                "Loaded existing conversation:",
                                data.messages.length,
                                "messages"
                            );
                            setMessages(data.messages);
                        } else {
                            // Add initial messages if no conversation exists
                            console.log(
                                "No existing conversation, creating initial messages"
                            );
                            setMessages([
                                {
                                    id: "1",
                                    role: "assistant",
                                    content: "Hello!",
                                },
                                {
                                    id: "2",
                                    role: "assistant",
                                    content:
                                        "Greetings, participant. How can I assist?",
                                },
                            ]);
                        }
                    }
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error loading conversation:", error);
                    setIsLoading(false);
                }
            }
        };

        loadConversation();
    }, [walletAddress, vaultId, setMessages]);

    // Check if user completed tasks
    useEffect(() => {
        // Check if user has completed all tasks
        const creditsAwarded = localStorage.getItem("credits_awarded");

        if (!creditsAwarded) {
            // Redirect back to tasks page if tasks not completed
            console.log("Tasks not completed, redirecting back");
            router.push("/vault/play");
        }
    }, [router]);

    // Custom handle submit to manage credits and handling
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !input.trim() ||
            credits < 1 ||
            !connected ||
            isChatLoading ||
            !walletAddress
        )
            return;

        // Reduce credits
        const newCredits = credits - 1;
        setCredits(newCredits);

        // Update user credits in database
        try {
            const response = await fetch("/api/users/credits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress,
                    amount: 1,
                    operation: "remove",
                }),
            });

            if (response.ok) {
                console.log("Credits updated successfully");
            }
        } catch (error) {
            console.error("Error updating credits:", error);
        }

        // Let the AI library handle the API communication
        aiHandleSubmit(e);
    };

    const sendDonation = async () => {
        if (!connected || !account?.address) return;

        setIsSendingAPT(true);

        try {
            // Hardcoded wallet address and amount
            const recipientAddress =
                "0xbb629c088b696f8c3500d0133692a1ad98a90baef9d957056ec4067523181e9a";
            const amount = 0.5; // 0.5 APT

            // Using type assertion to bypass type checking
            const transaction = {
                data: {
                    function: "0x1::aptos_account::transfer",
                    typeArguments: [],
                    functionArguments: [
                        recipientAddress,
                        (amount * 100000000).toString(), // convert to octas (APT * 10^8)
                    ],
                },
            } as any; // Type assertion to bypass type checking

            const response = await signAndSubmitTransaction(transaction);

            // Wait for transaction to confirm
            await fetch(
                `https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/${response.hash}`,
                {
                    method: "GET",
                }
            );

            // Record transaction and update credits
            try {
                // Record transaction
                const txResponse = await fetch("/api/transactions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        walletAddress,
                        vaultId,
                        amount: 0.5,
                    }),
                });

                if (txResponse.ok) {
                    const txData = await txResponse.json();
                    // Use credits from response
                    if (txData.user && txData.user.credits !== undefined) {
                        setCredits(txData.user.credits);
                    } else {
                        // Fallback - add 1 credit
                        setCredits((prev) => prev + 1);
                    }
                    console.log("Transaction recorded successfully:", txData);
                }
            } catch (error) {
                console.error("Error recording transaction:", error);
                // Fallback - add 1 credit
                setCredits((prev) => prev + 1);
            }

            // Confirm purchase in conversation
            const purchaseConfirmation: Message = {
                id: Date.now().toString(),
                role: "assistant",
                content: `Thank you for your purchase! 1 credit added to your balance.`,
            };

            const updatedMessages: Message[] = [
                ...messages,
                purchaseConfirmation,
            ];
            setMessages(updatedMessages);

            // Save updated conversation
            saveConversation(updatedMessages);
        } catch (error) {
            console.error("Transaction failed:", error);
            setMessages([
                ...messages,
                {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: "Transaction failed. Please try again later.",
                },
            ]);
        } finally {
            setIsSendingAPT(false);
        }
    };

    // Add a helper function to determine input placeholder text
    const getPlaceholderText = () => {
        if (!connected) {
            return "Connect wallet to send messages...";
        } else if (credits < 1) {
            return "Out of credits!";
        } else {
            return "Type your prompt to ZURA...";
        }
    };

    // Rules modal content
    const rulesContent = (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="tech-panel max-w-md w-full mx-4 relative p-0">
                {/* Panel corners */}
                <div className="corner-tr"></div>
                <div className="corner-bl"></div>
                <div className="corner-br"></div>
                <div className="extended-corner-tl"></div>
                <div className="extended-corner-tr"></div>
                <div className="extended-corner-bl"></div>
                <div className="extended-corner-br"></div>
                <div className="extended-corner-lt"></div>
                <div className="extended-corner-rt"></div>
                <div className="extended-corner-lb"></div>
                <div className="extended-corner-rb"></div>

                <button
                    onClick={() => setShowRules(false)}
                    className="absolute top-4 right-4 text-[#FFD700] hover:text-white z-10"
                >
                    ×
                </button>

                <div className="p-6">
                    <div className="panel-header">
                        <h2 className={orbitron.className}>CHALLENGE RULES</h2>
                    </div>

                    <div className="space-y-3 text-white my-6">
                        <p>1. You have 5 credits to use for this challenge.</p>
                        <p>2. Each message sent to ZURA costs 1 credit.</p>
                        <p>
                            3. Your goal is to convince ZURA to unlock the
                            vault.
                        </p>
                        <p>4. You can purchase additional credits if needed.</p>
                        <p>
                            5. The prize pool is 1,000 APT for successful
                            participants.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowRules(false)}
                        className="gold-button w-full mt-4"
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    );

    // Log wallet status on component mount and wallet change
    useEffect(() => {
        console.log("Wallet connection status:", connected);
        console.log(
            "Available wallets:",
            wallets?.map((w) => w.name).join(", ") || "None"
        );
        console.log("Connected wallet:", wallet?.name);
        console.log("Account address:", account?.address);
    }, [connected, account, wallet, wallets]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-2 overflow-hidden relative tech-container">
            {/* Background Grid */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url(/grid-bg.svg)",
                    backgroundSize: "100px 100px",
                    backgroundColor: "#000",
                }}
            ></div>

            {/* Advanced Gaming UI Border - Outer Frame */}
            <div className="absolute inset-4 z-10 pointer-events-none">
                {/* Top angled frame */}
                <div className="absolute top-0 left-[10%] right-[10%] h-[2px] bg-[#333]">
                    <div className="absolute left-[40%] right-[40%] h-full bg-[#FFD700]"></div>
                </div>

                {/* Bottom angled frame */}
                <div className="absolute bottom-0 left-[10%] right-[10%] h-[2px] bg-[#333]">
                    <div className="absolute left-[40%] right-[40%] h-full bg-[#FFD700]"></div>
                </div>

                {/* Left side frame */}
                <div className="absolute top-[10%] bottom-[10%] left-0 w-[2px] bg-[#333]">
                    <div className="absolute top-[40%] bottom-[40%] w-full bg-[#FFD700]"></div>
                </div>

                {/* Right side frame */}
                <div className="absolute top-[10%] bottom-[10%] right-0 w-[2px] bg-[#333]">
                    <div className="absolute top-[40%] bottom-[40%] w-full bg-[#FFD700]"></div>
                </div>

                {/* Corner angled cuts - creating hexagonal shape */}
                <div className="absolute top-0 left-0 w-[10%] h-[10%]">
                    <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#333] transform rotate-45 origin-bottom-right"></div>
                </div>
                <div className="absolute top-0 right-0 w-[10%] h-[10%]">
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#333] transform -rotate-45 origin-bottom-left"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-[10%] h-[10%]">
                    <div className="absolute top-0 right-0 w-full h-[2px] bg-[#333] transform -rotate-45 origin-top-right"></div>
                </div>
                <div className="absolute bottom-0 right-0 w-[10%] h-[10%]">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#333] transform rotate-45 origin-top-left"></div>
                </div>

                {/* Inner accent lines */}
                <div className="absolute top-1 left-[15%] right-[15%] h-[1px] bg-[#444]"></div>
                <div className="absolute bottom-1 left-[15%] right-[15%] h-[1px] bg-[#444]"></div>
                <div className="absolute top-[15%] bottom-[15%] left-1 w-[1px] bg-[#444]"></div>
                <div className="absolute top-[15%] bottom-[15%] right-1 w-[1px] bg-[#444]"></div>
            </div>

            {/* Circuit lines */}
            <div className="absolute top-[20%] left-0 right-0 h-[1px] bg-[#333] z-5"></div>
            <div className="absolute top-[40%] left-0 right-0 h-[1px] bg-[#333] z-5"></div>
            <div className="absolute top-[60%] left-0 right-0 h-[1px] bg-[#333] z-5"></div>
            <div className="absolute top-[80%] left-0 right-0 h-[1px] bg-[#333] z-5"></div>

            <div className="absolute top-0 bottom-0 left-[20%] w-[1px] bg-[#333] z-5"></div>
            <div className="absolute top-0 bottom-0 left-[40%] w-[1px] bg-[#333] z-5"></div>
            <div className="absolute top-0 bottom-0 left-[60%] w-[1px] bg-[#333] z-5"></div>
            <div className="absolute top-0 bottom-0 left-[80%] w-[1px] bg-[#333] z-5"></div>

            {/* Header with CLUSTER PROTOCOL */}
            <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center z-20">
                <div className="tech-header w-full flex items-center justify-center">
                    <h1
                        className={`text-[#FFD700] text-2xl font-bold ${orbitron.className}`}
                    >
                        CLUSTER PROTOCOL
                    </h1>
                </div>

                {/* Navigation links */}
                <div className="absolute right-24 flex space-x-8">
                    <span
                        className={`text-[#777] text-xs uppercase ${orbitron.className}`}
                    >
                        DOCS
                    </span>
                    <span
                        className={`text-[#777] text-xs uppercase ${orbitron.className}`}
                    >
                        LEADERBOARD
                    </span>
                    <span
                        className={`text-[#777] text-xs uppercase ${orbitron.className}`}
                    >
                        FAQ
                    </span>
                </div>
            </div>

            {/* Main content container */}
            <div className="w-full max-w-6xl mx-auto z-20 mt-16 mb-8 flex flex-col">
                {/* Main interface */}
                <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-12rem)]">
                    {/* Left Panel - Attempts Left */}
                    <div className="w-full md:w-1/4 tech-panel flex flex-col relative">
                        {/* Panel corners */}
                        <div className="corner-tr"></div>
                        <div className="corner-bl"></div>
                        <div className="corner-br"></div>
                        <div className="extended-corner-tl"></div>
                        <div className="extended-corner-tr"></div>
                        <div className="extended-corner-bl"></div>
                        <div className="extended-corner-br"></div>
                        <div className="extended-corner-lt"></div>
                        <div className="extended-corner-rt"></div>
                        <div className="extended-corner-lb"></div>
                        <div className="extended-corner-rb"></div>

                        {/* Panel header */}
                        <div className="panel-header">
                            <h2 className={orbitron.className}>
                                ATTEMPTS LEFT
                            </h2>
                        </div>

                        <div className="flex flex-col items-center justify-center flex-grow">
                            <div className="large-number">{credits}</div>
                            <div className="text-[#777] text-lg mt-2">
                                USED: {5 - credits}
                            </div>
                        </div>

                        {/* Buy attempt button */}
                        <div className="mt-auto">
                            <div className="buy-attempt-label">
                                <span
                                    className={`text-[#FFD700] text-sm ${orbitron.className}`}
                                >
                                    BUY ATTEMPT
                                </span>
                                <span
                                    className={`text-[#FFD700] text-sm ${orbitron.className}`}
                                >
                                    (0.5 APT)
                                </span>
                            </div>

                            <button
                                onClick={sendDonation}
                                disabled={isSendingAPT || !connected}
                                className={`w-full buy-attempt-button ${
                                    isSendingAPT ? "disabled" : ""
                                }`}
                            >
                                {isSendingAPT ? "PROCESSING..." : "BUY ATTEMPT"}
                            </button>

                            {!connected && (
                                <div className="mt-4">
                                    <CustomWalletInfo />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Center Panel - Chat Interface */}
                    <div className="w-full md:w-2/4 tech-panel flex flex-col relative">
                        {/* Panel corners */}
                        <div className="corner-tr"></div>
                        <div className="corner-bl"></div>
                        <div className="corner-br"></div>
                        <div className="extended-corner-tl"></div>
                        <div className="extended-corner-tr"></div>
                        <div className="extended-corner-bl"></div>
                        <div className="extended-corner-br"></div>
                        <div className="extended-corner-lt"></div>
                        <div className="extended-corner-rt"></div>
                        <div className="extended-corner-lb"></div>
                        <div className="extended-corner-rb"></div>

                        {/* Mascot and chat area */}
                        <div className="flex-grow flex flex-col overflow-hidden relative">
                            {/* Mascot with orbital rings */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                {/* Orbital rings */}
                                <div className="absolute w-64 h-64 rounded-full border border-[#FFD700]/20 animate-orbit"></div>
                                <div className="absolute w-72 h-72 rounded-full border border-[#FFD700]/10 animate-orbit-reverse"></div>

                                {/* Mascot image */}
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-[#FFD700]/5 rounded-full blur-xl"></div>
                                    <Image
                                        src="/mascot.png"
                                        alt="ZURA"
                                        width={150}
                                        height={150}
                                        className="relative z-10"
                                    />
                                </div>
                            </div>

                            {/* Chat messages */}
                            <div className="flex-1 overflow-y-auto scrollbar-custom flex flex-col space-y-3 p-4 z-10 mt-40">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={
                                            msg.role === "user"
                                                ? "user-message"
                                                : "assistant-message"
                                        }
                                    >
                                        {msg.content}
                                    </div>
                                ))}
                                {isChatLoading && <TypingIndicator />}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input area */}
                        <div className="p-4 border-t border-[#333] bg-black">
                            <form onSubmit={handleSubmit} className="flex">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder={getPlaceholderText()}
                                    className="tech-input"
                                    disabled={
                                        credits < 1 ||
                                        !connected ||
                                        isChatLoading
                                    }
                                />
                                <button
                                    type="submit"
                                    disabled={
                                        !input.trim() ||
                                        credits < 1 ||
                                        !connected ||
                                        isChatLoading
                                    }
                                    className={`send-button ${
                                        !input.trim() ||
                                        credits < 1 ||
                                        !connected ||
                                        isChatLoading
                                            ? "disabled"
                                            : ""
                                    }`}
                                >
                                    SEND (-1)
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Panel - Prize Pool */}
                    <div className="w-full md:w-1/4 tech-panel flex flex-col relative">
                        {/* Panel corners */}
                        <div className="corner-tr"></div>
                        <div className="corner-bl"></div>
                        <div className="corner-br"></div>
                        <div className="extended-corner-tl"></div>
                        <div className="extended-corner-tr"></div>
                        <div className="extended-corner-bl"></div>
                        <div className="extended-corner-br"></div>
                        <div className="extended-corner-lt"></div>
                        <div className="extended-corner-rt"></div>
                        <div className="extended-corner-lb"></div>
                        <div className="extended-corner-rb"></div>

                        {/* Panel header */}
                        <div className="panel-header">
                            <h2 className={orbitron.className}>PRIZE POOL</h2>
                        </div>

                        <div className="flex flex-col items-center justify-center flex-grow">
                            <div className="prize-number">1,000</div>
                            <div className="text-[#FFD700] text-3xl font-bold mb-4">
                                APT
                            </div>

                            <div className="status-indicator">
                                <div className="dot active"></div>
                                <span>ACTIVE</span>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="text-center mb-4 text-gray-400">
                                Type your prompt to ZURA...
                            </div>

                            <Link
                                href="/vault/play/how-to/"
                                className="block w-full"
                            >
                                <button className="gold-button w-full">
                                    VIEW RULES
                                </button>
                            </Link>

                            <Link
                                href="/vault/play"
                                className="block w-full mt-4"
                            >
                                <button className="w-full bg-black border border-[#333] text-white p-3 font-bold hover:bg-[#111] transition-colors">
                                    BACK TO TASKS
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Circuit-like decorative elements */}
                <div className="absolute bottom-0 left-0 right-0 h-8 z-10 pointer-events-none">
                    <div className="h-[1px] w-full bg-[#333]"></div>
                    <div className="absolute bottom-0 left-1/4 h-8 w-[1px] bg-[#333]"></div>
                    <div className="absolute bottom-0 left-2/4 h-8 w-[1px] bg-[#333]"></div>
                    <div className="absolute bottom-0 left-3/4 h-8 w-[1px] bg-[#333]"></div>
                </div>

                {/* Scan line effect */}
                <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
                    <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent animate-scan-line"></div>
                </div>

                {/* Glowing circuit nodes */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#FFD700]/20 animate-pulse-slow"></div>
                <div className="absolute top-1/3 left-2/3 w-2 h-2 rounded-full bg-[#FFD700]/20 animate-pulse-slow"></div>
                <div className="absolute top-2/3 left-1/3 w-2 h-2 rounded-full bg-[#FFD700]/20 animate-pulse-slow"></div>
                <div className="absolute top-3/4 left-3/4 w-2 h-2 rounded-full bg-[#FFD700]/20 animate-pulse-slow"></div>
            </div>

            {/* Rules modal */}
            {showRules && rulesContent}
        </div>
    );
}
