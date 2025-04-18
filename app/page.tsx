import Image from "next/image";
import Link from "next/link";
import { VT323, Orbitron } from 'next/font/google';

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const orbitron = Orbitron({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: 'url(/grid-bg.svg)',
          backgroundSize: '100px 100px'
        }}
      ></div>

      {/* Advanced Gaming UI Border - Outer Frame */}
      <div className="absolute inset-4 z-10 pointer-events-none">
        {/* Top angled frame */}
        <div className="absolute top-0 left-[10%] right-[10%] h-[2px] bg-[#333]">
          <div className="absolute left-[40%] right-[40%] h-full bg-primary"></div>
        </div>
        
        {/* Bottom angled frame */}
        <div className="absolute bottom-0 left-[10%] right-[10%] h-[2px] bg-[#333]">
          <div className="absolute left-[40%] right-[40%] h-full bg-primary"></div>
        </div>
        
        {/* Left side frame */}
        <div className="absolute top-[10%] bottom-[10%] left-0 w-[2px] bg-[#333]">
          <div className="absolute top-[40%] bottom-[40%] w-full bg-primary"></div>
        </div>
        
        {/* Right side frame */}
        <div className="absolute top-[10%] bottom-[10%] right-0 w-[2px] bg-[#333]">
          <div className="absolute top-[40%] bottom-[40%] w-full bg-primary"></div>
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
      <div className="absolute top-6 left-6 w-10 h-10 bg-primary z-10"></div>
      <div className="absolute top-6 right-6 w-10 h-10 bg-primary z-10"></div>
      <div className="absolute bottom-6 left-6 w-10 h-10 bg-primary z-10"></div>
      <div className="absolute bottom-6 right-6 w-10 h-10 bg-primary z-10"></div>
      
      {/* Tech Panel Header with border */}
      <div className="absolute top-0 left-[15%] right-[15%] h-12 bg-transparent z-20">
        <div className="absolute inset-0 flex items-center border-b border-[#333]">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#444] to-transparent"></div>
        </div>
        
        {/* LUEDA Panel */}
        <div className="absolute top-0 left-[5%] w-[15%] h-full 
          border-l border-r border-b border-[#333] bg-[#0c0c0c]
          flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-[#555] to-transparent"></div>
          <span className={`text-[#777] text-xs uppercase ${orbitron.className}`}>LUEDA</span>
        </div>
        
        {/* TOOL LXP86F3 Panel */}
        <div className="absolute top-0 left-[30%] w-[40%] h-full 
          border-l border-r border-b border-[#333] bg-[#0c0c0c]
          flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-[#555] to-transparent"></div>
          <span className={`text-primary text-xs uppercase ${orbitron.className} tracking-wider`}>TOOL LXP86F3</span>
        </div>
      </div>
      
      {/* Left Side Panel */}
      <div className="absolute left-0 top-[15%] bottom-[15%] w-8 flex flex-col justify-between z-20">
        <div className="h-1/3 border-r border-[#333] flex items-center justify-center">
          <span className={`text-primary text-xs uppercase transform -rotate-90 ${orbitron.className}`}>LUCIDA</span>
        </div>
        <div className="h-1/3 border-r border-[#333] flex items-center justify-center">
          <span className={`text-[#777] text-xs uppercase transform -rotate-90 ${orbitron.className}`}>IO 01</span>
        </div>
      </div>
      
      {/* Right Side Panel */}
      <div className="absolute right-0 top-[15%] bottom-[15%] w-8 flex flex-col justify-between z-20">
        <div className="h-1/3 border-l border-[#333] flex items-center justify-center">
          <span className={`text-primary text-xs uppercase transform rotate-90 ${orbitron.className}`}>ID 086</span>
        </div>
        <div className="h-1/3 border-l border-[#333] flex items-center justify-center">
          <span className={`text-[#777] text-xs uppercase transform rotate-90 ${orbitron.className}`}>IO 58</span>
        </div>
      </div>
      
      {/* Bottom border tech label */}
      <div className="absolute bottom-3 right-[30%] z-20">
        <span className={`text-primary text-xs uppercase ${orbitron.className}`}>FCM LABS</span>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center p-6 sm:p-10 z-10 border-b border-[#1a1a1a]">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.svg" 
              alt="Cluster Protocol Logo" 
              width={90} 
              height={60} 
            />
            {/* <span className="text-lg font-bold uppercase ml-2">Cluster Protocol</span> */}
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <span className="uppercase text-[#666] text-xs">Lucida</span>
          <span className="uppercase text-primary text-xs">Trial Layers</span>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="#projects"
            className="bg-[#111] border border-[#222] text-xs uppercase px-4 py-2 rounded-sm hidden sm:block hover:border-primary transition-colors"
          >
            Projects
          </Link>
          <Link 
            href="#faq"
            className="bg-[#111] border border-[#222] text-xs uppercase px-4 py-2 rounded-sm hidden sm:block hover:border-primary transition-colors"
          >
            FAQ
          </Link>
          <Link 
            href="#launch"
            className="bg-[#111] border border-[#222] text-xs uppercase px-4 py-2 rounded-sm hidden sm:block hover:border-primary transition-colors"
          >
            Launch AI
          </Link>
          <Link 
            href="#connect"
            className="bg-[#111] border border-[#222] text-xs uppercase px-4 py-2 rounded-sm hidden sm:block hover:border-primary transition-colors"
          >
            Connect
          </Link>
          <Link 
            href="#yent"
            className="bg-primary text-black text-xs uppercase px-4 py-2 rounded-sm font-bold hover:bg-[#e6c300] transition-colors"
          >
            Yent
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col md:flex-row items-center justify-center p-6 sm:p-10 z-10 relative">
        <div className="flex-1 max-w-xl">
          <div className="flex items-center gap-2 mb-8">
            {/* CLUSTER PROTOCOL badge with mini.svg */}
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center">
                <Image 
                  src="/mini.svg" 
                  alt="Cluster Logo" 
                  width={48} 
                  height={48}
                />
              </div>
              <div className="ml-3 px-4 py-1.5 border border-primary rounded-r-full rounded-l-sm bg-black/30">
                <span className={`text-[#FFD700] text-sm font-bold tracking-wider ${orbitron.className}`}>CLUSTER PROTOCOL</span>
              </div>
            </div>
          </div>
          
          <h1 className={`pixel-text text-6xl sm:text-7xl md:text-8xl mb-8 font-normal text-white uppercase leading-none tracking-wide ${vt323.className}`} style={{ letterSpacing: '0.03em' }}>
            <span className="block mb-4">Convince Zura</span>
            <span className="block mb-4">To Unlock</span>
            <span className="block">The Vault</span>
          </h1>
          
          <button className={`bg-primary hover:bg-[#e0be00] text-black text-xl py-4 px-12 mt-14 mb-4 border-[3px] border-solid border-[#B39700] ${vt323.className}`} style={{ marginLeft: '8px' }}>
            <Link href="/vault" className="font-bold">[START CHALLENGE]</Link>
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center mt-10 md:mt-0">
          <div className="relative w-[450px] h-[450px]">
            {/* Circular dial with dashed/ticks marks - outer ring */}
            <div className="absolute inset-0 w-full h-full">
              <svg viewBox="0 0 450 450" className="w-full h-full absolute">
                <circle cx="225" cy="225" r="220" fill="transparent" stroke="#FFD700" strokeWidth="0.5" strokeOpacity="0.2" />
                
                {/* Create the tick marks around the circle */}
                {Array.from({ length: 96 }).map((_, i) => {
                  const angle = (i * 3.75 * Math.PI) / 180;
                  const x1 = 225 + 215 * Math.cos(angle);
                  const y1 = 225 + 215 * Math.sin(angle);
                  const x2 = 225 + ((i % 8 === 0) ? 200 : 210) * Math.cos(angle);
                  const y2 = 225 + ((i % 8 === 0) ? 200 : 210) * Math.sin(angle);
                  
                  return (
                    <line 
                      key={i} 
                      x1={x1} 
                      y1={y1} 
                      x2={x2} 
                      y2={y2} 
                      stroke="#FFD700" 
                      strokeWidth={(i % 8 === 0) ? "1.5" : "1"} 
                      strokeOpacity={(i % 8 === 0) ? "0.5" : "0.3"} 
                    />
                  );
                })}
                
                {/* Orbital ring around the mascot */}
                <ellipse 
                  cx="225" 
                  cy="225" 
                  rx="180" 
                  ry="40" 
                  fill="transparent" 
                  stroke="#FFD700" 
                  strokeWidth="0.8" 
                  strokeOpacity="0.4"
                  transform="rotate(30, 225, 225)"
                  className="animate-orbit"
                />
                
                {/* Second orbital ring - opposite direction */}
                <ellipse 
                  cx="225" 
                  cy="225" 
                  rx="170" 
                  ry="65" 
                  fill="transparent" 
                  stroke="#FFD700" 
                  strokeWidth="0.8" 
                  strokeOpacity="0.3"
                  transform="rotate(-15, 225, 225)"
                  className="animate-orbit-reverse"
                />
              </svg>
            </div>
            
            {/* Horizontal light beam */}
            <div className="absolute h-[2px] left-0 right-0 top-1/2 -translate-y-1/2 z-10">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-90"></div>
              <div className="h-4 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-20 blur-md -mt-2"></div>
            </div>
            
            {/* Circular glow behind the mascot */}
            <div className="absolute w-72 h-72 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/10 rounded-full blur-xl"></div>
            <div className="absolute w-64 h-64 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/5 rounded-full blur-md"></div>
            
            {/* Circular boundary around mascot */}
            <div className="absolute w-[340px] h-[340px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30"></div>
            <div className="absolute w-[360px] h-[360px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"></div>
            
            {/* Mascot container with shadow effect */}
            <div className="absolute inset-0 flex items-center justify-center animate-float" style={{ animationDuration: '6s' }}>
              <div className="relative">
                <Image
                  src="/mascot.png"
                  alt="Zura Mascot"
                  width={340}
                  height={340}
                  priority
                  className="filter drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]"
                />
              </div>
            </div>
            
            {/* Enhanced fire/glow under mascot */}
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-60 h-6">
              <div className="w-full h-full bg-[#FFA500] rounded-full blur-xl opacity-60"></div>
              <div className="w-full h-20 mt-1 bg-gradient-to-b from-[#FFA500]/40 to-transparent rounded-full blur-lg"></div>
              
              {/* Ripple circles */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] border border-[#FFA500]/40 rounded-full animate-ripple" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-[1px] border border-[#FFA500]/30 rounded-full animate-ripple" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] border border-[#FFA500]/20 rounded-full animate-ripple" style={{ animationDelay: '1s' }}></div>
            </div>
            
            {/* Small decorative elements */}
            <div className="absolute w-2 h-2 bg-primary rounded-full top-20 right-[30%] opacity-40 blur-sm animate-pulse-slow"></div>
            <div className="absolute w-1 h-1 bg-primary rounded-full bottom-32 left-[35%] opacity-60 blur-sm animate-pulse-slow" style={{ animationDelay: '0.7s' }}></div>
            <div className="absolute w-1.5 h-1.5 bg-primary rounded-full top-[40%] left-20 opacity-50 blur-sm animate-pulse-slow" style={{ animationDelay: '1.3s' }}></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-between items-center p-6 sm:p-10 z-10 border-t border-[#1a1a1a]">
        <div>
          <span className="text-xs text-[#666]">For Games</span>
        </div>
        <div>
          <span className="text-xs text-[#666]">006EP55</span>
        </div>
      </footer>
    </div>
  );
}
