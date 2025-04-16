import Image from "next/image";
import Link from "next/link";

export default function VaultSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141429] to-[#2d1c3a] text-white relative overflow-hidden px-4 py-8">
      {/* Header Navigation */}
      <header className="max-w-7xl mx-auto flex justify-between items-center py-4 border-b border-white/10">
        <div className="flex items-center">
          <div className="w-7 h-7 grid grid-cols-2 grid-rows-2 gap-[2px] mr-3">
            <div className="bg-white"></div>
            <div className="bg-white"></div>
            <div className="bg-white"></div>
            <div className="bg-white"></div>
          </div>
          <span className="text-xl font-semibold">Cluster Protocol</span>
        </div>
        
        <div className="flex items-center space-x-10">
          <Link href="#" className="hover:text-primary">
            Cluster Products
          </Link>
          <Link href="#" className="hover:text-primary">
            FAQ
          </Link>
          <Link href="#" className="bg-[#F8D377] text-[#111] px-5 py-2 rounded-md font-medium">
            Connect Wallet
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto mt-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Choose Your AI Vault</h1>
        <p className="text-[#a8b3cf] max-w-2xl mx-auto mb-16">
          Walaee Naliy lie Cuponeoda quat tpene locondi pouses Vuud aiellers
          <br />lnyie gratis a fingerpenganğao
        </p>

        {/* Vault Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Project Vault Card */}
          <div className="border border-[#2a2d6a] rounded-2xl bg-gradient-to-b from-[#1e1d42] to-[#14132a] p-5 pb-8 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Project Vault</h2>
              <p className="text-[#a8b3cf] text-sm mb-6">Presented by ProjectName</p>
              
              <div className="h-64 flex justify-center items-center relative">
                <div className="w-44 h-44 rounded-full bg-[#0e0d28] flex justify-center items-center">
                  <div className="absolute w-36 h-36 rounded-full border border-[#2763f8]/30"></div>
                  <div className="absolute w-40 h-8 bg-[#2763f8]/20 blur-md -mb-16"></div>
                  <div className="absolute w-full h-full flex justify-center items-center">
                    <Image 
                      src="/robot1.png" 
                      alt="Project Vault Robot" 
                      width={120} 
                      height={120} 
                      className="mb-3"
                    />
                  </div>
                </div>
                <div className="absolute top-6 right-12">
                  <div className="w-10 h-10 rounded-md bg-[#194278] flex items-center justify-center">
                    <div className="w-6 h-6 grid grid-cols-2 grid-rows-2 gap-[2px]">
                      <div className="bg-[#5a98e6]"></div>
                      <div className="bg-[#5a98e6]"></div>
                      <div className="bg-[#5a98e6]"></div>
                      <div className="bg-[#5a98e6]"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-xl font-bold mb-6">$1,000 in Tokens</div>
              
              <button className="bg-[#1f1d56] hover:bg-[#2a2878] text-white w-full py-3 rounded-md flex items-center justify-center space-x-2 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 6V18L17 12L7 6Z" fill="white"/>
                </svg>
                <span>Play</span>
              </button>
            </div>
          </div>
          
          {/* Router AI Vault Card */}
          <div className="border border-[#2a2d6a] rounded-2xl bg-gradient-to-b from-[#1e1d42] to-[#14132a] p-5 pb-8 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Router AI Vault</h2>
              <p className="text-[#a8b3cf] text-sm mb-6">Presented by ProjectName</p>
              
              <div className="h-64 flex justify-center items-center relative">
                <div className="w-44 h-44 rounded-full bg-[#0e0d28] flex justify-center items-center">
                  <div className="absolute w-36 h-36 rounded-full border border-[#2763f8]/30"></div>
                  <div className="absolute w-40 h-8 bg-[#2763f8]/20 blur-md -mb-16"></div>
                  <div className="absolute w-full h-full flex justify-center items-center">
                    <Image 
                      src="/robot2.png" 
                      alt="Router AI Vault Robot" 
                      width={120} 
                      height={120} 
                      className="mb-3"
                    />
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                  <Image 
                    src="/images/coin.svg" 
                    alt="Coin" 
                    width={50} 
                    height={50}
                  />
                </div>
              </div>
              
              <div className="text-xl font-bold mb-6">$1,000 in ProductName</div>
              
              <button className="bg-[#1f1d56] hover:bg-[#2a2878] text-white w-full py-3 rounded-md flex items-center justify-center space-x-2 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 6V18L17 12L7 6Z" fill="white"/>
                </svg>
                <span>Play</span>
              </button>
            </div>
          </div>
          
          {/* Protector Vault Card */}
          <div className="border border-[#2a2d6a] rounded-2xl bg-gradient-to-b from-[#1e1d42] to-[#14132a] p-5 pb-8 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Protector Vault</h2>
              <p className="text-[#a8b3cf] text-sm mb-6">Presented by ProjectName</p>
              
              <div className="h-64 flex justify-center items-center relative">
                <div className="w-44 h-44 rounded-full bg-[#0e0d28] flex justify-center items-center">
                  <div className="absolute w-36 h-36 rounded-full border border-[#2763f8]/30"></div>
                  <div className="absolute w-40 h-8 bg-[#2763f8]/20 blur-md -mb-16"></div>
                  <div className="absolute w-full h-full flex justify-center items-center">
                    <Image 
                      src="/robot3.png" 
                      alt="Protector Vault Robot" 
                      width={120} 
                      height={120} 
                      className="mb-3"
                    />
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                  <Image 
                    src="/images/coin.svg" 
                    alt="Coin" 
                    width={50} 
                    height={50}
                  />
                </div>
              </div>
              
              <div className="text-xl font-bold mb-6">$1,000 in Tokens</div>
              
              <button className="bg-[#1f1d56] hover:bg-[#2a2878] text-white w-full py-3 rounded-md flex items-center justify-center space-x-2 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 6V18L17 12L7 6Z" fill="white"/>
                </svg>
                <span>Play</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
