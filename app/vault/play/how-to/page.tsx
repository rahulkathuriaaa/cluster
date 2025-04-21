// pages/index.js
"use client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaTwitter, FaFacebook } from "react-icons/fa";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function Home() {
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
            <div className="text-white w-full">
                <div className=" mx-auto px-4 sm:px-6 relative">
                    {/* Main Content */}
                    <main className="py-8">
                        <div className="flex flex-col md:flex-row gap-8 p-6">
                            {/* Left Section */}
                            <div className="flex flex-col items-center md:w-1/2">
                                <h1
                                    className={`text-4xl sm:text-5xl text-center font-bold text-yellow-500 mb-8 ${orbitron.className}tracking-widest`}
                                >
                                    CANDY MACHINE
                                </h1>

                                <div className="relative w-80 h-80 mb-8">
                                    {/* Enhanced outer glow with multiple layers */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 animate-pulse-slow opacity-70"></div>
                                    <div className="absolute inset-[-8px] rounded-full bg-yellow-500/10 animate-pulse blur-md"></div>

                                    {/* Orbital rings around mascot */}
                                    <div
                                        className="absolute inset-2 rounded-full border border-yellow-500/30 animate-orbit"
                                        style={{ animationDuration: "20s" }}
                                    ></div>
                                    <div
                                        className="absolute inset-6 rounded-full border border-yellow-500/20 animate-orbit-reverse"
                                        style={{ animationDuration: "15s" }}
                                    ></div>

                                    {/* Tech circuit patterns */}
                                    <div className="absolute inset-0 rounded-full overflow-hidden">
                                        <div className="absolute top-1/4 left-0 w-1/3 h-[1px] bg-yellow-500/40"></div>
                                        <div className="absolute top-3/4 right-0 w-1/3 h-[1px] bg-yellow-500/40"></div>
                                        <div className="absolute top-0 left-1/4 h-1/3 w-[1px] bg-yellow-500/40"></div>
                                        <div className="absolute bottom-0 right-1/4 h-1/3 w-[1px] bg-yellow-500/40"></div>

                                        {/* Circuit nodes */}
                                        <div className="absolute top-1/4 left-0 w-2 h-2 bg-yellow-500/60 rounded-full"></div>
                                        <div className="absolute top-3/4 right-0 w-2 h-2 bg-yellow-500/60 rounded-full"></div>
                                        <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-500/60 rounded-full"></div>
                                        <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-yellow-500/60 rounded-full"></div>
                                    </div>

                                    {/* Inner container with enhanced background */}
                                    <div className="absolute inset-4 rounded-full bg-black flex items-center justify-center overflow-hidden">
                                        {/* Inner glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/20 to-transparent"></div>

                                        {/* Radial light beams */}
                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.1),transparent_70%)] animate-pulse-slow"></div>

                                        {/* Mascot with enhanced effects */}
                                        <div
                                            className="relative animate-float z-10"
                                            style={{ animationDuration: "6s" }}
                                        >
                                            <Image
                                                src="/mascot.png"
                                                alt="Candy Machine"
                                                width={150}
                                                height={150}
                                                className="rounded-full filter drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]"
                                            />

                                            {/* Bottom glow effect */}
                                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-yellow-500/30 rounded-full blur-xl"></div>
                                        </div>
                                    </div>

                                    {/* Decorative tech elements */}
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-500 rotate-45"></div>
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-500 rotate-45"></div>
                                    <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-yellow-500 rotate-45"></div>
                                    <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-yellow-500 rotate-45"></div>
                                </div>

                                <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-16 rounded-md text-lg transition-all">
                                    <Link href="/vault/play/how-to/gui">
                                        BEGIN
                                    </Link>
                                </button>
                            </div>

                            {/* Right Section */}
                            <div className="md:w-1/2">
                                <h2 className="text-2xl sm:text-[2.75rem] tracking-wide font-bold text-yellow-500 mb-2">
                                    Hello, I'm Candy Machine,
                                    <br />a Self Chain AI Agent
                                </h2>

                                <div className="mb-8">
                                    <h3 className="text-yellow-500 text-xl sm:text-2xl font-bold my-5">
                                        HOW TO PLAY
                                    </h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-yellow-500 mr-2">
                                                •
                                            </span>
                                            <span className="text-yellow-200">
                                                SOLVE THE PUZZLE TO WIN THE
                                                PRIZE
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-yellow-500 mr-2">
                                                •
                                            </span>
                                            <span className="text-yellow-200">
                                                YOU HAVE 5 CREDITS FOR THE GAME
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-yellow-500 mr-2">
                                                •
                                            </span>
                                            <span className="text-yellow-200">
                                                BUY MORE IF YOU RUN OUT
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-yellow-500 mr-2">
                                                •
                                            </span>
                                            <span className="text-yellow-200">
                                                FUND EXPIRES IN 2 DAYS
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mb-6">
                                    <div className="border border-yellow-500/30 px-6 py-2 rounded">
                                        <div className="flex justify-between items-center">
                                            <span className="text-yellow-500 tracking-wide font-bold text-base sm:text-2xl">
                                                PRIZE POOL
                                            </span>
                                            <span className="text-xl sm:text-3xl tracking-wider font-bold text-yellow-500">
                                                1,000 APT
                                            </span>
                                        </div>
                                    </div>
                                    <div className="sm:text-xl text-gray-400">
                                        FUNDED BY SELF CHAIN AI • PARTICIPATE AT
                                        YOUR OWN RISK
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <a
                                        href="#"
                                        className="text-yellow-500 hover:text-yellow-400 border border-yellow-500/50 rounded p-1"
                                    >
                                        <FaTwitter size={30} />
                                    </a>
                                    <a
                                        href="#"
                                        className="text-yellow-500 hover:text-yellow-400 border border-yellow-500/50 rounded p-1"
                                    >
                                        <FaFacebook size={30} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
