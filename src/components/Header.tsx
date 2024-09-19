import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { WalletConnectButton } from "./WalletConnectButton";
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

export function Header() {
  const { network, connected, account, disconnect } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  const getNetworkName = (network: { name: string } | null) => {
    if (!network) return "Unknown";
    return network.name.charAt(0).toUpperCase() + network.name.slice(1).toLowerCase();
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    if (!isMenuOpen) {
      setCopied(false);
    }
  }, [isMenuOpen]);

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800">
      <Link href="/" className="text-2xl font-bold hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
        Aptos Hunt
      </Link>
      <Link
        href="/explore-projects"
        className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors mr-4"
      >
        Explore Projects
      </Link>
      <div className="flex items-center space-x-4">
        {connected && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {getNetworkName(network)}
          </span>
        )}
        {!connected && <WalletConnectButton />}
        {connected && (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 flex items-center justify-between">
                  <span>{shortenAddress(account?.address || '')}</span>
                  <button
                    onClick={() => copyToClipboard(account?.address || '')}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {copied ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : (
                      <ClipboardIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {pathname !== '/projects' && (
                  <Link
                    href={`/projects`}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Projects
                  </Link>
                )}
                {pathname !== '/submit-project' && (
                  <Link
                    href="/submit-project"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Submit Project
                  </Link>
                )}
                <button
                  onClick={() => {
                    disconnect();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}