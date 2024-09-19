"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, Network, AptosConfig } from "@aptos-labs/ts-sdk";
import Link from "next/link";
import { Header } from "@/components/Header";
import Airtable from 'airtable';
import { useRouter } from 'next/navigation'; // Updated import
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

// Initialize Airtable
const base = new Airtable({apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!);

const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};
export default function SubmitProject() {
  const { account, connected, network } = useWallet();
  const [projectName, setProjectName] = useState("");
  const [oneLineDescription, setOneLineDescription] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [xLink, setXLink] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));
    async function fetchBalance() {
      if (connected && account?.address) {
        try {
          const resources = await aptos.getAccountResources({ accountAddress: account.address });
          const aptosCoinResource = resources.find((r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
          if (aptosCoinResource) {
            const balance = (aptosCoinResource.data as { coin: { value: string } }).coin.value;
            setBalance(balance);
          }
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    }

    fetchBalance();
  }, [connected, account]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage("");
    
    const slug = generateSlug(projectName);
    
    try {
      const record = await base('Projects').create({
        Name: projectName,
        Tagline: oneLineDescription,
        Description: projectDescription,
        Repo: repoLink,
        Demo: demoLink,
        Social: xLink,
        Wallet: account?.address || '',
        Network: "Testnet", // Always set to "Testnet"
        Balance: balance ? parseFloat(balance) / 100000000 : 0, // Convert to APT
        Submitted: new Date().toISOString(),
        Status: 'Pending',
        Slug: slug
      });

      console.log('Created record', record.getId());
      setSubmitStatus('success');
      // Clear form fields
      setProjectName("");
      setOneLineDescription("");
      setProjectDescription("");
      setRepoLink("");
      setDemoLink("");
      setXLink("");
      // Redirect to a success page or project list after a short delay
      setTimeout(() => router.push('/projects'), 3000);
    } catch (error) {
      console.error('Error creating record:', error);
      if (typeof error === 'object' && error !== null && 'error' in error && typeof error.error === 'object' && error.error !== null && 'message' in error.error) {
        console.error('Airtable error message:', (error.error as { message: string }).message);
      }
      setSubmitStatus('error');
      setErrorMessage("Failed to submit project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-black dark:text-white";

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    return (
      <button
        onClick={copyToClipboard}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-2"
      >
        {copied ? (
          <CheckIcon className="h-5 w-5" />
        ) : (
          <ClipboardIcon className="h-5 w-5" />
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Submit Your Aptos Project</h1>
        
        {!connected ? (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center bg-white dark:bg-gray-800">
            <p className="mb-4">Please connect your wallet to submit a project.</p>
          </div>
        ) : (
          <>
            <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Wallet Information</h2>
              <div className="space-y-2">
                <p>
                  <strong>Address:</strong>{" "}
                  <span>
                    {shortenAddress(account?.address || '')}
                  </span>
                  <CopyButton text={account?.address || ''} />
                </p>
                <p><strong>Balance:</strong> {balance ? `${parseInt(balance) / 100000000} APT` : 'Loading...'}</p>
                <p>
                  <strong>Network:</strong>{" "}
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {network?.name === 'testnet' ? 'Testnet' : network?.name || 'Unknown'}
                  </span>
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div>
                <label htmlFor="projectName" className="block mb-2 font-medium">Project Name</label>
                <input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter your project's name"
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label htmlFor="oneLineDescription" className="block mb-2 font-medium">One Line Description</label>
                <input
                  id="oneLineDescription"
                  type="text"
                  value={oneLineDescription}
                  onChange={(e) => setOneLineDescription(e.target.value)}
                  placeholder="Briefly describe your project in one sentence"
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label htmlFor="projectDescription" className="block mb-2 font-medium">Project Description</label>
                <textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Provide a comprehensive description of your project, its goals, and its impact on the Aptos ecosystem"
                  className={inputClassName}
                  rows={4}
                  required
                />
              </div>
              <div>
                <label htmlFor="repoLink" className="block mb-2 font-medium">Repository URL</label>
                <input
                  id="repoLink"
                  type="url"
                  value={repoLink}
                  onChange={(e) => setRepoLink(e.target.value)}
                  placeholder="https://github.com/yourusername/your-repo"
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="demoLink" className="block mb-2 font-medium">Live Demo / Project Website URL</label>
                <input
                  id="demoLink"
                  type="url"
                  value={demoLink}
                  onChange={(e) => setDemoLink(e.target.value)}
                  placeholder="https://your-project-demo.com"
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="xLink" className="block mb-2 font-medium">X Profile URL</label>
                <input
                  id="xLink"
                  type="url"
                  value={xLink}
                  onChange={(e) => setXLink(e.target.value)}
                  placeholder="https://x.com/yourusername"
                  className={inputClassName}
                />
              </div>
              <button 
                type="submit" 
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Project'}
              </button>
            </form>
            {submitStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-lg">
                Project submitted successfully! Redirecting to projects page...
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-lg">
                {errorMessage}
              </div>
            )}
          </>
        )}
        
        <Link href="/" className="block mt-8 text-center text-gray-600 dark:text-gray-400 hover:underline transition-colors">
          Back to Home
        </Link>
      </main>
    </div>
  );
}