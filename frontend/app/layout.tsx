import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { LearningProvider } from "@/contexts/learning-context";
import { UserProvider } from "@/contexts/user-context";
import { ReactQueryProvider } from "@/lib/query-client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
);

const defaultTitle = "ByteChain Academy — Learn Web3 in 5-minute bites";
const defaultDescription =
  "Master Web3 at your own pace. From Bitcoin basics to DeFi protocols. Interactive lessons, instant quizzes, and verifiable certificates.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Bytechain Academy - Web3 Education Platform",
    template: "%s | ByteChain Academy",
  },
  description: defaultDescription,
  openGraph: {
    type: "website",
    siteName: "ByteChain Academy",
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: defaultTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <UserProvider>
              <LearningProvider>
                {children}
                <Toaster theme="dark" position="top-center" richColors />
              </LearningProvider>
            </UserProvider>
          </AuthProvider>
        </ReactQueryProvider>
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  );
}
