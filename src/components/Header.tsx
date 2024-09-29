import { useState, useEffect, useRef } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { WalletConnectButton } from "./WalletConnectButton";
import { ChevronDownIcon, ClipboardIcon, CheckIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const { account, disconnect, connected, network } = useWallet();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    const closeDropdown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsWalletDropdownOpen(false);
      }
    };
    window.addEventListener('resize', closeMenu);
    document.addEventListener('mousedown', closeDropdown);
    return () => {
      window.removeEventListener('resize', closeMenu);
      document.removeEventListener('mousedown', closeDropdown);
    };
  }, []);

  const getNetworkName = (network: { name: string } | null): string => {
    if (!network) return "Unknown";
    return network.name.charAt(0).toUpperCase() + network.name.slice(1).toLowerCase();
  };

  const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const navItems = [
    { name: 'Explore Projects', href: '/explore-projects' },
    { name: 'Submit Project', href: '/submit-project' },
    { name: 'My Projects', href: '/projects' },
  ];

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Aptos Hunt
        </Link>

        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-gray-300 hover:text-white transition-colors ${
                pathname === item.href ? 'font-semibold' : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {!connected && <WalletConnectButton />}
          {connected && account && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <span>{shortenAddress(account.address)}</span>
                <ChevronDownIcon className="h-5 w-5" />
              </button>
              {isWalletDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={() => copyToClipboard(account.address)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left"
                  >
                    {copied ? 'Copied!' : 'Copy Address'}
                  </button>
                  <div className="px-4 py-2 text-sm text-gray-400">
                    {getNetworkName(network)}
                  </div>
                  <button
                    onClick={disconnect}
                    className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-600 w-full text-left"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}