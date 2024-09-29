import Link from 'next/link'
import { FaRocket, FaSearch, FaPlus } from 'react-icons/fa'
import { IconType } from 'react-icons'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4 sm:mb-0">
          AptosHunt
        </h1>
        <nav className="flex flex-wrap justify-center gap-4">
          <Link href="/explore-projects" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors duration-300 shadow-md hover:shadow-lg text-sm md:text-base">
            Explore Projects
          </Link>
          <Link href="/submit-project" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors duration-300 shadow-md hover:shadow-lg text-sm md:text-base">
            Submit Project
          </Link>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 text-center">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">Welcome to AptosHunt</h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Discover, support, and showcase innovative projects built on the Aptos network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          <FeatureCard
            icon={FaSearch}
            title="Explore Projects"
            description="Discover innovative projects built on Aptos."
          />
          <FeatureCard
            icon={FaPlus}
            title="Submit Project"
            description="Share your Aptos project with the community."
          />
          <FeatureCard
            icon={FaRocket}
            title="My Projects"
            description="View and manage your submitted projects."
          />
        </div>
      </main>
    </div>
  )
}

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
      <Icon className="w-8 h-8 text-indigo-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}
