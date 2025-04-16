// This is a simplified mock implementation of Aptos wallet connection
// In a real application, you would use the actual Aptos SDK

export interface WalletAccount {
    address: string;
    publicKey: string | null;
    authKey?: string | null;
    ansName?: string | null;
    balance?: number;
}

// Interface for the wallet adapter
export interface AptosWallet {
    connect: () => Promise<WalletAccount>;
    disconnect: () => Promise<void>;
    account: () => Promise<WalletAccount>;
    isConnected: () => Promise<boolean>;
    signAndSubmitTransaction: (transaction: any) => Promise<{ hash: string }>;
    signTransaction: (transaction: any) => Promise<any>;
    signMessage: (message: any) => Promise<any>;
    getBalance: () => Promise<number>;
}

// Mock wallet implementation for development
class MockAptosWallet implements AptosWallet {
    private connected: boolean = false;
    private userAccount: WalletAccount | null = null;

    constructor() {
        this.initialize();
    }

    private initialize() {
        // Check if we have a stored connection
        const storedWallet = localStorage.getItem('aptosWallet');
        if (storedWallet) {
            try {
                const parsed = JSON.parse(storedWallet);
                this.userAccount = parsed;
                this.connected = true;
            } catch (e) {
                console.error('Failed to parse stored wallet', e);
                localStorage.removeItem('aptosWallet');
            }
        }
    }

    async connect(): Promise<WalletAccount> {
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Generate a mock account
        const addressBytes = new Uint8Array(32);
        window.crypto.getRandomValues(addressBytes);
        const address = '0x' + Array.from(addressBytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .substring(0, 64);

        const publicKeyBytes = new Uint8Array(32);
        window.crypto.getRandomValues(publicKeyBytes);
        const publicKey = '0x' + Array.from(publicKeyBytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .substring(0, 64);

        // Generate random balance between 1 and 10 APT
        const balance = parseFloat((Math.random() * 9 + 1).toFixed(4));

        this.userAccount = { address, publicKey, balance };
        this.connected = true;

        // Store in localStorage for persistence
        localStorage.setItem('aptosWallet', JSON.stringify(this.userAccount));

        return this.userAccount;
    }

    async disconnect(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
        this.userAccount = null;
        this.connected = false;
        localStorage.removeItem('aptosWallet');
    }

    async account(): Promise<WalletAccount> {
        if (!this.userAccount) {
            throw new Error('Wallet not connected');
        }
        return this.userAccount;
    }

    async isConnected(): Promise<boolean> {
        return this.connected;
    }

    async getBalance(): Promise<number> {
        if (!this.connected || !this.userAccount) {
            throw new Error('Wallet not connected');
        }
        
        // If balance doesn't exist, generate a random one
        if (!this.userAccount.balance) {
            this.userAccount.balance = parseFloat((Math.random() * 9 + 1).toFixed(4));
            localStorage.setItem('aptosWallet', JSON.stringify(this.userAccount));
        }
        
        return this.userAccount.balance;
    }

    async signTransaction(transaction: any): Promise<any> {
        if (!this.connected || !this.userAccount) {
            throw new Error('Wallet not connected');
        }

        // Simulate signing delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            ...transaction,
            signature: '0x' + Array(64).fill(0).map(() => 
                Math.floor(Math.random() * 16).toString(16)
            ).join(''),
            signedBy: this.userAccount.address
        };
    }

    async signAndSubmitTransaction(transaction: any): Promise<{ hash: string }> {
        if (!this.connected || !this.userAccount) {
            throw new Error('Wallet not connected');
        }

        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Generate random transaction hash
        const hash = '0x' + Array(64).fill(0).map(() => 
            Math.floor(Math.random() * 16).toString(16)
        ).join('');

        return { hash };
    }

    async signMessage(message: any): Promise<any> {
        if (!this.connected || !this.userAccount) {
            throw new Error('Wallet not connected');
        }
        // Simulate message signing
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            signature: '0x' + Array(64).fill(0).map(() => 
                Math.floor(Math.random() * 16).toString(16)
            ).join(''),
            signedBy: this.userAccount.address
        };
    }
}

// Singleton instance
let walletInstance: AptosWallet | null = null;

export const getAptosWallet = (): AptosWallet => {
    if (!walletInstance) {
        walletInstance = new MockAptosWallet();
    }
    return walletInstance;
};

// Helper to format addresses for display
export const formatAddress = (address: string): string => {
    if (!address) return '';
    if (address.length < 10) return address;
    
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Check if wallet is installed
export const isWalletInstalled = (): boolean => {
    if (typeof window === 'undefined') return false;
    // @ts-ignore
    return !!window.aptos;
};

// Detect wallet type (Petra, Martian, Pontem, etc.)
export const detectWalletType = (): string => {
    try {
        if (typeof window === 'undefined') return 'unknown';
        
        // @ts-ignore
        if (window.aptos?.ispetra) return 'Petra';
        // @ts-ignore
        if (window.martian) return 'Martian';
        // @ts-ignore
        if (window.pontem) return 'Pontem';
        
        // @ts-ignore
        if (window.aptos) return 'Generic Aptos Wallet';
        
        return 'unknown';
    } catch (error) {
        console.error('Error detecting wallet type:', error);
        return 'unknown';
    }
};
  