import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Coins,
  Github,
  Mail,
  Send,
  Sparkles,
  Vote,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "ByteChain Academy is an open-source Web3 learning platform offering bite-sized lessons, DAO governance, a currency hub and verifiable Stellar certificates.",
  openGraph: {
    title: "About ByteChain Academy",
    description:
      "Bite-sized Web3 education for busy professionals, built in the open by the Nexacore community.",
  },
};

const features = [
  {
    icon: BookOpen,
    title: "Bite-sized courses",
    description:
      "Short lessons and quizzes that fit into a coffee break, from Bitcoin basics to DeFi and Stellar.",
  },
  {
    icon: Award,
    title: "Verifiable certificates",
    description:
      "Finish a course and claim a certificate anchored on Stellar that anyone can verify with a public link.",
  },
  {
    icon: Vote,
    title: "DAO governance",
    description:
      "Learners propose and vote on course changes, treasury spend and the direction of the academy.",
  },
  {
    icon: Coins,
    title: "Currency hub",
    description:
      "Explore supported crypto and fiat currencies with history, context and live reference data.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,136,0.12),transparent_60%)]"
        />
        <div className="container relative mx-auto px-6 py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/10 px-4 py-1.5 text-sm text-[#00ff88]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            About ByteChain Academy
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Bite-sized Web3 education for busy professionals
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-400">
            ByteChain Academy turns blockchain fundamentals into short, practical
            lessons. We believe learning Web3 should not require a sabbatical:
            one concept, one quiz, one certificate at a time.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/courses">
              <Button className="bg-[#00ff88] text-black hover:bg-[#00cc6a]">
                Browse courses
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <a
              href="https://github.com/WeAcademy/ByteChain-Academy"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline" className="border-white/20">
                <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                View the code
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold md:text-4xl">What the platform offers</h2>
          <p className="mt-3 max-w-2xl text-gray-400">
            A complete learning loop: understand the concept, practise it, prove
            what you know, and help shape what comes next.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-[#101010] p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#00ff88]/10">
                  <Icon className="h-5 w-5 text-[#00ff88]" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0b0b0b] py-20">
        <div className="container mx-auto grid gap-10 px-6 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">Open source by design</h2>
            <p className="mt-4 text-gray-400">
              The frontend, API, contracts, indexer, shared types and currency hub
              are all developed in public under the MIT licence. Anyone can read
              the code, report a bug, improve a lesson or build on top of it.
            </p>
            <p className="mt-4 text-gray-400">
              Contributions follow the repository contribution guide: pick an open
              issue, describe your approach, wait for assignment, then open a
              focused pull request.
            </p>
            <a
              href="https://github.com/WeAcademy/ByteChain-Academy/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-[#00ff88] hover:underline"
            >
              Read the contribution guide
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101010] p-6">
            <h3 className="text-lg font-semibold">Built in the open</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <Github
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#00ff88]"
                  aria-hidden="true"
                />
                Frontend, backend, contracts, indexer and shared packages live in
                the WeAcademy GitHub organisation.
              </li>
              <li className="flex items-start gap-3">
                <Send
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#00ff88]"
                  aria-hidden="true"
                />
                Community discussion happens in the ByteChain Academy Telegram
                group.
              </li>
              <li className="flex items-start gap-3">
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#00ff88]"
                  aria-hidden="true"
                />
                Security reports and private questions go to the maintainers by
                email.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="rounded-3xl border border-[#00ff88]/20 bg-[#03170f] p-10 text-center md:p-14">
            <h2 className="text-3xl font-bold md:text-4xl">
              Part of the Nexacore community
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-400">
              ByteChain Academy is maintained by Nexacore Org and contributors
              around the world. Reach out if you want to teach, translate,
              sponsor a course or partner with the programme.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="mailto:contact@nexacore.org">
                <Button className="bg-[#00ff88] text-black hover:bg-[#00cc6a]">
                  <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                  contact@nexacore.org
                </Button>
              </a>
              <a
                href="https://t.me/ByteChainAcademy"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline" className="border-white/20">
                  <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                  Join the Telegram
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
