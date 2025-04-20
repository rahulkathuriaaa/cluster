"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    useWallet,
    WalletReadyState
  } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useChat } from 'ai/react';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import './styles.css'; // Import custom styles for scrollbar

// Add this import for global styles to prevent layout shift
// import { useEffect } from 'react'; // This should already be imported at the top

// This function adds a class to the body to prevent layout shift when scrollbars appear
const usePreventLayoutShift = () => {
  useEffect(() => {
    // Add class to html that sets a consistent scrollbar width
    document.documentElement.classList.add('scrollbar-stable');
    
    // Clean up on unmount
    return () => {
      document.documentElement.classList.remove('scrollbar-stable');
    };
  }, []);
};

// Custom component to show wallet balance in the UI style
const CustomWalletInfo = () => {
  const { account, connected, wallet, network } = useWallet();
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    if (connected && account?.address) {
      // Fetch balance from Aptos network
      fetch(`https://fullnode.testnet.aptoslabs.com/v1/accounts/${account.address}/resources`)
        .then(response => response.json())
        .then(resources => {
          const coinResource = resources.find(
            (r: any) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
          );
          if (coinResource) {
            const rawBalance = coinResource.data.coin.value;
            // Convert from octas (10^8) to APT
            const formattedBalance = (parseInt(rawBalance) / 100000000).toFixed(4);
            setBalance(formattedBalance);
          }
        })
        .catch(error => {
          console.error('Error fetching balance:', error);
        });
    } else {
      setBalance('0');
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
      <div className="bg-[#111] border border-[#333] p-3 rounded mb-2">
        <div className="text-sm text-[#FFD700] font-semibold">WALLET BALANCE:</div>
        <div className="text-2xl font-bold text-white">{balance} APT</div>
        <div className="text-xs text-gray-400 truncate">
          {account?.address?.slice(0, 6)}...{account?.address?.slice(-4)}
        </div>
      </div>
      <WalletSelector />
    </div>
  );
};

// Typing indicator component
const TypingIndicator = () => {
  return (
    <div className="rounded-md p-3 max-w-[80%] bg-[#222] text-white self-start flex items-center">
      <div className="flex space-x-1">
        <div className="h-2 w-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="h-2 w-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="h-2 w-2 bg-[#FFD700] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="ml-2 text-sm text-gray-300">ZURA is thinking...</span>
    </div>
  );
};

// Define types for messages
type MessageType = {
  type: 'user' | 'bot';
  text: string;
};

