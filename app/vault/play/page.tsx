"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function VaultPlay() {
  const router = useRouter();
  const { data: session } = useSession();
  const [twitterCompleted, setTwitterCompleted] = useState(false);
  const [telegramCompleted, setTelegramCompleted] = useState(false);
  const [followCompleted, setFollowCompleted] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  useEffect(() => {
    // Check if user is authenticated with Twitter
    if (session) {
      setTwitterCompleted(true);
    }
    
    // Check if telegram joined status is stored in localStorage
    const telegramJoined = localStorage.getItem('telegram_joined');
    if (telegramJoined === 'true') {
      setTelegramCompleted(true);
    }
    
    // Check if follow status is stored in localStorage
    const followed = localStorage.getItem('cluster_followed');
    if (followed === 'true') {
      setFollowCompleted(true);
    }

    // Check if credits are already awarded
    const creditsAwarded = localStorage.getItem('credits_awarded');
    if (creditsAwarded === 'true') {
      setAllCompleted(true);
    }
  }, [session]);

  // Check if all tasks are completed
  useEffect(() => {
    if (twitterCompleted && telegramCompleted && followCompleted) {
      setAllCompleted(true);
      
      // Award credits if not already awarded
      if (localStorage.getItem('credits_awarded') !== 'true') {
        // Set credits in localStorage
        const currentCredits = localStorage.getItem('credits') ? parseInt(localStorage.getItem('credits') || '0') : 0;
        localStorage.setItem('credits', (currentCredits + 5).toString());
        localStorage.setItem('credits_awarded', 'true');
      }
    }
  }, [twitterCompleted, telegramCompleted, followCompleted]);

  const handleTelegramClick = () => {
    window.open('https://t.me/+NTDIFatu1LcwMWE1', '_blank');
    // Store joined status in localStorage
    localStorage.setItem('telegram_joined', 'true');
    setTelegramCompleted(true);
  };

  const handleFollowClick = () => {
    window.open('https://x.com/ClusterProtocol', '_blank');
    // Store follow status in localStorage
    localStorage.setItem('cluster_followed', 'true');
    setFollowCompleted(true);
  };

  const handleProceedClick = () => {
    if (allCompleted) {
      router.push('/vault/play/gui');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-0 m-0">
      <div className="w-full max-w-5xl relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 right-0 border-t border-yellow-500/30 w-full"></div>
        <div className="absolute top-0 left-0 bottom-0 border-l border-yellow-500/30 h-full"></div>
        <div className="absolute bottom-0 right-0 h-20 w-20 border-r border-b border-yellow-500/30 rounded-tr-3xl"></div>
        <div className="absolute top-0 right-0 h-full border-r border-yellow-500/30"></div>
        <div className="absolute bottom-0 left-0 right-0 border-b border-yellow-500/30 w-full"></div>
        
        <div className="flex flex-col md:flex-row border border-yellow-500/30 rounded-lg overflow-hidden mx-4">
          {/* Left Section */}
          <div className="p-8 border-r border-yellow-500/30 flex-1 bg-gradient-to-b from-black to-gray-900">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-6xl font-bold mb-2 text-yellow-400 tracking-wider">CATALYST</h1>
              <h1 className="text-6xl font-bold mb-4 text-yellow-400 tracking-wider">AI VAULT</h1>
              <p className="text-2xl mb-10 text-yellow-400">$1,000 in $APT</p>
              
              <div className="relative w-52 h-52 mb-12">
                {/* Mascot image with glowing effect */}
                {/* <div className="absolute inset-0 rounded-full border-2 border-yellow-500/70 flex items-center justify-center z-10">
                  <div className="absolute inset-0 rounded-full border border-yellow-500/30 animate-pulse"></div>
                  <div className="absolute inset-0 rounded-full border border-yellow-500/20 animate-pulse" style={{animationDelay: '300ms'}}></div>
                  <div className="absolute inset-0 rounded-full border border-yellow-500/10 animate-pulse" style={{animationDelay: '600ms'}}></div>
                  
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <Image 
                      src="/mascot.png" 
                      alt="AI Mascot"
                      width={200}
                      height={200}
                      className="object-contain"
                      priority
                    />
                  </div>
                </div> */}
                 <div className="absolute inset-0 flex items-center justify-center animate-float" style={{ animationDuration: '6s' }}>
              <div className="relative">
                <Image
                  src="/mascot.png"
                  alt="Zura Mascot"
                  width={280}
                  height={280}
                  priority
                  className="filter drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                />
              </div>
            </div>
                
                {/* Bottom glow */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-yellow-500/50 rounded-full blur-sm"></div>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-500/70 rounded-full"></div>
              </div>

              <p className="mb-10 text-yellow-400/90 text-lg">
                To enter this vault, complete<br />
                the following access tasks.
              </p>

              <button className="w-full py-4 px-6 border border-yellow-500/70 text-yellow-400 hover:bg-yellow-500/10 transition-all rounded-sm text-xl font-medium tracking-wider"
                   onClick={handleProceedClick}
                   disabled={!allCompleted}
                   >
                              {allCompleted ? 'PROCEED TO VAULT (5 CREDITS AWARDED)' : 'COMPLETE ALL TASKS TO PROCEED'}

              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="p-8 flex-1 bg-black relative">
            <h2 className="text-xl font-semibold mb-10 text-yellow-400 border-b border-yellow-500/30 pb-2 tracking-wider">
              QUESTS VERIFICATION
              <div className="absolute top-8 right-8 w-32 h-px bg-yellow-500/50"></div>
            </h2>
            
            <div className="space-y-4 mb-10">
              {/* Twitter Quest */}
              <div 
                className="border border-yellow-500/30 rounded-md p-4 flex items-center bg-black/40 hover:bg-black/60 transition cursor-pointer"
                onClick={() => !twitterCompleted && signIn('twitter')}
              >
                <div className="bg-transparent p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-yellow-400">Connect Twitter</h3>
                  <p className="text-sm text-yellow-400/70">{twitterCompleted ? 'Verified' : 'Sign in with Twitter'}</p>
                </div>
                {twitterCompleted && (
                  <div className="text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Telegram Quest */}
              <div 
                className="border border-yellow-500/30 rounded-md p-4 flex items-center bg-black/40 hover:bg-black/60 transition cursor-pointer"
                onClick={handleTelegramClick}
              >
                <div className="bg-transparent p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.57-1.39-.93-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.62-2.4 2.68-2.6.01-.03.01-.14-.05-.2s-.16-.05-.23-.03c-.09.03-1.49.95-4.22 2.77-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.62-.21-1.11-.32-1.07-.68.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-yellow-400">Join Telegram Group</h3>
                  <p className="text-sm text-yellow-400/70">{telegramCompleted ? 'Joined' : 'Join Now'}</p>
                </div>
                {telegramCompleted && (
                  <div className="text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Follow Cluster Protocol Quest */}
              <div 
                className="border border-yellow-500/30 rounded-md p-4 flex items-center bg-black/40 hover:bg-black/60 transition cursor-pointer"
                onClick={handleFollowClick}
              >
                <div className="bg-transparent p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-yellow-400">Follow Cluster Protocol on Twitter</h3>
                  <p className="text-sm text-yellow-400/70">{followCompleted ? 'Followed' : 'Follow Now'}</p>
                </div>
                {followCompleted && (
                  <div className="text-yellow-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <button 
              className={`w-full mt-8 py-4 px-6 border border-yellow-500/70 ${allCompleted ? 'bg-yellow-500/30 text-yellow-100' : 'text-yellow-400'} hover:bg-yellow-500/10 transition-all rounded-sm text-xl font-medium tracking-wider ${allCompleted ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              onClick={handleProceedClick}
              disabled={!allCompleted}
            >
              {allCompleted ? 'PROCEED TO VAULT (5 CREDITS AWARDED)' : 'COMPLETE ALL TASKS TO PROCEED'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
