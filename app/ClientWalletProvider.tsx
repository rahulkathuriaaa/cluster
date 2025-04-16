// ClientWalletProvider.tsx (client component)
'use client';

import React from 'react';
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";

const wallets = [new PetraWallet()];

export default function ClientWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={false}>
      {children}
    </AptosWalletAdapterProvider>
  );
}