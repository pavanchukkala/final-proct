// File: src/app/layout.tsx

import { ReactNode } from "react";
import Link from "next/link";
import "./globals.css"; // Ensure your Tailwind CSS and custom variables load

export const metadata = {
  title: "Proctoring System",
  description: "Secure exam & interview platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body className="min-h-screen flex flex-col bg-background">
        {/* NAVBAR */}
        <nav className="bg-card/95 backdrop-blur-sm shadow-md w-full">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 w-[99%] mx-auto">
            <Link href="/" className="flex items-center gap-2 group">
              {/* Use your SVG or AppLogo component here */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-briefcase text-primary group-hover:text-accent transition-colors"
                aria-hidden="true"
              >
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                <rect width="20" height="14" x="2" y="6" rx="2"></rect>
              </svg>
              <h1 className="font-bold text-foreground group-hover:text-primary transition-colors text-3xl">
                Proctoring System
              </h1>
            </Link>

            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <span>Secure Exam Mode</span>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT: slightly inset at 99% width */}
        <main className="flex-grow w-[97.5%] mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-card/95 shadow-inner w-full">
          <div className="w-[99%] mx-auto text-center text-xs text-muted-foreground py-4">
            © {new Date().getFullYear()} Proctoring System. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
