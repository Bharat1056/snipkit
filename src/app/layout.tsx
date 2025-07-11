import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
import SessionWrapper from "@/components/SessionWrapper";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pieces - Modern Development Platform",
  description: "Build, deploy, and scale applications faster than ever before with Pieces. The modern development platform for teams.",
  keywords: ["development", "platform", "react", "next.js", "typescript", "modern"],
  authors: [{ name: "Pieces Team" }],
  creator: "Pieces",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pieces.dev",
    title: "Pieces - Modern Development Platform",
    description: "Build, deploy, and scale applications faster than ever before with Pieces.",
    siteName: "Pieces",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pieces - Modern Development Platform",
    description: "Build, deploy, and scale applications faster than ever before with Pieces.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <SessionWrapper>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
         <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
      </SessionWrapper>
    </html>
  );
}
