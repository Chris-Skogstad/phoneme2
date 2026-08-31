import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import CookieConsentWrapper from "./components/CookieConsentWrapper";
import { ThemeProvider } from "./context/ThemeContext";
import { Locale } from "./lib/locales";
import { LocaleProvider } from "./context/LocaleContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phoneme Builder",
  description: "A phoneme-based Wordle and Word Search builder for Speech Pathology teachers",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "dark" ? "dark" : "light";
  const localeValue = cookieStore.get("locale")?.value;
  const locale: Locale =
    localeValue === "uk" || localeValue === "us" ? localeValue : "au";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider initialTheme={theme}>
          <LocaleProvider initialLocale={locale}>
            <Header />
            <Nav />
            {children}
            <Footer />
            <CookieConsentWrapper />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}