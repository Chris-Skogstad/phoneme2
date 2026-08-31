"use client";

import { useRouter } from "next/navigation";

type NavCardProps = {
  title: string;
  description: string;
  href: string;
};

export default function NavCard({ title, description, href }: NavCardProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="text-left bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-lg p-5 w-full max-w-xs cursor-pointer"
    >
      <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
  {title}
</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </button>
  );
}