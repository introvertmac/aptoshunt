"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import Link from "next/link";
import Airtable from 'airtable';

const base = new Airtable({apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!);

interface Project {
  id: string;
  fields: {
    Name: string;
    Tagline: string;
    Status: string;
    Demo: string;
    Slug?: string;
  };
}

export default function ExploreProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const records = await base('Projects').select({
        filterByFormula: "{Status} = 'Approved'",
        sort: [{ field: "Submitted", direction: "desc" }]
      }).all();
      setProjects(records.map(record => ({
        id: record.id,
        fields: {
          ...record.fields as Project['fields'],
          Slug: (record.fields.Slug as string) || record.id
        }
      })));
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="mt-4 text-xl">Loading exciting projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Discover Innovative Aptos Projects</h1>
        <p className="text-center text-xl mb-12 text-gray-600 dark:text-gray-300">
          Explore the future of blockchain technology with these cutting-edge Aptos projects
        </p>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-2">{project.fields.Name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{project.fields.Tagline}</p>
              <div className="flex justify-between items-center">
                <Link href={`/projects/${encodeURIComponent(project.fields.Slug || '')}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  Learn more →
                </Link>
                {project.fields.Demo && (
                  <a href={project.fields.Demo} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors text-sm">
                    Try Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xl mb-4">Have an exciting Aptos project?</p>
          <Link href="/submit-project" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors text-lg font-medium">
            Submit Your Project
          </Link>
        </div>
      </main>
    </div>
  );
}
