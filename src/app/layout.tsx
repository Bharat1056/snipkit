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
import { Analytics } from "@vercel/analytics/next"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://snipkit.bharatpanigrahi.com/'),
  title: {
    default: "Snipkit - The Ultimate Code Snippet Manager for Developers",
    template: `%s | Snipkit`,
  },
  description: "Save, organize, and share your code snippets effortlessly. Boost your productivity with a personal cloud-based snippet library, built for modern developers.",
  keywords: ["code snippets", "developer tools", "productivity", "code manager", "react", "next.js", "typescript", "share code"],
  authors: [{ name: "Bharat Panigrahi" }],
  creator: "Bharat Panigrahi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://snipkit.bharatpanigrahi.com/",
    title: "Snipkit - The Ultimate Code Snippet Manager",
    description: "Save, organize, and share your code snippets effortlessly with Snipkit. Your personal cloud-based snippet library.",
    siteName: "Snipkit",
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Snipkit - The Ultimate Code Snippet Manager',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snipkit - The Ultimate Code Snippet Manager",
    description: "Save, organize, and share your code snippets effortlessly with Snipkit. Your personal cloud-based snippet library.",
    creator: '@Bharat1056', 
    images: ['/og.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/site.webmanifest',
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
        <Analytics />
      </body>
      </SessionWrapper>
    </html>
  );
}
