import type { ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      <Header />
      <main className="flex-1">{children}</main>

      <footer className="border-t border-white/10 bg-[#080808]">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-gray-500">
              ByteChain Academy. Built on Stellar.
            </p>
            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center gap-5 text-sm"
            >
              <Link
                href="/about"
                className="text-gray-400 transition-colors hover:text-white"
              >
                About
              </Link>
              <Link
                href="/faq"
                className="text-gray-400 transition-colors hover:text-white"
              >
                FAQ
              </Link>
              <Link
                href="/courses"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Courses
              </Link>
              <a
                href="https://github.com/WeAcademy/ByteChain-Academy"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                GitHub
              </a>
              <a
                href="https://t.me/ByteChainAcademy"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Telegram
              </a>
              <a
                href="mailto:contact@nexacore.org"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
