import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HelpCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about ByteChain Academy courses, certificates, DAO governance, Stellar wallets, learning streaks, contribution and the Drips Wave programme.",
  openGraph: {
    title: "ByteChain Academy FAQ",
    description:
      "Common questions about courses, verifiable certificates, DAO governance and contributing to ByteChain Academy.",
  },
};

const faqs = [
  {
    question: "Is ByteChain Academy free to use?",
    answer:
      "Yes. Every course, quiz and certificate on ByteChain Academy is free. The platform is open source and supported by the Nexacore community, grants and ecosystem partners. You only need an account and, for on-chain certificates, a Stellar wallet.",
  },
  {
    question: "What is DAO governance and how do I take part?",
    answer:
      "The academy is steered by its learners. Token-holding members can create and vote on proposals covering new courses, treasury spending, partnerships and platform changes. Connect your wallet, open the DAO section and cast a vote on any proposal that is currently open. Your voting power is based on your governance token balance at the snapshot block.",
  },
  {
    question: "How do I earn a certificate?",
    answer:
      "Complete every lesson in a course and pass its final quiz. Once you meet the completion threshold, a certificate is generated and can be claimed to your Stellar wallet. Each certificate has a public verification link, so employers and communities can confirm it without trusting a screenshot.",
  },
  {
    question: "Do I need a Stellar wallet?",
    answer:
      "You can learn and take quizzes without one. A Stellar wallet is required to claim on-chain certificates, hold governance tokens and vote in the DAO. Any Stellar-compatible wallet works; keep your secret key private and never share it with anyone, including support.",
  },
  {
    question: "How do learning streaks work?",
    answer:
      "A streak counts the consecutive days on which you complete at least one lesson or quiz. Your current and longest streaks appear on your profile and dashboard. Missing a day resets the current streak, but your longest streak and all completed courses are kept.",
  },
  {
    question: "How can I contribute to the project?",
    answer:
      "Start with the open issues in the WeAcademy GitHub organisation. Comment on an issue with your plan, wait to be assigned, then open a focused pull request that references the issue. Documentation, translations, design, testing and code contributions are all welcome. Read CONTRIBUTING.md before you begin.",
  },
  {
    question: "What is the Drips Wave programme?",
    answer:
      "Drips Wave is an open-source funding programme that rewards contributors for merged work during time-boxed waves. ByteChain Academy participates with labelled issues; when your pull request is merged, the associated points count towards that wave's rewards. Check the repository issues for the current wave label and rules.",
  },
  {
    question: "Where can I report a bug or ask for help?",
    answer:
      "Open a GitHub issue using the bug report template for reproducible problems. For account, security or partnership questions, email contact@nexacore.org. Please do not disclose security vulnerabilities in a public issue.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Structured data is generated from local constants only.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,136,0.12),transparent_60%)]"
        />
        <div className="container relative mx-auto px-6 py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/10 px-4 py-1.5 text-sm text-[#00ff88]">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            Frequently asked questions
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Everything you need to know before you start
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-400">
            Courses, certificates, wallets, governance and contributing, answered
            in plain language. Cannot find what you need? Email the maintainers.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="space-y-4">
            {faqs.map(({ question, answer }) => (
              <details
                key={question}
                className="group rounded-xl border border-white/10 bg-[#101010] px-5 py-4 transition-colors open:border-[#00ff88]/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-white [&::-webkit-details-marker]:hidden">
                  <span>{question}</span>
                  <Plus
                    className="h-5 w-5 shrink-0 text-[#00ff88] transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  {answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-white/10 bg-[#0b0b0b] p-8 text-center">
            <h2 className="text-2xl font-bold">Still stuck?</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-gray-400">
              Browse the catalogue to see what is available, or reach out to the
              community and we will point you in the right direction.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/courses">
                <Button className="bg-[#00ff88] text-black hover:bg-[#00cc6a]">
                  Browse courses
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <a href="mailto:contact@nexacore.org">
                <Button variant="outline" className="border-white/20">
                  Contact the maintainers
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
