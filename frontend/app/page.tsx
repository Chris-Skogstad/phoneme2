import PageHeading from "./components/PageHeading";
import NavCard from "./components/NavCard";

export default function Home() {
  return (
    <main className="flex flex-col items-center py-10 px-4 min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <PageHeading
        title="Phoneme-Based Activity Builder"
        description="A frontend tool for Speech Pathology teachers to create phoneme-based Wordle and Word Search activities for classroom use."
      />

      <p className="text-gray-700 dark:text-gray-300 max-w-2xl text-center mb-10 leading-relaxed">
        This builder lets you design phoneme-focused classroom activities,
        preview them instantly, and generate a single downloadable HTML file
        that runs in any web browser — no installation required for
        students. Choose an activity below to get started, or visit Settings
        to customize your experience.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        <NavCard
          title="Wordle"
          description="Create a phoneme-based Wordle guessing activity."
          href="/wordle"
        />
        <NavCard
          title="Word Search"
          description="Generate a phoneme-based word search puzzle."
          href="/word-search"
        />
        <NavCard
          title="About"
          description="Learn more about this project and how to use it."
          href="/about"
        />
        <NavCard
          title="Settings"
          description="Customize theme and layout preferences."
          href="/settings"
        />
      </div>
    </main>
  );
}