"use client";

import AddWordForm from "../components/AddWordForm";
import PageHeading from "../components/PageHeading";

export default function WordBankPage() {
  return (
    <main className="flex flex-col items-center py-10 px-4 min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <PageHeading
        title="Word Bank"
        description="Add new phoneme-based words to the shared word bank."
      />
      <AddWordForm />
    </main>
  );
}