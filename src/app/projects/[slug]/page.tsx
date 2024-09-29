"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import Airtable from 'airtable';
import { FaGithub, FaTwitter, FaGlobe, FaDollarSign } from 'react-icons/fa';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

const base = new Airtable({apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!);

interface Project {
  id: string;
  fields: {
    Name: string;
    Tagline: string;
    Description: string;
    Repo: string;
    Demo: string;
    Social: string;
    Wallet: string;
    Slug: string;
  };
}

export default function ProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { connected, account } = useWallet();

  useEffect(() => {
    async function fetchProject() {
      setIsLoading(true);
      try {
        const records = await base('Projects').select({
          filterByFormula: `OR({Slug} = '${slug}', RECORD_ID() = '${slug}')`,
          maxRecords: 1
        }).firstPage();
        
        if (records.length > 0) {
          setProject({
            id: records[0].id,
            fields: records[0].fields as Project['fields']
          });
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

  const handleDonation = () => {
    if (!connected || !account || !project) {
      console.error("Wallet not connected or project not loaded");
      return;
    }
    console.log("Donation initiated for project:", project.fields.Name);
  };

  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center text-2xl font-bold text-gray-700 dark:text-gray-300">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">{project.fields.Name}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{project.fields.Tagline}</p>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">About the Project</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{project.fields.Description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Project Links</h2>
            <div className="space-y-4">
              {project.fields.Repo && (
                <a href={project.fields.Repo} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <FaGithub className="mr-2" /> GitHub Repository
                </a>
              )}
              {project.fields.Demo && (
                <a href={project.fields.Demo} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <FaGlobe className="mr-2" /> Live Demo
                </a>
              )}
              {project.fields.Social && (
                <a href={project.fields.Social} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <FaTwitter className="mr-2" /> Twitter
                </a>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Support the Project</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you&apos;d like to support this project, you can donate test APT to the creator&apos;s wallet:
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 font-mono text-sm break-all flex items-center justify-between">
              <span>{project.fields.Wallet}</span>
              <button
                onClick={() => copyToClipboard(project.fields.Wallet)}
                className="text-blue-500 hover:text-blue-600 transition-colors ml-2 focus:outline-none"
                aria-label="Copy wallet address"
              >
                {copied ? (
                  <CheckIcon className="h-6 w-6" />
                ) : (
                  <ClipboardIcon className="h-6 w-6" />
                )}
              </button>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-2 rounded-lg mb-4 text-sm">
              Note: This is on the Aptos Testnet. You are donating test APT.
            </div>
            {connected ? (
              <button
                onClick={handleDonation}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FaDollarSign className="mr-2" /> Donate to this project
              </button>
            ) : (
              <p className="text-yellow-600 dark:text-yellow-400">Connect your wallet to donate test APT</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}