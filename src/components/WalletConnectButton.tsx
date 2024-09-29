"use client";  // Add this line at the top of the file

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useRef, useEffect } from "react";
import { WalletName } from "@aptos-labs/wallet-adapter-react";
import Image from 'next/image';

export function WalletConnectButton() {
  const { connect, disconnect, connected, wallets } = useWallet();
  const [showWalletList, setShowWalletList] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowWalletList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConnect = async (walletName: WalletName) => {
    setIsConnecting(true);
    try {
      await connect(walletName);
    } catch (error) {
      console.error("Failed to connect:", error);
    } finally {
      setIsConnecting(false);
      setShowWalletList(false);
    }
  };

  if (connected) {
    return (
      <button
        onClick={disconnect}
        className="bg-red-500 text-white px-6 py-2.5 rounded-full hover:bg-red-600 transition-colors text-sm font-medium w-full max-w-[240px]"
      >
        Disconnect Wallet
      </button>
    );
  }

  return (
    <div className="relative w-full max-w-[240px]" ref={dropdownRef}>
      <button
        onClick={() => setShowWalletList(!showWalletList)}
        disabled={isConnecting}
        className={`bg-blue-500 text-white px-6 py-2.5 rounded-full hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-between w-full ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isConnecting ? (
          <>
            <span className="mr-2">Connecting...</span>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </>
        ) : (
          <>
            <span className="mr-2">Connect Wallet</span>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </>
        )}
      </button>
      {showWalletList && !isConnecting && (
        <div className="absolute right-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 py-2">
          {wallets?.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => handleConnect(wallet.name as WalletName)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {wallet.icon && (
                <Image 
                  src={wallet.icon} 
                  alt={wallet.name} 
                  width={20}
                  height={20}
                  className="mr-3 flex-shrink-0"
                />
              )}
              <span className="truncate">{wallet.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}