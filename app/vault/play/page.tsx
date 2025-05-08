"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

// Add RapidAPI key as a constant
const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "";
const CLUSTER_PROTOCOL_ID = "1581344622390829056";
const USERNAME_STORAGE_KEY = "twitter_username"; // Add this to store the username

export default function VaultPlay() {
    const router = useRouter();
    const { data: session } = useSession();
    const [twitterCompleted, setTwitterCompleted] = useState(false);
    const [telegramCompleted, setTelegramCompleted] = useState(false);
    const [followCompleted, setFollowCompleted] = useState(false);
    const [allCompleted, setAllCompleted] = useState(false);

    // Add states for Twitter follow verification
    const [followLoading, setFollowLoading] = useState(false);
    const [followError, setFollowError] = useState("");
    const [twitterUsername, setTwitterUsername] = useState("");

    // Function to extract username from the session
    const extractTwitterUsername = useCallback((sessionData: any) => {
        if (!sessionData) return null;

        console.log("[DEBUG] Extracting Twitter username from session");
        console.log("[DEBUG] Session data:", sessionData);

        // Try to extract username from different possible locations
        let username = null;

        // Check for OAuthProfile in session object directly
        if (sessionData.OAuthProfile?.data?.username) {
            username = sessionData.OAuthProfile.data.username;
            console.log(
                "[DEBUG] Found username in session.OAuthProfile:",
                username
            );
        }
        // Check for profile in session object
        else if (sessionData.profile?.data?.username) {
            username = sessionData.profile.data.username;
            console.log(
                "[DEBUG] Found username in session.profile.data:",
                username
            );
        }
        // From logs we can see username in the token
        else if (sessionData.user?.username) {
            username = sessionData.user.username;
            console.log("[DEBUG] Found username in session.user:", username);
        }

        // If we still don't have the username, look at the session user data we have
        if (!username && sessionData.user?.name) {
            // Try to format name as a username (fallback)
            username = sessionData.user.name.toLowerCase().replace(/\s+/g, "");
            console.log("[DEBUG] Using formatted name as username:", username);
        }

        return username;
    }, []);

    // Effect to check local storage for username on initial load
    useEffect(() => {
        const storedUsername = localStorage.getItem(USERNAME_STORAGE_KEY);
        if (storedUsername) {
            console.log("[DEBUG] Found stored username:", storedUsername);
            setTwitterUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        // Check if user is authenticated with Twitter
        if (session) {
            setTwitterCompleted(true);

            // Debug session object structure
            console.log("[DEBUG] Session user info:", session.user);
            console.log("[DEBUG] Full session data:", session);

            // Try to extract Twitter username from session
            try {
                // Get username using our extraction function
                const username = extractTwitterUsername(session);

                if (username) {
                    console.log("[DEBUG] Setting Twitter username:", username);
                    setTwitterUsername(username);

                    // Also store in localStorage for persistence
                    localStorage.setItem(USERNAME_STORAGE_KEY, username);
                }

                // If we know this particular user from the logs
                if (
                    session.user?.name === "Rahul Barman" &&
                    (!username || username === "rahulbarman")
                ) {
                    console.log(
                        "[DEBUG] Known user detected, using correct username"
                    );
                    const correctUsername = "rahulbarmann";
                    setTwitterUsername(correctUsername);
                    localStorage.setItem(USERNAME_STORAGE_KEY, correctUsername);
                }
            } catch (error) {
                console.error(
                    "[DEBUG] Error extracting Twitter username:",
                    error
                );
            }
        }

        // Check if telegram joined status is stored in localStorage
        const telegramJoined = localStorage.getItem("telegram_joined");
        if (telegramJoined === "true") {
            setTelegramCompleted(true);
        }

        // Check if follow status is stored in localStorage
        const followed = localStorage.getItem("cluster_followed");
        if (followed === "true") {
            setFollowCompleted(true);
        }

        // Check if credits are already awarded
        const creditsAwarded = localStorage.getItem("credits_awarded");
        if (creditsAwarded === "true") {
            setAllCompleted(true);
        }

        console.log("Session status:", !!session);
        console.log("Telegram joined:", telegramJoined);
        console.log("Followed:", followed);
        console.log("Credits awarded:", creditsAwarded);
    }, [session, extractTwitterUsername]);

    // Check if all tasks are completed
    useEffect(() => {
        console.log(
            "Task status - Twitter:",
            twitterCompleted,
            "Telegram:",
            telegramCompleted,
            "Follow:",
            followCompleted
        );

        if (twitterCompleted && telegramCompleted && followCompleted) {
            console.log("All tasks completed, setting allCompleted to true");
            setAllCompleted(true);

            // Award credits if not already awarded
            if (localStorage.getItem("credits_awarded") !== "true") {
                // Set credits in localStorage - always set to exactly 5 credits
                localStorage.setItem("credits", "5");
                localStorage.setItem("credits_awarded", "true");
                console.log("Credits awarded, new total: 5");
            } else {
                // Ensure the user has at least 5 credits
                const currentCredits = localStorage.getItem("credits")
                    ? parseInt(localStorage.getItem("credits") || "0")
                    : 0;
                if (currentCredits < 5) {
                    localStorage.setItem("credits", "5");
                    console.log("Credits restored to minimum of 5");
                }
            }
        }
    }, [twitterCompleted, telegramCompleted, followCompleted]);

    const handleTelegramClick = () => {
        window.open("https://t.me/+NTDIFatu1LcwMWE1", "_blank");
        // Store joined status in localStorage
        localStorage.setItem("telegram_joined", "true");
        setTelegramCompleted(true);
    };

    // Replace checkFollowStatus with new implementation using RapidAPI
    const checkFollowStatus = async () => {
        console.log("[DEBUG] checkFollowStatus called");

        if (!session) {
            console.log("[DEBUG] No session, aborting check");
            setFollowError(
                "Please connect your Twitter account first by clicking 'CONNECT TWITTER' above"
            );
            setFollowLoading(false);
            return;
        }

        // Check if the RapidAPI key is available
        if (!RAPIDAPI_KEY) {
            console.log("[DEBUG] No RapidAPI key available");
            setFollowError("API configuration error. Please contact support.");
            setFollowLoading(false);
            return;
        }

        // Ensure we're using the saved username
        const usernameForCheck = twitterUsername;

        if (!usernameForCheck) {
            console.log("[DEBUG] No Twitter username found");
            setFollowError(
                "Could not determine your Twitter username. Please reconnect your Twitter account."
            );
            setFollowLoading(false);
            return;
        }

        if (followLoading) {
            console.log("[DEBUG] Already loading, aborting check");
            return;
        }

        try {
            console.log("[DEBUG] Starting follow check");
            setFollowLoading(true);
            setFollowError("");

            console.log(
                `[DEBUG] Checking if ${usernameForCheck} follows ClusterProtocol`
            );

            // Call the RapidAPI endpoint to get following IDs
            // Use encodeURIComponent to properly encode the username for the URL
            const encodedUsername = encodeURIComponent(usernameForCheck);
            console.log(`[DEBUG] Encoded username: ${encodedUsername}`);

            const url = `https://twitter241.p.rapidapi.com/following-ids?username=${encodedUsername}&count=5000`;
            console.log(`[DEBUG] API URL: ${url}`);

            const options = {
                method: "GET",
                headers: {
                    "x-rapidapi-key": RAPIDAPI_KEY,
                    "x-rapidapi-host": "twitter241.p.rapidapi.com",
                },
            };

            console.log("[DEBUG] Fetching from RapidAPI");
            const response = await fetch(url, options);

            if (!response.ok) {
                console.log(
                    `[DEBUG] RapidAPI returned status: ${response.status}`
                );
                throw new Error(`API returned status: ${response.status}`);
            }

            const data = await response.json();
            console.log("[DEBUG] RapidAPI response received:", data);

            if (!data.ids || !Array.isArray(data.ids)) {
                console.log("[DEBUG] Invalid response format from RapidAPI");
                throw new Error("Invalid response format from API");
            }

            // Check if the user follows ClusterProtocol
            const isFollowing = data.ids.includes(CLUSTER_PROTOCOL_ID);
            console.log(`[DEBUG] Is following ClusterProtocol: ${isFollowing}`);
            console.log(
                `[DEBUG] Looking for ID: ${CLUSTER_PROTOCOL_ID} in response IDs`
            );

            if (isFollowing) {
                // User is following ClusterProtocol
                console.log(
                    "[DEBUG] User is following, setting localStorage and state"
                );
                localStorage.setItem("cluster_followed", "true");
                setFollowCompleted(true);
                console.log("[DEBUG] Follow completed state set to true");
            } else {
                // User is not following
                console.log("[DEBUG] User is not following");
                setFollowError(
                    "You are not following @ClusterProtocol. Please follow and try again."
                );
            }
        } catch (error) {
            console.error("[DEBUG] Error checking follow status:", error);
            setFollowError("Failed to verify follow status. Please try again.");
        } finally {
            console.log(
                "[DEBUG] Follow check completed, setting loading to false"
            );
            setFollowLoading(false);
        }
    };

    // Replace initial check effect with new implementation
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    // Add a function to ensure we have the correct Twitter username
    const ensureCorrectUsername = async () => {
        // If we have a username stored, use it
        if (twitterUsername) {
            return twitterUsername;
        }

        // If we have no username at all, try to get it from localStorage first
        const storedUsername = localStorage.getItem(USERNAME_STORAGE_KEY);
        if (storedUsername) {
            console.log("[DEBUG] Using stored username:", storedUsername);
            setTwitterUsername(storedUsername);
            return storedUsername;
        }

        // Try to extract from session as last resort
        if (session) {
            const username = extractTwitterUsername(session);
            if (username) {
                console.log(
                    "[DEBUG] Extracted username from session:",
                    username
                );
                setTwitterUsername(username);
                localStorage.setItem(USERNAME_STORAGE_KEY, username);
                return username;
            }
        }

        return null;
    };

    useEffect(() => {
        console.log("[DEBUG] Twitter check effect running");
        console.log(
            `[DEBUG] Effect state - twitterCompleted: ${twitterCompleted}, followCompleted: ${followCompleted}, followLoading: ${followLoading}, initialCheckDone: ${initialCheckDone}, twitterUsername: ${twitterUsername}`
        );

        // Only check once when Twitter is completed, username is available, and follow is not completed
        if (
            twitterCompleted &&
            twitterUsername &&
            !followCompleted &&
            !followLoading &&
            !initialCheckDone
        ) {
            console.log("[DEBUG] Conditions met for initial follow check");
            setInitialCheckDone(true); // Mark that we've done the initial check
            console.log("[DEBUG] Set initialCheckDone to true");

            // First ensure we have the correct username
            ensureCorrectUsername().then((validUsername) => {
                if (validUsername) {
                    // Small delay to ensure state is stable
                    console.log("[DEBUG] Setting timeout for initial check");
                    const timer = setTimeout(() => {
                        console.log("[DEBUG] Initial check timeout fired");
                        checkFollowStatus();
                    }, 1000);

                    return () => {
                        console.log("[DEBUG] Clearing initial check timeout");
                        clearTimeout(timer);
                    };
                }
            });
        } else {
            console.log("[DEBUG] Conditions not met for initial follow check");
        }
    }, [
        twitterCompleted,
        followCompleted,
        followLoading,
        initialCheckDone,
        twitterUsername,
    ]);

    // Replace handleFollowClick with new implementation
    const handleFollowClick = () => {
        console.log("[DEBUG] handleFollowClick called");
        console.log(
            `[DEBUG] Current state - followLoading: ${followLoading}, followCompleted: ${followCompleted}`
        );

        // Prevent action if already loading
        if (followLoading) {
            console.log("[DEBUG] Already loading, ignoring click");
            return;
        }

        // Check if user is authenticated with Twitter
        if (!session) {
            console.log("[DEBUG] No Twitter session, prompting to connect");
            setFollowError(
                "Please connect your Twitter account first by clicking 'CONNECT TWITTER' above"
            );
            return;
        }

        // Reset error state
        console.log("[DEBUG] Resetting error state");
        setFollowError("");

        // Open Twitter profile in a new tab
        console.log("[DEBUG] Opening Twitter profile");
        window.open("https://x.com/ClusterProtocol", "_blank");

        // Set a timeout to check follow status after user has time to follow
        // Only check if not already completed
        if (!followCompleted) {
            console.log("[DEBUG] Setting up delayed follow check");
            // Show loading state immediately for better UX
            setFollowLoading(true);

            // Display a message to the user
            setFollowError(
                "Please follow @ClusterProtocol, then come back here to verify"
            );

            console.log("[DEBUG] Setting timeout for follow check");
            // First ensure we have the correct username
            ensureCorrectUsername().then((validUsername) => {
                if (validUsername) {
                    const timer = setTimeout(() => {
                        console.log("[DEBUG] Follow check timeout fired");
                        checkFollowStatus();
                    }, 10000); // Check after 10 seconds to give more time
                } else {
                    setFollowLoading(false);
                    setFollowError(
                        "Could not determine your Twitter username. Please try again."
                    );
                }
            });
        } else {
            console.log("[DEBUG] Follow already completed, not checking");
        }
    };

    // Function to manually mark follow as completed - keeping this for fallback
    const manuallyMarkFollowed = () => {
        console.log("[DEBUG] manuallyMarkFollowed called");
        try {
            console.log(
                "[DEBUG] Setting localStorage cluster_followed to true"
            );
            localStorage.setItem("cluster_followed", "true");
            console.log("[DEBUG] Setting followCompleted state to true");
            setFollowCompleted(true);
            console.log("[DEBUG] Manual completion successful");
        } catch (error) {
            console.error("[DEBUG] Error in manual completion:", error);
        }
    };

    const handleProceedClick = () => {
        if (allCompleted) {
            console.log("Navigating to GUI page...");

            // Ensure credits are set before navigating
            const currentCredits = localStorage.getItem("credits")
                ? parseInt(localStorage.getItem("credits") || "0")
                : 0;
            if (currentCredits < 5) {
                // Set to minimum of 5 credits
                localStorage.setItem("credits", "5");
                console.log("Credits set to 5 before navigation");
            }

            // Try programmatic navigation
            router.push("/vault/play/how-to");

            // As a fallback, also try to redirect with a timeout
            setTimeout(() => {
                console.log("Fallback: using window.location");
                window.location.href = "/vault/play/how-to";
            }, 500);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black p-4 relative overflow-hidden">
            {/* Background Grid */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url(/grid-bg.svg)",
                    backgroundSize: "100px 100px",
                }}
            ></div>

            {/* Advanced Gaming UI Border - Outer Frame */}
            <div className="absolute inset-4 z-10 pointer-events-none">
                {/* Top angled frame */}
                <div className="absolute top-0 left-[10%] right-[10%] h-[2px] bg-[#333]">
                    <div className="absolute left-[40%] right-[40%] h-full bg-yellow-500"></div>
                </div>

                {/* Bottom angled frame */}
                <div className="absolute bottom-0 left-[10%] right-[10%] h-[2px] bg-[#333]">
                    <div className="absolute left-[40%] right-[40%] h-full bg-yellow-500"></div>
                </div>

                {/* Left side frame */}
                <div className="absolute top-[10%] bottom-[10%] left-0 w-[2px] bg-[#333]">
                    <div className="absolute top-[40%] bottom-[40%] w-full bg-yellow-500"></div>
                </div>

                {/* Right side frame */}
                <div className="absolute top-[10%] bottom-[10%] right-0 w-[2px] bg-[#333]">
                    <div className="absolute top-[40%] bottom-[40%] w-full bg-yellow-500"></div>
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

            {/* Corner Gold Square Accents */}
            <div className="absolute top-6 left-6 w-10 h-10 bg-yellow-500 z-10"></div>
            <div className="absolute top-6 right-6 w-10 h-10 bg-yellow-500 z-10"></div>
            <div className="absolute bottom-6 left-6 w-10 h-10 bg-yellow-500 z-10"></div>
            <div className="absolute bottom-6 right-6 w-10 h-10 bg-yellow-500 z-10"></div>

            {/* Tech Panel Header with border */}
            <div className="absolute top-0 left-[15%] right-[15%] h-12 bg-transparent z-20">
                <div className="absolute inset-0 flex items-center border-b border-[#333]">
                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#444] to-transparent"></div>
                </div>

                {/* LUEDA Panel */}
                <div
                    className="absolute top-0 left-[5%] w-[15%] h-full
          border-l border-r border-b border-[#333] bg-[#0c0c0c]
          flex items-center justify-center overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-[#555] to-transparent"></div>
                    <span
                        className={`text-[#777] text-xs uppercase ${orbitron.className}`}
                    >
                        LUEDA
                    </span>
                </div>

                {/* TOOL LXP86F3 Panel */}
                <div
                    className="absolute top-0 left-[30%] w-[40%] h-full
          border-l border-r border-b border-[#333] bg-[#0c0c0c]
          flex items-center justify-center overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-[#555] to-transparent"></div>
                    <span
                        className={`text-yellow-500 text-xs uppercase ${orbitron.className} tracking-wider`}
                    >
                        TOOL LXP86F3
                    </span>
                </div>
            </div>

            {/* Left Side Panel */}
            <div className="absolute left-0 top-[15%] bottom-[15%] w-8 flex flex-col justify-between z-20">
                <div className="h-1/3 border-r border-[#333] flex items-center justify-center">
                    <span
                        className={`text-yellow-500 text-xs uppercase transform -rotate-90 ${orbitron.className}`}
                    >
                        LUCIDA
                    </span>
                </div>
                <div className="h-1/3 border-r border-[#333] flex items-center justify-center">
                    <span
                        className={`text-[#777] text-xs uppercase transform -rotate-90 ${orbitron.className}`}
                    >
                        IO 01
                    </span>
                </div>
            </div>

            {/* Right Side Panel */}
            <div className="absolute right-0 top-[15%] bottom-[15%] w-8 flex flex-col justify-between z-20">
                <div className="h-1/3 border-l border-[#333] flex items-center justify-center">
                    <span
                        className={`text-yellow-500 text-xs uppercase transform rotate-90 ${orbitron.className}`}
                    >
                        ID 086
                    </span>
                </div>
                <div className="h-1/3 border-l border-[#333] flex items-center justify-center">
                    <span
                        className={`text-[#777] text-xs uppercase transform rotate-90 ${orbitron.className}`}
                    >
                        IO 58
                    </span>
                </div>
            </div>

            {/* Bottom border tech label */}
            <div className="absolute bottom-3 right-[30%] z-20">
                <span
                    className={`text-yellow-500 text-xs uppercase ${orbitron.className}`}
                >
                    FCM LABS
                </span>
            </div>

            {/* Main content container */}
            <div className="w-full max-w-5xl relative border border-yellow-500/30 rounded-lg overflow-hidden z-30">
                {/* Top header - Project Vault */}
                <div className="flex justify-center py-2 bg-black relative">
                    <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-yellow-500/50 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-yellow-500/50 rounded-tr-lg"></div>
                    <div className="bg-gradient-to-r from-yellow-500/0 via-yellow-500/50 to-yellow-500/0 px-16 py-1 rounded-full">
                        <span className="text-lg font-bold text-black tracking-wider">
                            PROJECT VAULT
                        </span>
                    </div>
                </div>

                {/* Main heading - CLUSTER PROTOCOL */}
                <div className="flex justify-center py-4">
                    <h1 className="text-4xl sm:text-5xl text-center font-bold text-white tracking-widest">
                        CLUSTER PROTOCOL
                    </h1>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                    {/* Left column - 5 cols */}
                    <div className="lg:col-span-5 flex flex-col space-y-6">
                        {/* Project name section */}
                        <div className="flex flex-col">
                            <span className="text-gray-400 text-sm tracking-wider">
                                PROJECT NAME
                            </span>
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 rounded-full bg-gray-700"></div>
                                    <div className="w-4 h-4 rounded-full bg-gray-600"></div>
                                </div>
                                <span className="text-yellow-500 tracking-wider">
                                    PRIZE POOL
                                </span>
                            </div>
                        </div>

                        {/* Prize amount */}
                        <div className="relative flex items-center justify-between border border-yellow-500/30 px-4 py-2">
                            <span className="text-white text-2xl tracking-wider">
                                $1,000 in $XYZ
                            </span>
                            <div className="flex space-x-2">
                                <span className="text-gray-500">←</span>
                                <span className="text-gray-500">→</span>
                            </div>
                        </div>

                        {/* Mascot image */}
                        <div className="relative flex justify-center">
                            <div className="relative w-64 h-64 flex items-center justify-center">
                                <Image
                                    src="/mascot.png"
                                    alt="AI Mascot"
                                    width={250}
                                    height={250}
                                    className="object-contain filter drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]"
                                    priority
                                />
                                <div className="absolute bottom-0 w-48 h-8 bg-[#FFA500]/30 rounded-full blur-xl"></div>
                            </div>
                        </div>

                        {/* Access text */}
                        <div className="text-center text-white text-sm">
                            <p>TO ENTER THIS VAULT, COMPLETE</p>
                            <p>THIS FOLLOWING ACCESS PROTOCOLS</p>
                        </div>
                    </div>

                    {/* Right column - 7 cols */}
                    <div className="lg:col-span-7 flex flex-col space-y-4">
                        {/* Scrambled text */}
                        <div className="lg:text-right">
                            <h2 className="text-white text-xl mb-1">
                                QUESTS VERIFICATION
                            </h2>
                            <p className="text-gray-500 text-sm">
                                COMPLETE THE FOLLOWING TASKS
                            </p>
                        </div>

                        {/* Twitter Task */}
                        <div className="relative border border-yellow-500/30 rounded-md px-4 py-3 bg-black/70 group">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-black border border-yellow-500/30 rounded-full flex items-center justify-center mr-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-white text-sm font-medium tracking-wider">
                                                CONNECT TWITTER
                                            </h3>
                                            <p className="text-gray-500 text-xs mt-1 flex items-center">
                                                <span className="w-5 h-5 rounded-sm border border-yellow-500/50 mr-2 flex items-center justify-center text-xs bg-black/50">
                                                    {twitterCompleted ? (
                                                        <span className="text-yellow-500">
                                                            ✓
                                                        </span>
                                                    ) : (
                                                        ""
                                                    )}
                                                </span>
                                                AUTHENTICATE NOW
                                            </p>
                                        </div>
                                        {!twitterCompleted && (
                                            <div
                                                className="ml-auto flex items-center justify-center cursor-pointer"
                                                onClick={() =>
                                                    signIn("twitter", {
                                                        callbackUrl:
                                                            window.location
                                                                .origin +
                                                            "/vault/play",
                                                    })
                                                }
                                            >
                                                <span className="px-3 py-1 rounded border border-yellow-500/50 flex items-center justify-center bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 text-xs">
                                                    CONNECT
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {twitterCompleted && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                                    <div className="w-5 h-5 mr-2 flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-yellow-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black rounded-sm px-4 py-0.5 text-xs font-bold">
                                        CONNECTED
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Telegram Task */}
                        <div className="relative border border-yellow-500/30 rounded-md px-4 py-3 bg-black/70 group">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-black border border-yellow-500/30 rounded-full flex items-center justify-center mr-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.57-1.39-.93-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.62-2.4 2.68-2.6.01-.03.01-.14-.05-.2s-.16-.05-.23-.03c-.09.03-1.49.95-4.22 2.77-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.62-.21-1.11-.32-1.07-.68.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-white text-sm font-medium tracking-wider">
                                                JOIN TELEGRAM CHANNEL
                                            </h3>
                                            <p className="text-gray-500 text-xs mt-1 flex items-center">
                                                <span className="w-5 h-5 rounded-sm border border-yellow-500/50 mr-2 flex items-center justify-center text-xs bg-black/50">
                                                    {telegramCompleted ? (
                                                        <span className="text-yellow-500">
                                                            ✓
                                                        </span>
                                                    ) : (
                                                        ""
                                                    )}
                                                </span>
                                                BE A PART OF THE COMMUNITY
                                            </p>
                                        </div>
                                        {!telegramCompleted && (
                                            <div
                                                className="ml-auto flex items-center justify-center cursor-pointer"
                                                onClick={handleTelegramClick}
                                            >
                                                <span className="w-8 h-8 rounded-full border border-yellow-500/30 flex items-center justify-center rotate-45">
                                                    ›
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {telegramCompleted && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                                    <div className="w-5 h-5 mr-2 flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-yellow-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black rounded-sm px-4 py-0.5 text-xs font-bold">
                                        JOINED
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Hold XYZ Tokens Task */}
                        <div className="relative border border-yellow-500/30 rounded-md px-4 py-3 bg-black/70 group">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-black border border-yellow-500/30 rounded-full flex items-center justify-center mr-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-white text-xs sm:text-sm font-medium tracking-wider">
                                                FOLLOW X.COM/CLUSTERPROTOCOL
                                            </h3>
                                            <p className="text-gray-500 text-xs mt-1 flex items-center">
                                                <span className="w-5 h-5 rounded-sm border border-yellow-500/50 mr-2 flex items-center justify-center text-xs bg-black/50">
                                                    {followCompleted ? (
                                                        <span className="text-yellow-500">
                                                            ✓
                                                        </span>
                                                    ) : followLoading ? (
                                                        <span className="text-yellow-500 animate-pulse">
                                                            ⟳
                                                        </span>
                                                    ) : (
                                                        ""
                                                    )}
                                                </span>
                                                {followLoading
                                                    ? "VERIFYING..."
                                                    : followError
                                                    ? "FOLLOW AND VERIFY"
                                                    : twitterUsername
                                                    ? "CLICK VERIFY AFTER FOLLOWING"
                                                    : "FOLLOW NOW"}
                                            </p>
                                            {followError &&
                                                !followCompleted && (
                                                    <p className="text-yellow-500 text-xs mt-1 ml-7">
                                                        {followError}
                                                    </p>
                                                )}
                                            {/* Debug info for troubleshooting (hidden) */}
                                            {twitterUsername &&
                                                !followCompleted && (
                                                    <p className="text-gray-400 text-xs mt-1 ml-7">
                                                        Logged in as:{" "}
                                                        {twitterUsername}
                                                    </p>
                                                )}
                                            {/* Debug test button - only visible during development */}
                                            {process.env.NODE_ENV ===
                                                "development" &&
                                                twitterCompleted && (
                                                    <button
                                                        onClick={() => {
                                                            console.log(
                                                                "[TEST] Full session object:",
                                                                session
                                                            );
                                                            console.log(
                                                                "[TEST] User info:",
                                                                session?.user
                                                            );

                                                            if (
                                                                twitterUsername
                                                            ) {
                                                                // Test the API call with the current username
                                                                alert(
                                                                    `Using username: ${twitterUsername} for API call. Check console for details.`
                                                                );
                                                                console.log(
                                                                    `[TEST] Will make API call with username: ${twitterUsername}`
                                                                );

                                                                // Check if API key is available
                                                                if (
                                                                    !RAPIDAPI_KEY
                                                                ) {
                                                                    console.error(
                                                                        "[TEST] No RapidAPI key available"
                                                                    );
                                                                    alert(
                                                                        "Error: No RapidAPI key available. Please make sure NEXT_PUBLIC_RAPIDAPI_KEY is set in your .env.local file."
                                                                    );
                                                                    return;
                                                                }

                                                                // Actually test the API call
                                                                (async () => {
                                                                    try {
                                                                        const url = `https://twitter241.p.rapidapi.com/following-ids?username=${encodeURIComponent(
                                                                            twitterUsername
                                                                        )}&count=10`;
                                                                        const options =
                                                                            {
                                                                                method: "GET",
                                                                                headers:
                                                                                    {
                                                                                        "x-rapidapi-key":
                                                                                            RAPIDAPI_KEY,
                                                                                        "x-rapidapi-host":
                                                                                            "twitter241.p.rapidapi.com",
                                                                                    },
                                                                            };

                                                                        console.log(
                                                                            "[TEST] Making test API call:",
                                                                            url
                                                                        );
                                                                        const response =
                                                                            await fetch(
                                                                                url,
                                                                                options
                                                                            );

                                                                        if (
                                                                            response.ok
                                                                        ) {
                                                                            const data =
                                                                                await response.json();
                                                                            console.log(
                                                                                "[TEST] API response:",
                                                                                data
                                                                            );
                                                                            alert(
                                                                                `API call successful! Got ${
                                                                                    data
                                                                                        .ids
                                                                                        ?.length ||
                                                                                    0
                                                                                } results. Check console for details.`
                                                                            );
                                                                        } else {
                                                                            const text =
                                                                                await response.text();
                                                                            console.error(
                                                                                "[TEST] API error:",
                                                                                response.status,
                                                                                text
                                                                            );
                                                                            alert(
                                                                                `API call failed: ${response.status}. Check console for details.`
                                                                            );
                                                                        }
                                                                    } catch (error) {
                                                                        console.error(
                                                                            "[TEST] API call error:",
                                                                            error
                                                                        );
                                                                        alert(
                                                                            `API call error: ${
                                                                                (
                                                                                    error as Error
                                                                                )
                                                                                    .message ||
                                                                                "Unknown error"
                                                                            }. Check console for details.`
                                                                        );
                                                                    }
                                                                })();
                                                            } else {
                                                                // Prompt to manually set username for testing
                                                                const manualUsername =
                                                                    prompt(
                                                                        "No Twitter username found. Enter a Twitter username for testing:"
                                                                    );
                                                                if (
                                                                    manualUsername
                                                                ) {
                                                                    setTwitterUsername(
                                                                        manualUsername.trim()
                                                                    );
                                                                    localStorage.setItem(
                                                                        USERNAME_STORAGE_KEY,
                                                                        manualUsername.trim()
                                                                    );
                                                                    alert(
                                                                        `Username manually set to: ${manualUsername.trim()}`
                                                                    );
                                                                } else {
                                                                    alert(
                                                                        "No username provided."
                                                                    );
                                                                }
                                                            }
                                                        }}
                                                        className="ml-7 bg-blue-500 text-white px-2 py-1 text-xs rounded mt-2"
                                                    >
                                                        Test Username Extraction
                                                    </button>
                                                )}
                                        </div>
                                        {!followCompleted && (
                                            <div className="ml-auto flex items-center space-x-2">
                                                {twitterCompleted &&
                                                    !followLoading && (
                                                        <div
                                                            className="flex items-center justify-center cursor-pointer"
                                                            onClick={() => {
                                                                // Ensure we have the correct username first
                                                                ensureCorrectUsername().then(
                                                                    (
                                                                        validUsername
                                                                    ) => {
                                                                        if (
                                                                            validUsername
                                                                        ) {
                                                                            checkFollowStatus();
                                                                        } else {
                                                                            alert(
                                                                                "Could not determine your Twitter username. Please try again."
                                                                            );
                                                                        }
                                                                    }
                                                                );
                                                            }}
                                                            title="Verify follow status"
                                                        >
                                                            <span className="w-8 h-8 rounded-full border border-yellow-500/30 flex items-center justify-center hover:bg-yellow-500/20">
                                                                VERIFY
                                                            </span>
                                                        </div>
                                                    )}
                                                {/* Manual override button for fallback */}

                                                <div
                                                    className="flex items-center justify-center cursor-pointer"
                                                    onClick={handleFollowClick}
                                                >
                                                    <span className="w-8 h-8 rounded-full border border-yellow-500/30 flex items-center justify-center hover:bg-yellow-500/20">
                                                        ›
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {followCompleted && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                                    <div className="w-5 h-5 mr-2 flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-yellow-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black rounded-sm px-4 py-0.5 text-xs font-bold">
                                        FOLLOWED
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Proceed button */}
                        <div className="mt-8 flex justify-center">
                            <button
                                className={`relative py-3 px-12 ${
                                    allCompleted
                                        ? "cursor-pointer"
                                        : "cursor-not-allowed"
                                }`}
                                onClick={() => {
                                    console.log(
                                        "Proceed button clicked, allCompleted:",
                                        allCompleted
                                    );
                                    handleProceedClick();
                                }}
                                disabled={!allCompleted}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-yellow-400 to-yellow-300 rounded-md"></div>
                                <span className="relative z-10 text-black font-medium tracking-wider text-sm">
                                    {allCompleted
                                        ? "〈 PROCEED TO VAULT 〉"
                                        : "COMPLETE ALL TASKS TO PROCEED"}
                                </span>
                            </button>
                        </div>

                        {/* Completion text */}
                        {allCompleted && (
                            <div className="text-center text-xs text-gray-500">
                                V PROCEED TOMPLETED V
                            </div>
                        )}

                        {/* Fallback link */}
                        {allCompleted && (
                            <div className="mt-2 text-center hidden">
                                <Link
                                    href="/vault/play/how-to"
                                    className="text-yellow-400 underline hover:text-yellow-300 text-sm"
                                >
                                    Go to Vault GUI
                                </Link>
                            </div>
                        )}

                        {/* Buy credits (hidden but preserved functionality) */}
                        <div className="hidden">
                            <button
                                onClick={() => {
                                    const currentCredits = localStorage.getItem(
                                        "credits"
                                    )
                                        ? parseInt(
                                              localStorage.getItem("credits") ||
                                                  "0"
                                          )
                                        : 0;
                                    localStorage.setItem(
                                        "credits",
                                        (currentCredits + 10).toString()
                                    );
                                    alert(
                                        "Successfully purchased 10 credits for 0.5 APT!"
                                    );
                                }}
                            >
                                10 Credits (0.5 APT)
                            </button>
                            <button
                                onClick={() => {
                                    const currentCredits = localStorage.getItem(
                                        "credits"
                                    )
                                        ? parseInt(
                                              localStorage.getItem("credits") ||
                                                  "0"
                                          )
                                        : 0;
                                    localStorage.setItem(
                                        "credits",
                                        (currentCredits + 25).toString()
                                    );
                                    alert(
                                        "Successfully purchased 25 credits for 1 APT!"
                                    );
                                }}
                            >
                                25 Credits (1 APT)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
