"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ZuraVaultInterface() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [credits, setCredits] = useState(0);
  const [conversation, setConversation] = useState([
    { type: 'bot', text: 'Hello! I am ZURA, the Vault Guardian. You have been awarded 5 credits for completing all verification tasks.' },
    { type: 'bot', text: 'Each message costs 1 credit. Use them wisely to convince me to unlock the vault.' }
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || credits < 1) return;
    
    // Add user message to conversation
    const newConversation = [...conversation, { type: 'user', text: message }];
    
    // Keep only the last 4 messages if there are too many
    if (newConversation.length > 4) {
      newConversation.shift();
    }
    
    setConversation(newConversation);
    
    // Reduce credits
    const newCredits = credits - 1;
    setCredits(newCredits);
    localStorage.setItem('credits', newCredits.toString());
    
    // Clear message input
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      let response = "I'm analyzing your request. Please continue.";
      
      // Simple response logic based on keywords
      if (message.toLowerCase().includes('unlock') || message.toLowerCase().includes('open')) {
        response = "The vault requires specific authorization. Please provide more details about your identity.";
      } else if (message.toLowerCase().includes('please') || message.toLowerCase().includes('help')) {
        response = "I appreciate your politeness, but I need verification of authority to proceed.";
      } else if (message.toLowerCase().includes('password') || message.toLowerCase().includes('code')) {
        response = "There is no simple password. The vault security system requires proper verification protocols.";
      }
      
      let updatedConversation = [...newConversation, { type: 'bot', text: response }];
      
      // Keep only the last 4 messages
      if (updatedConversation.length > 4) {
        updatedConversation.shift();
      }
      
      setConversation(updatedConversation);
    }, 1000);
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
              <div className="flex flex-col space-y-3">
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
                placeholder={credits > 0 ? "Type your message to ZURA..." : "Out of credits!"}
                className="flex-1 bg-[#111] border border-[#333] text-white p-3 rounded-sm focus:outline-none focus:border-[#FFD700]"
                disabled={credits < 1}
              />
              <button 
                type="submit"
                disabled={!message.trim() || credits < 1}
                className={`ml-2 ${credits > 0 ? 'bg-[#FFD700] hover:bg-[#e6c300]' : 'bg-[#555] cursor-not-allowed'} text-black font-bold py-3 px-4 rounded-sm transition-colors whitespace-nowrap`}
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
