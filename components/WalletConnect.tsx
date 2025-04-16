import React, { useState, useEffect } from 'react';
import { getAptosWallet, formatAddress, type WalletAccount } from '../lib/aptos';
import { Loader2, Wallet, LogOut, Copy, Check, ExternalLink } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface WalletConnectProps {
  isMobile?: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ isMobile = false }) => {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        const wallet = getAptosWallet();
        const isConnected = await wallet.isConnected();
        
        if (isConnected) {
          const acct = await wallet.account();
          setAccount(acct);
          
          // Get balance
          const walletBalance = await wallet.getBalance();
          setBalance(walletBalance);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };
    
    checkConnection();
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const wallet = getAptosWallet();
      const acct = await wallet.connect();
      setAccount(acct);
      
      // Get balance
      const walletBalance = await wallet.getBalance();
      setBalance(walletBalance);
      
      toast({
        title: "Wallet Connected",
        description: "Your Aptos wallet has been successfully connected",
      });
    } catch (error) {
      console.error('Failed to connect wallet', error);
      toast({
        title: "Connection Failed",
        description: "There was an error connecting your wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    setIsDisconnecting(true);
    try {
      const wallet = getAptosWallet();
      await wallet.disconnect();
      setAccount(null);
      setBalance(null);
      setShowDropdown(false);
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected successfully",
      });
    } catch (error) {
      console.error('Failed to disconnect wallet', error);
      toast({
        title: "Disconnection Failed",
        description: "There was an error disconnecting your wallet",
        variant: "destructive",
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        description: "Address copied to clipboard",
      });
    }
  };

  if (!account) {
    return (
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className={`w-full bg-[#0a0a0a] border border-[#FFD700] text-[#FFD700] p-3 mb-4 text-sm font-bold hover:bg-[#111] transition-colors flex items-center justify-center`}
      >
        {isConnecting ? (
          <Loader2 size={16} className="mr-2 animate-spin" />
        ) : (
          <Wallet size={16} className="mr-2" />
        )}
        {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
      </button>
    );
  }

  return (
    <div className="relative w-full mb-4">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full bg-[#0a0a0a] border border-[#FFD700] text-[#FFD700] p-3 text-sm font-bold hover:bg-[#111] transition-colors flex items-center justify-between"
      >
        <div className="flex items-center">
          <Wallet size={16} className="mr-2" />
          {formatAddress(account.address)}
          {balance !== null && (
            <span className="ml-2 text-[#FFD700]/70">•</span>
          )}
          {balance !== null && (
            <span className="ml-2 text-[#FFD700]/90">{balance.toFixed(2)} APT</span>
          )}
        </div>
        <span className="text-lg">&gt;</span>
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-[#FFD700]/30 rounded-sm shadow-lg py-2 z-50 animate-in fade-in-90">
          <div className="px-4 py-2 border-b border-[#333]">
            <p className="text-sm text-[#FFD700]/70">Connected Address</p>
            <div className="flex items-center justify-between mt-1">
              <p className="font-medium text-white truncate" title={account.address}>
                {formatAddress(account.address)}
              </p>
              <button
                onClick={copyAddress}
                className="ml-2 p-1 hover:bg-[#111] rounded-sm transition-colors"
                title="Copy address"
              >
                {copied ? (
                  <Check size={14} className="text-[#FFD700]" />
                ) : (
                  <Copy size={14} className="text-[#FFD700]/70" />
                )}
              </button>
            </div>
          </div>
          
          {balance !== null && (
            <div className="px-4 py-2 border-b border-[#333]">
              <p className="text-sm text-[#FFD700]/70">Balance</p>
              <p className="font-medium text-white">
                {balance.toFixed(2)} APT
              </p>
            </div>
          )}
          
          <div className="px-4 py-2">
            <a
              href={`https://explorer.aptoslabs.com/account/${account.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-white hover:text-[#FFD700] transition-colors py-2"
            >
              <ExternalLink size={14} className="mr-2" />
              View on Explorer
            </a>
            
            <button
              onClick={disconnectWallet}
              disabled={isDisconnecting}
              className="flex items-center text-sm text-[#FFD700]/70 hover:text-[#FFD700] transition-colors py-2 w-full text-left"
            >
              {isDisconnecting ? (
                <Loader2 size={14} className="mr-2 animate-spin" />
              ) : (
                <LogOut size={14} className="mr-2" />
              )}
              {isDisconnecting ? 'DISCONNECTING...' : 'DISCONNECT WALLET'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