export default function ZuraVaultInterface() {
  const { account, connected, signAndSubmitTransaction } = useWallet();

  // Use our custom hook to prevent layout shift
  usePreventLayoutShift();

  const router = useRouter();
  const [credits, setCredits] = useState(0);
  const [isBuying, setIsBuying] = useState(false);
  const [buyAmount, setBuyAmount] = useState(1);
  const [isSendingAPT, setIsSendingAPT] = useState(false);
  
  // Ref for the messages container to enable auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configure the chat hook from AI library
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit: aiHandleSubmit,
    isLoading,
    setMessages
  } = useChat({
    api: "/api/hello",
    onError: (error) => {
      console.error("Chat API error:", error);
    },
    onFinish: () => {
      // If needed, perform actions when response is complete
    },
    streamMode: "text"
  });

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll when conversation updates
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Check if user has completed all tasks and has been awarded credits
    const creditsAwarded = localStorage.getItem('credits_awarded');
    const userCredits = localStorage.getItem('credits') ? parseInt(localStorage.getItem('credits') || '0') : 0;
    
    console.log("GUI page loaded - Credits awarded:", creditsAwarded, "User credits:", userCredits);
    
    if (!creditsAwarded) {
      // Redirect back to tasks page if tasks not completed
      console.log("Tasks not completed, redirecting back");
      router.push('/vault/play');
    } else {
      // Set credits from localStorage
      setCredits(userCredits);
      
      // Add initial messages if there are none
      if (messages.length === 0) {
        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: 'Hello! I am ZURA, the Vault Guardian. You have been awarded 5 credits for completing all verification tasks.'
          },
          {
            id: '2',
            role: 'assistant',
            content: 'Each message costs 1 credit. Use them wisely to convince me to unlock the vault.'
          }
        ]);
      }
    }
  }, [router, messages.length, setMessages]);

  // Custom handle submit to manage credits and handling
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || credits < 1 || !connected || isLoading) return;
    
    // Reduce credits
    const newCredits = credits - 1;
    setCredits(newCredits);
    localStorage.setItem('credits', newCredits.toString());
    
    // Let the AI library handle the API communication
    aiHandleSubmit(e);
  };

  const handleBuyCredits = async () => {
    if (!connected || !account?.address) return;
    
    setIsBuying(true);
    
    try {
      const amount = buyAmount * 0.05; // 0.05 APT per credit
      
      // Using type assertion to bypass type checking
      const transaction = {
        data: {
          function: "0x1::aptos_account::transfer",
          typeArguments: [],
          functionArguments: [
            "0xbb629c088b696f8c3500d0133692a1ad98a90baef9d957056ec4067523181e9a", // recipient address
            (amount * 100000000).toString() // convert to octas (APT * 10^8)
          ],
        }
      } as any; // Type assertion to bypass type checking
      
      const response = await signAndSubmitTransaction(transaction);
      
      // Wait for transaction to confirm
      await fetch(`https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/${response.hash}`, {
        method: 'GET',
      });
      
      // Update credits
      const newCredits = credits + buyAmount;
      setCredits(newCredits);
      localStorage.setItem('credits', newCredits.toString());
      
      // Confirm purchase in conversation
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Thank you for your purchase! ${buyAmount} credit${buyAmount > 1 ? 's' : ''} added to your balance.`
        }
      ]);
      
    } catch (error) {
      console.error('Transaction failed:', error);
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Transaction failed. Please try again later.'
        }
      ]);
    } finally {
      setIsBuying(false);
      setBuyAmount(1);
    }
  };

  const sendDonation = async () => {
    if (!connected || !account?.address) return;
    
    setIsSendingAPT(true);
    
    try {
      // Hardcoded wallet address and amount
      const recipientAddress = "0xbb629c088b696f8c3500d0133692a1ad98a90baef9d957056ec4067523181e9a";
      const amount = 0.5; // 0.5 APT
      
      // Using type assertion to bypass type checking
      const transaction = {
        data: {
          function: "0x1::aptos_account::transfer",
          typeArguments: [],
          functionArguments: [
            recipientAddress,
            (amount * 100000000).toString() // convert to octas (APT * 10^8)
          ],
        }
      } as any; // Type assertion to bypass type checking
      
      const response = await signAndSubmitTransaction(transaction);
      
      // Wait for transaction to confirm
      await fetch(`https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/${response.hash}`, {
        method: 'GET',
      });
      
      // Update credits
      const newCredits = credits + 1;
      setCredits(newCredits);
      localStorage.setItem('credits', newCredits.toString());
      
      // Confirm purchase in conversation
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Thank you for your purchase! 1 credit added to your balance.`
        }
      ]);
      
    } catch (error) {
      console.error('Transaction failed:', error);
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Transaction failed. Please try again later.'
        }
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
      return "Type your message to ZURA...";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-2 overflow-hidden">
      <div className="w-full max-h-[90vh] max-w-6xl bg-black flex rounded-lg overflow-hidden border-2 border-[#1a1a1a] shadow-xl">
        {/* Left Panel */}
        <div className="w-1/3 border-r border-[#1a1a1a] p-4 flex flex-col bg-[#0a0a0a] overflow-y-auto">
          <div className="text-center mb-3">
            <div className="p-1">
              <h1 className="text-[#FFD700] text-3xl font-bold">ZURA:</h1>
              <h2 className="text-[#FFD700] text-lg font-bold">VAULT INTERFACE</h2>
            </div>
            
            <div className="bg-[#FFD700] text-black p-3 my-4 rounded">
              <div className="text-sm font-semibold">REMAINING CREDITS:</div>
              <div className="text-4xl font-bold">{credits}</div>
              <div className="text-xs font-semibold">1 CREDIT PER MESSAGE</div>
            </div>
            
            {/* Buy Credits Button - Show when credits are low */}
            {credits < 2 && connected && (
              <div className="my-3">
                <div className="flex items-center justify-center mb-2">
                  <button 
                    onClick={() => setBuyAmount(Math.max(1, buyAmount - 1))}
                    className="bg-[#222] text-white px-3 py-1 rounded-l"
                    disabled={isBuying || buyAmount <= 1}
                  >
                    -
                  </button>
                  <div className="bg-[#111] text-white px-4 py-1">
                    {buyAmount} credit{buyAmount > 1 ? 's' : ''}
                  </div>
                  <button 
                    onClick={() => setBuyAmount(buyAmount + 1)}
                    className="bg-[#222] text-white px-3 py-1 rounded-r"
                    disabled={isBuying}
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleBuyCredits} 
                  disabled={isBuying || !connected}
                  className={`w-full ${isBuying ? 'bg-[#333]' : 'bg-[#FFD700] hover:bg-[#e6c300]'} text-black p-2 rounded text-sm font-bold transition-colors flex items-center justify-center`}
                >
                  {isBuying ? 'PROCESSING...' : `BUY CREDITS (${(buyAmount * 0.05).toFixed(2)} APT)`}
                </button>
                <div className="text-xs text-gray-400 mt-1 text-center">
                  0.05 APT per credit
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-auto">
            <CustomWalletInfo />
            
            <button className="w-full bg-[#0a0a0a] border border-[#FFD700] text-[#FFD700] p-2 mb-3 text-sm font-bold hover:bg-[#111] transition-colors">
              [ {5 - credits} ATTEMPTS USED ]
            </button>
            
            <button 
              onClick={sendDonation}
              disabled={isSendingAPT || !connected}
              className={`w-full ${isSendingAPT ? 'bg-[#333]' : 'bg-[#FFD700] hover:bg-[#e6c300]'} text-black p-2 mb-3 text-sm font-bold transition-colors flex items-center justify-between`}
            >
              {isSendingAPT ? 'PROCESSING TRANSACTION...' : 'BUY 1 CREDIT (0.5 APT)'}
              <span className="text-lg">&gt;</span>
            </button>
            
            <Link href="https://x.com/ClusterProtocol" target="_blank" className="block w-full">
              <button className="w-full bg-[#0a0a0a] border border-[#333] text-white p-2 mb-3 text-sm font-bold hover:bg-[#111] transition-colors flex items-center justify-between">
                FOLLOW ON X
                <span className="text-lg">&gt;</span>
              </button>
            </Link>
            
            <Link href="/vault/play" className="block w-full">
              <button className="w-full bg-[#0a0a0a] border border-[#333] text-white p-2 text-sm font-bold hover:bg-[#111] transition-colors">
                BACK TO TASKS
              </button>
            </Link>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="w-2/3 bg-[#0a0a0a] flex flex-col">
          {/* Content area with fixed layout */}
          <div className="flex-1 relative flex flex-col overflow-hidden">
            {/* Prize Pool Section at the top */}
            <div className="bg-black border-b border-[#333] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#FFD700] text-2xl font-bold">PRIZE POOL</h3>
                  <p className="text-gray-400">Solve the vault puzzle to win</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-white">1,000 APT</div>
                  <div className="flex items-center justify-end text-[#FFD700]">
                    <div className="w-2 h-2 bg-[#FFD700] rounded-full mr-2"></div>
                    ACTIVE CHALLENGE
                  </div>
                </div>
              </div>
            </div>
            
            {/* Messages area - flex grow to fill available space */}
            <div className="flex-grow px-6 flex flex-col overflow-hidden relative">
              {/* Enhanced mascot background with effects */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Circular dial with ticks - similar to homepage */}
                <svg viewBox="0 0 400 400" className="absolute w-full h-full opacity-5">
                  <circle cx="200" cy="200" r="180" fill="transparent" stroke="#FFD700" strokeWidth="0.5" strokeOpacity="0.2" />
                  
                  {/* Tick marks around the circle */}
                  {Array.from({ length: 72 }).map((_, i) => {
                    const angle = (i * 5 * Math.PI) / 180;
                    const x1 = 200 + 175 * Math.cos(angle);
                    const y1 = 200 + 175 * Math.sin(angle);
                    const x2 = 200 + ((i % 8 === 0) ? 160 : 168) * Math.cos(angle);
                    const y2 = 200 + ((i % 8 === 0) ? 160 : 168) * Math.sin(angle);
                    
                    return (
                      <line 
                        key={i} 
                        x1={x1} 
                        y1={y1} 
                        x2={x2} 
                        y2={y2} 
                        stroke="#FFD700" 
                        strokeWidth={(i % 8 === 0) ? "1" : "0.5"} 
                        strokeOpacity={(i % 8 === 0) ? "0.4" : "0.2"} 
                      />
                    );
                  })}
                  
                  {/* Orbital rings */}
                  <ellipse 
                    cx="200" 
                    cy="200" 
                    rx="140" 
                    ry="30" 
                    fill="transparent" 
                    stroke="#FFD700" 
                    strokeWidth="0.8" 
                    strokeOpacity="0.3"
                    transform="rotate(30, 200, 200)"
                    className="animate-orbit"
                  />
                  
                  <ellipse 
                    cx="200" 
                    cy="200" 
                    rx="120" 
                    ry="50" 
                    fill="transparent" 
                    stroke="#FFD700" 
                    strokeWidth="0.6" 
                    strokeOpacity="0.2"
                    transform="rotate(-15, 200, 200)"
                    className="animate-orbit-reverse"
                  />
                </svg>
                
                {/* Circular glow behind the mascot */}
                <div className="absolute w-64 h-64 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FFD700]/5 rounded-full blur-xl"></div>
                <div className="absolute w-56 h-56 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FFD700]/3 rounded-full blur-md"></div>
                
                {/* Mascot with animation and enhanced effects */}
                <div className="absolute inset-0 flex items-center justify-center animate-float" style={{ animationDuration: '10s' }}>
                  <Image
                    src="/mascot.png"
                    alt="Zura Background"
                    width={280}
                    height={280}
                    className="object-contain opacity-10 filter drop-shadow-[0_0_30px_rgba(255,215,0,0.15)]"
                  />
                </div>
                
                {/* Horizontal light beam */}
                <div className="absolute h-[1px] left-0 right-0 top-1/2 -translate-y-1/2 opacity-10">
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
                  <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-10 blur-sm -mt-1"></div>
                </div>
                
                {/* Small decorative elements */}
                <div className="absolute w-1.5 h-1.5 bg-[#FFD700] rounded-full top-20 right-[30%] opacity-5 blur-sm animate-pulse-slow"></div>
                <div className="absolute w-1 h-1 bg-[#FFD700] rounded-full bottom-32 left-[35%] opacity-7 blur-sm animate-pulse-slow" style={{ animationDelay: '0.7s' }}></div>
                <div className="absolute w-1 h-1 bg-[#FFD700] rounded-full top-[40%] left-20 opacity-6 blur-sm animate-pulse-slow" style={{ animationDelay: '1.3s' }}></div>
              </div>
              
              <div className="flex-1 overflow-y-auto scrollbar-custom flex flex-col space-y-3 py-4 z-10">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`rounded-md p-2 max-w-[80%] ${
                      msg.role === 'user' 
                        ? 'bg-[#FFD700] text-black self-end' 
                        : 'bg-[#222] text-white self-start'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} /> {/* Empty div for scrolling reference */}
              </div>
            </div>
          </div>
          
          {/* Input area - Fixed at bottom */}
          <div className="p-3 border-t border-[#1a1a1a] flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder={getPlaceholderText()}
                className="flex-1 bg-[#111] border border-[#333] text-white p-2 rounded-sm focus:outline-none focus:border-[#FFD700]"
                disabled={credits < 1 || !connected || isLoading}
              />
              <button 
                type="submit"
                disabled={!input.trim() || credits < 1 || !connected || isLoading}
                className={`ml-2 ${(credits > 0 && connected && !isLoading) ? 'bg-[#FFD700] hover:bg-[#e6c300]' : 'bg-[#555] cursor-not-allowed'} text-black font-bold py-2 px-3 rounded-sm transition-colors whitespace-nowrap`}
              >
                SEND MESSAGE {credits > 0 ? `(-1)` : `(0)`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
