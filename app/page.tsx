import Image from "next/image";
import Link from "next/link";

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

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-6 h-6 bg-primary"></div>
      <div className="absolute top-0 right-0 w-6 h-6 bg-primary"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 bg-primary"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary"></div>

      {/* Header */}
      <header className="flex justify-between items-center p-6 sm:p-10 z-10 border-b border-[#1a1a1a]">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <Image 
              src="/cluster-logo.svg" 
              alt="Cluster Protocol Logo" 
              width={32} 
              height={32} 
            />
            <span className="text-lg font-bold uppercase ml-2">Cluster Protocol</span>
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
            {/* CUSTT PROTOCOL badge styled like the image */}
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full border-2 border-primary bg-black/50 flex items-center justify-center">
                <div className="w-6 h-6 grid grid-cols-2 grid-rows-2 gap-[2px]">
                  <div className="bg-primary"></div>
                  <div className="bg-primary"></div>
                  <div className="bg-primary"></div>
                  <div className="bg-primary"></div>
                </div>
              </div>
              <div className="ml-3 px-4 py-1.5 border border-primary rounded-r-full rounded-l-sm bg-black/30">
                <span className="text-primary text-sm font-bold tracking-wider">CUSTT PROTIOCLE</span>
              </div>
            </div>
          </div>
          
          <h1 className="pixel-text text-3xl sm:text-4xl md:text-5xl mb-6 leading-relaxed font-normal text-white">
            <span className="block mb-3">Convince Zura</span>
            <span className="block mb-3">To Unlock</span>
            <span className="block">The Vault</span>
          </h1>
          
          <button className="pixel-text text-sm bg-primary hover:bg-[#e0be00] text-black font-normal py-3 px-8 mt-10 mb-4 transition-all border-2 border-solid border-[#B39700] relative overflow-hidden">
            <Link href="/vault/play" className="relative z-10">[START CHALLENGE]</Link>
            <span className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.3)] to-transparent opacity-50"></span>
            <span className="absolute w-2 h-2 bg-[#7A6700] top-0 left-0"></span>
            <span className="absolute w-2 h-2 bg-[#7A6700] top-0 right-0"></span>
            <span className="absolute w-2 h-2 bg-[#7A6700] bottom-0 left-0"></span>
            <span className="absolute w-2 h-2 bg-[#7A6700] bottom-0 right-0"></span>
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
            <div className="absolute w-64 h-64 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/10 rounded-full blur-xl"></div>
            <div className="absolute w-56 h-56 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/5 rounded-full blur-md"></div>
            
            {/* Mascot container with shadow effect */}
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
            
            {/* Bottom light pool/reflection */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-2">
              <div className="w-full h-full bg-primary rounded-full blur-xl opacity-30"></div>
              <div className="w-full h-12 mt-1 bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-lg"></div>
              
              {/* Ripple circles */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] border border-primary/30 rounded-full animate-ripple" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] border border-primary/20 rounded-full animate-ripple" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] border border-primary/10 rounded-full animate-ripple" style={{ animationDelay: '1s' }}></div>
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
