// src/app/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

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
        <nav className="bg-white shadow-md w-full">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-6 text-sm">
              <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs">
                Secure Exam Mode
              </span>
            </div>
          </div>
        </nav>

       <main className="flex-grow w-[99%] sm:w-[98%] md:w-[96%] mx-auto">
  {children}
</main>


        {/* FOOTER */}
        <footer className="bg-white shadow-inner w-full">
          <div className="text-center text-xs text-gray-500 py-4">
            © {new Date().getFullYear()} Proctoring System. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
