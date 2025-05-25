// src/app/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";

// ← Updated import to point at the root `styles/globals.css` file
import "../../styles/globals.css";

export const metadata = {
  title: "Proctoring System",
  description: "Secure exam & interview platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        {/* NAVBAR */}
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold">Proctoring System</span>
              </Link>
              <div className="flex items-center space-x-4 text-sm">
                <Link href="/auth" className="hover:underline">
                  Auth
                </Link>
                <Link
                  href="/candidate/dashboard"
                  className="hover:underline"
                >
                  Candidate
                </Link>
                <Link
                  href="/recruiter/dashboard"
                  className="hover:underline"
                >
                  Recruiter
                </Link>
                <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs">
                  Secure Exam Mode
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT: centered up to max‐width */}
        <main className="flex-grow flex justify-center">
          <div className="w-full max-w-7xl px-4 py-6">
            {children}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="bg-white shadow-inner">
          <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Proctoring System. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
