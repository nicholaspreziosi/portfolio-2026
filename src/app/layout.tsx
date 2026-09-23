import type { ReactNode } from "react";
import { Geist, Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { ThemeInitScript } from "@/ui/shared/components/ThemeInitScript";
import { Toaster } from "@/ui/shared/components/sonner";
import { TooltipProvider } from "@/ui/shared/components/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headerList = await headers();
  const requested = headerList.get("x-next-intl-locale");
  const lang = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return (
    <html
      lang={lang}
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
        <ThemeInitScript />
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
