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
            <div class="absolute top-6 left-6"><a class="flex items-center gap-2 group" href="/"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase text-primary group-hover:text-accent transition-colors" aria-hidden="true"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect></svg><h1 class="font-bold text-foreground group-hover:text-primary transition-colors text-3xl">Proctoring System</h1></a></div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs">
                Secure Exam Mode
              </span>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT: slightly inset at 99% width */}
        <main className="flex-grow w-[97.5%] mx-auto">
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
