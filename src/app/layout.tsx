import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nick Preziosi",
    template: "%s | Nick Preziosi",
  },
  description:
    "Portfolio of Nick Preziosi — product designer and engineer specializing in design systems, Next.js, and thoughtful digital products.",
  keywords: [
    "Nick Preziosi",
    "Product Designer",
    "UI/UX",
    "Design Systems",
    "Next.js",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: "Nick Preziosi" }],
  creator: "Nick Preziosi",
  openGraph: {
    title: "Nick Preziosi",
    description:
      "Portfolio of Nick Preziosi — product designer and engineer specializing in design systems, Next.js, and thoughtful digital products.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
