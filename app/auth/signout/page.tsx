"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignOut() {
  const router = useRouter();

  // Auto-redirect to sign out
  useEffect(() => {
    signOut({ callbackUrl: "/vault/play" });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="max-w-md w-full border border-yellow-500/30 rounded-lg p-8 bg-black/70">
        <h1 className="text-2xl font-bold text-yellow-500 mb-4">Signing Out</h1>
        <p className="mb-4">You are being signed out...</p>
        
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    </div>
  );
}
