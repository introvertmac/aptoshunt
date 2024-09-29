"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import Link from "next/link";
import Airtable from 'airtable';
import { FaExternalLinkAlt } from 'react-icons/fa';

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
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Explore Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{project.fields.Name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.fields.Tagline}</p>
                <div className="flex justify-between items-center">
                  <Link 
                    href={`/projects/${project.fields.Slug}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Learn More
                  </Link>
                  {project.fields.Demo && (
                    <a 
                      href={project.fields.Demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm flex items-center"
                    >
                      Try Demo
                      <FaExternalLinkAlt className="ml-2" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-xl mb-4 text-gray-700 dark:text-gray-300">Have an exciting Aptos project?</p>
          <Link href="/submit-project" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors text-lg font-medium">
            Submit Your Project
          </Link>
        </div>
      </main>
    </div>
  );
}