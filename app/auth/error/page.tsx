"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Component that uses searchParams
function ErrorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    useEffect(() => {
        // Log the error for debugging
        console.error("Auth error:", error);

        // Automatically redirect back to the tasks page after a short delay
        const timer = setTimeout(() => {
            router.push("/vault/play");
        }, 5000);

        return () => clearTimeout(timer);
    }, [error, router]);

    return (
        <div className="max-w-md w-full border border-yellow-500/30 rounded-lg p-8 bg-black/70">
            <h1 className="text-2xl font-bold text-yellow-500 mb-4">
                Authentication Error
            </h1>

            <div className="mb-6">
                <p className="mb-2">There was a problem with authentication:</p>
                <div className="bg-red-900/30 border border-red-500/30 rounded p-3 text-red-300">
                    {error === "Configuration" ? (
                        <>
                            <p className="font-bold">Configuration Error</p>
                            <p className="text-sm mt-1">
                                The authentication provider is not properly
                                configured. This is likely due to missing or
                                incorrect environment variables.
                            </p>
                        </>
                    ) : (
                        <p>{error || "Unknown error"}</p>
                    )}
                </div>
            </div>

            <p className="text-gray-400 text-sm mb-4">
                Redirecting back to tasks page in a few seconds...
            </p>

            <div className="mb-4 flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-500"></div>
            </div>

            <div className="flex flex-col space-y-3">
                <Link
                    href="/vault/play"
                    className="py-2 px-4 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 text-yellow-500 rounded text-center transition-colors"
                >
                    Return to Tasks Now
                </Link>

                <button
                    onClick={() => router.back()}
                    className="py-2 px-4 bg-transparent hover:bg-white/5 border border-white/20 rounded text-center transition-colors"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}

// Loading fallback
function ErrorLoading() {
    return (
        <div className="max-w-md w-full border border-yellow-500/30 rounded-lg p-8 bg-black/70">
            <h1 className="text-2xl font-bold text-yellow-500 mb-4">
                Loading...
            </h1>
            <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        </div>
    );
}

export default function AuthError() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <Suspense fallback={<ErrorLoading />}>
                <ErrorContent />
            </Suspense>
        </div>
    );
}
