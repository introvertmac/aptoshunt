"use client";

import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Header } from "@/components/Header";
import Airtable from 'airtable';
import Link from "next/link";

// Define more specific types for Airtable
// Removed unused 'AirtableField' interface

interface ProjectFields extends Airtable.FieldSet {
  Name: string;
  Tagline: string;
  Description: string;
  Repo: string;
  Demo: string;
  Social: string;
  Submitted: string;
  Status: string;
  Wallet: string;
}

interface AirtableBase {
  table(name: string): Airtable.Table<ProjectFields>;
}

const base = new Airtable({apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!) as unknown as AirtableBase;

interface Project {
  id: string;
  fields: ProjectFields;
}

const statusColors: {[key: string]: string} = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

export default function MyProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const { account, isLoading: isWalletLoading } = useWallet();

  const fetchProjects = useCallback(async () => {
    if (!account?.address) return;
    setIsLoading(true);
    try {
      const table = base.table('Projects');
      const records = await table.select({
        filterByFormula: `{Wallet} = '${account.address}'`,
        sort: [{ field: "Submitted", direction: "desc" }]
      }).all();
      setProjects(records.map(record => ({
        id: record.id,
        fields: record.fields as Project['fields']
      })));
    } catch (error) {
      console.error('Error fetching projects:', error);
      // You could add a state to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  }, [account?.address]);

  useEffect(() => {
    if (account?.address) {
      fetchProjects();
    } else {
      setProjects([]);
      setIsLoading(false);
    }
  }, [account?.address, fetchProjects]);

  const handleEdit = (projectId: string) => {
    setEditingProject(projectId);
  };

  const handleSave = async (project: Project) => {
    try {
      await base.table('Projects').update(project.id, project.fields);
      setEditingProject(null);
      fetchProjects(); // Refresh the projects list
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleCancel = () => {
    setEditingProject(null);
  };

  const handleInputChange = (projectId: string, field: keyof Project['fields'], value: string) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, fields: { ...p.fields, [field]: value } } : p
    ));
  };

  if (isWalletLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="mt-4 text-xl">Connecting to wallet...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
        <Header />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-8">My Projects</h1>
          <p className="text-xl mb-8">Connect your wallet in the header to view and manage your projects.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">My Projects</h1>
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
            <p className="mt-4 text-xl">Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-8">You haven&apos;t submitted any projects yet.</p>
            <Link href="/submit-project" className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors text-lg font-medium">
              Submit Your First Project
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {projects.map(project => (
              <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                {editingProject === project.id ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleSave(project); }}>
                    <input
                      type="text"
                      value={project.fields.Name}
                      onChange={(e) => handleInputChange(project.id, 'Name', e.target.value)}
                      className="w-full mb-2 p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    />
                    <input
                      type="text"
                      value={project.fields.Tagline}
                      onChange={(e) => handleInputChange(project.id, 'Tagline', e.target.value)}
                      className="w-full mb-2 p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    />
                    <textarea
                      value={project.fields.Description}
                      onChange={(e) => handleInputChange(project.id, 'Description', e.target.value)}
                      className="w-full mb-2 p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    />
                    <input
                      type="text"
                      value={project.fields.Repo}
                      onChange={(e) => handleInputChange(project.id, 'Repo', e.target.value)}
                      className="w-full mb-2 p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    />
                    <input
                      type="text"
                      value={project.fields.Demo}
                      onChange={(e) => handleInputChange(project.id, 'Demo', e.target.value)}
                      className="w-full mb-2 p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    />
                    <input
                      type="text"
                      value={project.fields.Social}
                      onChange={(e) => handleInputChange(project.id, 'Social', e.target.value)}
                      className="w-full mb-2 p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    />
                    <div className="flex justify-end space-x-2 mt-4">
                      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
                      <button type="button" onClick={handleCancel} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-2">{project.fields.Name}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{project.fields.Tagline}</p>
                    <p className="mb-2">{project.fields.Description}</p>
                    <p className="mb-2">Repo: <a href={project.fields.Repo} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{project.fields.Repo}</a></p>
                    <p className="mb-2">Demo: <a href={project.fields.Demo} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{project.fields.Demo}</a></p>
                    <p className="mb-2">Social: <a href={project.fields.Social} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{project.fields.Social}</a></p>
                    <p className="mb-2">Submitted: {new Date(project.fields.Submitted).toLocaleDateString()}</p>
                    <div className="mb-4">
                      <span className="text-sm font-medium">Status:</span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.fields.Status] || 'bg-gray-100 text-gray-800'}`}>
                        {project.fields.Status}
                      </span>
                    </div>
                    {project.fields.Status !== 'Approved' && (
                      <button onClick={() => handleEdit(project.id)} className="bg-green-500 text-white px-4 py-2 rounded">Edit</button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
