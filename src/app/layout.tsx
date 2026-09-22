import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { ThemeInitScript } from "@/ui/components/ThemeInitScript";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headerList = await headers();
  const requested = headerList.get("x-next-intl-locale");
  const lang = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return (
    <html
      lang={lang}
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
        <ThemeInitScript />
        {children}
      </body>
    </html>
  );
}
