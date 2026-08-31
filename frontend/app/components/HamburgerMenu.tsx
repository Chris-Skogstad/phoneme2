"use client";

import { useState } from "react";
import Link from "next/link";

const menuLinks = [
  { href: "/about", label: "About" },
  { href: "/settings", label: "Settings" },
];

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        className="flex flex-col justify-around w-8 h-8 cursor-pointer"
      >
        <span
          className={`h-1 w-full bg-white rounded transition-transform ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`h-1 w-full bg-white rounded transition-opacity ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-1 w-full bg-white rounded transition-transform ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {isOpen && (
        <nav className="absolute top-12 right-0 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-50">
          <ul>
            {menuLinks.map((link) => (
              <li
                key={link.href}
                className="border-b border-gray-200 dark:border-gray-700 last:border-none"
              >
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}