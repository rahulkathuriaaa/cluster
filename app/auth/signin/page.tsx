"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-yellow-500/30 bg-black p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-yellow-400">Sign In</h2>
          <p className="mt-2 text-yellow-400/70">Sign in to access the Catalyst AI Vault</p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button
            onClick={() => signIn("twitter", { callbackUrl: "/vault/play" })}
            className="flex w-full items-center justify-center space-x-3 rounded-md border border-yellow-500/50 bg-black py-3 px-4 text-yellow-400 transition-all hover:bg-yellow-500/10"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Sign in with Twitter</span>
          </button>
        </div>
      </div>
    </div>
  );
} 