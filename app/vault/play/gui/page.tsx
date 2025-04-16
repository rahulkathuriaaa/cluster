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

import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import './styles.css'; // Import custom styles for scrollbar

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

  const router = useRouter();
  const [message, setMessage] = useState('');
  const [credits, setCredits] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<MessageType[]>([
    { type: 'bot', text: 'Hello! I am ZURA, the Vault Guardian. You have been awarded 5 credits for completing all verification tasks.' },
    { type: 'bot', text: 'Each message costs 1 credit. Use them wisely to convince me to unlock the vault.' }
  ]);
  
  // Ref for the messages container to enable auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll when conversation updates
  useEffect(() => {
    scrollToBottom();
  }, [conversation, isTyping]);

  useEffect(() => {
    // Check if user has completed all tasks and has been awarded credits
    const creditsAwarded = localStorage.getItem('credits_awarded');
    const userCredits = localStorage.getItem('credits') ? parseInt(localStorage.getItem('credits') || '0') : 0;
    
    if (!creditsAwarded || userCredits < 1) {
      // Redirect back to tasks page if not completed
      router.push('/vault/play');
    } else {
      setCredits(userCredits);
    }
  }, [router]);

  const fetchResponseFromAPI = async (userMessage: string) => {
    try {
      setIsTyping(true);
      
      // Get the current conversation history formatted for the API
      const conversationHistory = conversation.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // Add the new user message
      const messages = [
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];
      
      const response = await fetch('/api/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }
      
      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');
      
      let botResponse = '';
      let responseAdded = false;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode the chunk and append to result
        const chunk = new TextDecoder().decode(value);
        botResponse += chunk;
        
        // Update conversation with the current partial response
        setConversation(prev => {
          const newConv = [...prev];
          
          // If we haven't added a response message yet, add one now
          if (!responseAdded) {
            newConv.push({ type: 'bot' as const, text: botResponse });
            responseAdded = true;
          } else {
            // Otherwise update the last message
            if (newConv.length > 0) {
              const lastIndex = newConv.length - 1;
              if (newConv[lastIndex].type === 'bot') {
                newConv[lastIndex].text = botResponse;
              }
            }
          }
          
          // Keep only the last 4 messages
          while (newConv.length > 4) {
            newConv.shift();
          }
          
          return newConv;
        });
      }
      
      setIsTyping(false);
    } catch (error) {
      console.error('Error fetching response:', error);
      
      // Show error message
      setConversation(prev => {
        const newConv = [...prev];
        newConv.push({ type: 'bot' as const, text: 'I apologize, but I seem to be having trouble connecting to my systems. Please try again.' });
        
        // Keep only the last 4 messages
        while (newConv.length > 4) {
          newConv.shift();
        }
        
        return newConv;
      });
      
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || credits < 1 || !connected) return;
    
    // Add user message to conversation
    const newConversation = [...conversation, { type: 'user' as const, text: message }];
    
    // Keep only the last 4 messages if there are too many
    const trimmedConversation = [...newConversation];
    while (trimmedConversation.length > 4) {
      trimmedConversation.shift();
    }
    
    setConversation(trimmedConversation);
    
    // Reduce credits
    const newCredits = credits - 1;
    setCredits(newCredits);
    localStorage.setItem('credits', newCredits.toString());
    
    // Store the message before clearing it
    const userMessage = message;
    
    // Clear message input
    setMessage('');
    
    // Add empty bot message to show typing indicator at the right place
    setIsTyping(true);
    
    // Use the API for chat responses
    fetchResponseFromAPI(userMessage);
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
    <div className="h-screen flex items-center justify-center bg-black text-white p-4 overflow-hidden">
      <div className="w-full h-[calc(100vh-2rem)] max-w-6xl bg-black flex rounded-lg overflow-hidden border-2 border-[#1a1a1a] shadow-xl">
        {/* Left Panel */}
        <div className="w-[35%] border-r border-[#1a1a1a] p-6 flex flex-col bg-[#0a0a0a]">
          <div className="text-center mb-4">
            <div className="p-2">
              <h1 className="text-[#FFD700] text-4xl font-bold">ZURA:</h1>
              <h2 className="text-[#FFD700] text-lg font-bold">VAULT INTERFACE</h2>
            </div>
            
            <div className="bg-[#FFD700] text-black p-3 my-6 rounded">
              <div className="text-sm font-semibold">REMAINING CREDITS:</div>
              <div className="text-4xl font-bold">{credits}</div>
              <div className="text-xs font-semibold">1 CREDIT PER MESSAGE</div>
            </div>
          </div>
          
          <div className="mt-auto">
            <CustomWalletInfo />
            
            <button className="w-full bg-[#0a0a0a] border border-[#FFD700] text-[#FFD700] p-3 mb-4 text-sm font-bold hover:bg-[#111] transition-colors">
              [ {5 - credits} ATTEMPTS USED ]
            </button>
            
            <Link href="https://x.com/ClusterProtocol" target="_blank" className="block w-full">
              <button className="w-full bg-[#0a0a0a] border border-[#333] text-white p-3 mb-4 text-sm font-bold hover:bg-[#111] transition-colors flex items-center justify-between">
                FOLLOW ON X
                <span className="text-lg">&gt;</span>
              </button>
            </Link>
            
            <Link href="/vault/play" className="block w-full">
              <button className="w-full bg-[#0a0a0a] border border-[#333] text-white p-3 text-sm font-bold hover:bg-[#111] transition-colors">
                BACK TO TASKS
              </button>
            </Link>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="w-[65%] bg-[#0a0a0a] flex flex-col">
          {/* AI Avatar */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Zura container with backdrop */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Circular patterns */}
              <div className="absolute w-64 h-64 rounded-full border border-[#FFD700]/10 animate-pulse"></div>
              <div className="absolute w-72 h-72 rounded-full border border-[#FFD700]/5 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              
              {/* Tick marks around the circle */}
              <svg viewBox="0 0 400 400" className="absolute w-64 h-64">
                {Array.from({ length: 36 }).map((_, i) => {
                  const angle = (i * 10 * Math.PI) / 180;
                  const x1 = 200 + 150 * Math.cos(angle);
                  const y1 = 200 + 150 * Math.sin(angle);
                  const x2 = 200 + ((i % 6 === 0) ? 140 : 145) * Math.cos(angle);
                  const y2 = 200 + ((i % 6 === 0) ? 140 : 145) * Math.sin(angle);
                  
                  return (
                    <line 
                      key={i} 
                      x1={x1} 
                      y1={y1} 
                      x2={x2} 
                      y2={y2} 
                      stroke="#FFD700" 
                      strokeWidth={(i % 6 === 0) ? "1.2" : "0.8"} 
                      strokeOpacity={(i % 6 === 0) ? "0.3" : "0.2"} 
                    />
                  );
                })}
              </svg>
              
              {/* Zura avatar */}
              <div className="w-32 h-32 flex items-center justify-center">
                <Image
                  src="/mascot.png"
                  alt="Zura AI"
                  width={130}
                  height={130}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            {/* Messages - Fixed height container */}
            <div className="absolute bottom-8 left-6 right-6">
              <div className="flex flex-col space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-custom">
                {conversation.map((msg, index) => (
                  <div 
                    key={index}
                    className={`rounded-md p-2 max-w-[80%] ${
                      msg.type === 'bot' 
                        ? 'bg-[#222] text-white self-start' 
                        : 'bg-[#FFD700] text-black self-end'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} /> {/* Empty div for scrolling reference */}
              </div>
            </div>
          </div>
          
          {/* Input area */}
          <div className="p-4">
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={getPlaceholderText()}
                className="flex-1 bg-[#111] border border-[#333] text-white p-3 rounded-sm focus:outline-none focus:border-[#FFD700]"
                disabled={credits < 1 || !connected || isTyping}
              />
              <button 
                type="submit"
                disabled={!message.trim() || credits < 1 || !connected || isTyping}
                className={`ml-2 ${(credits > 0 && connected && !isTyping) ? 'bg-[#FFD700] hover:bg-[#e6c300]' : 'bg-[#555] cursor-not-allowed'} text-black font-bold py-3 px-4 rounded-sm transition-colors whitespace-nowrap`}
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
