import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <main className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Aptos Hunt
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover and fund the next big projects on Aptos
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              For Builders
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Showcase your Aptos projects and connect with potential backers.
            </p>
            <Link
              href="/submit-project"
              className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Submit Your Project
            </Link>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              For Hunters
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Discover and support innovative projects building on Aptos. Be the first to find the next big thing!
            </p>
            <Link
              href="/explore-projects"
              className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Explore Projects
            </Link>
          </div>
        </div>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-8">
            How Aptos Hunt Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Submit", desc: "Builders submit their Aptos projects" },
              { title: "Hunt", desc: "Community discovers and upvotes promising projects" },
              { title: "Fund", desc: "Top projects receive funding and support" },
            ].map((step, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="text-4xl font-bold mb-4">{index + 1}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>&copy; 2024 Aptos Hunt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
