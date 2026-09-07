"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HamburgerMenu from "./HamburgerMenu";

const links = [
  { href: "/", label: "Home" },
  { href: "/wordle", label: "Wordle" },
  { href: "/word-search", label: "Word Search" },
  { href: "/word-bank", label: "Word Bank" },
  { href: "/load-activity", label: "Load Activity" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 dark:bg-gray-950 px-4 py-3 transition-colors">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <ul className="flex flex-wrap gap-6">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-indigo-400 border-b-2 border-indigo-400 pb-1"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <HamburgerMenu />
      </div>
    </nav>
  );
}