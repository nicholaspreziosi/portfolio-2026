"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Link, usePathname } from "@/i18n/navigation";
import { AnimatedBackground } from "@/ui/shared/components/animated-background";
import { ThemeToggle } from "@/ui/shared/components/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/ui/shared/components/sheet";
import { LocaleSwitcher } from "@/ui/shell/LocaleSwitcher";

const links = [
  { href: "/", id: "home" },
  { href: "/about", id: "about" },
  { href: "/work", id: "work" },
  { href: "/contact", id: "contact" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const activeId = links.find((link) => isActive(pathname, link.href))?.id ?? "";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      setScrolled(!entry.isIntersecting);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [mounted]);

  function scrollHome(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") return;
    event.preventDefault();
    window.scrollTo({ top: 0 });
  }

  return (
    <>
      {mounted
        ? createPortal(
            <div
              ref={sentinelRef}
              aria-hidden
              className="pointer-events-none absolute top-0 h-2 w-full"
            />,
            document.body,
          )
        : null}
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div
        className={cn(
          "mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 rounded-full border px-3 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-200 sm:px-4",
          scrolled
            ? "border-(--nav-glass-border) bg-(--nav-glass) shadow-[var(--surface-glass-shadow)] backdrop-blur-(--surface-glass-blur)"
            : "border-transparent bg-transparent shadow-none backdrop-blur-none",
        )}
      >
        <Link href="/" onClick={scrollHome} className="text-lg font-semibold tracking-tight">
          <span className="gradient-text">nickprez</span>
          <span className="text-(--color-text-primary)">.dev</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label={t("menu")} className="hidden sm:block">
            <NavLinks activeId={activeId} label={(id) => t(id)} onHomeClick={scrollHome} />
          </nav>
          <ThemeToggle />
          <LocaleSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label={t("menu")}
              className="theme-toggle relative grid size-10 place-items-center rounded-full sm:hidden"
            >
              <MenuIcon className="size-4" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
              <nav aria-label={t("menu")} className="mt-10 px-4">
                <NavLinks
                  activeId={activeId}
                  label={(id) => t(id)}
                  stacked
                  onNavigate={() => setOpen(false)}
                />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    </>
  );
}

function NavLinks({
  activeId,
  label,
  stacked = false,
  onNavigate,
  onHomeClick,
}: {
  activeId: string;
  label: (id: (typeof links)[number]["id"]) => string;
  stacked?: boolean;
  onNavigate?: () => void;
  onHomeClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <AnimatedBackground
      value={activeId}
      enableHover
      className="rounded-full bg-(--nav-highlight)"
      containerClassName={stacked ? "flex-col items-stretch gap-1" : "gap-1"}
    >
      {links.map((link) => (
        <Link
          key={link.id}
          data-id={link.id}
          href={link.href}
          aria-current={activeId === link.id ? "page" : undefined}
          onClick={(event) => {
            onNavigate?.();
            if (link.href === "/") onHomeClick?.(event);
          }}
          className={cn(
            "inline-flex rounded-full px-3 py-1.5 text-sm text-(--color-text-secondary) data-[checked=true]:text-(--color-text-primary)",
            stacked && "w-full px-4 py-2.5",
          )}
        >
          {label(link.id)}
        </Link>
      ))}
    </AnimatedBackground>
  );
}
