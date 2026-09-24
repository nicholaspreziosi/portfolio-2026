"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import {
  BriefcaseIcon,
  CheckIcon,
  HouseIcon,
  MailIcon,
  SettingsIcon,
  UserRoundIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "cn";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { AnimatedBackground } from "@/ui/shared/components/animated-background";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/ui/shared/components/drawer";
import { commitThemeChoice, readThemeChoice, type ThemeChoice } from "@/ui/shared/components/theme";
import { ThemeToggle } from "@/ui/shared/components/ThemeToggle";
import { LocaleSwitcher } from "@/ui/shell/LocaleSwitcher";
import { pageContainerClassName } from "@/ui/shell/pageContainer";

const links = [
  { href: "/", id: "home", icon: HouseIcon },
  { href: "/about", id: "about", icon: UserRoundIcon },
  { href: "/work", id: "work", icon: BriefcaseIcon },
  { href: "/contact", id: "contact", icon: MailIcon },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function subscribeToClient() {
  return () => {};
}

function subscribeToTheme(onChange: () => void) {
  document.documentElement.addEventListener("themechange", onChange);
  return () => document.documentElement.removeEventListener("themechange", onChange);
}

export function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const [scrolled, setScrolled] = useState(false);
  const [compactTabs, setCompactTabs] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribeToClient, () => true, () => false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const activeId = links.find((link) => isActive(pathname, link.href))?.id ?? "";

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      setScrolled(!entry.isIntersecting);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [mounted]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      if (y <= 8) setCompactTabs(false);
      else if (delta > 6) setCompactTabs(true);
      else if (delta < -6) setCompactTabs(false);
      lastScrollY.current = y;
    };

    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

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
            document.body
          )
        : null}
      <header className="fixed inset-x-0 top-4 z-50 hidden sm:block">
        <div className={pageContainerClassName}>
          <div
            className={cn(
              "flex h-14 items-center justify-between gap-3 rounded-full border px-3 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-200 sm:px-4",
              scrolled
                ? "border-(--nav-glass-border) bg-(--nav-glass) shadow-[var(--surface-glass-shadow)] backdrop-blur-(--surface-glass-blur)"
                : "border-transparent bg-transparent shadow-none backdrop-blur-none"
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
            </div>
          </div>
        </div>
      </header>
      <nav
        aria-label={t("menu")}
        className="fixed inset-x-3 z-50 sm:hidden bottom-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <div
          className={cn(
            "mx-auto overflow-hidden rounded-full border border-(--nav-glass-border) bg-(--nav-glass) shadow-[var(--surface-glass-shadow)] backdrop-blur-(--surface-glass-blur) transition-[width,padding] duration-200",
            compactTabs ? "w-[17rem] max-w-full px-1.5 py-1.5" : "w-full max-w-md px-0 py-1"
          )}
        >
          <AnimatedBackground
            value={settingsOpen ? "settings" : activeId}
            enableHover
            className={pillClassName}
            hoverClassName={pillHoverClassName}
            containerClassName={
              compactTabs ? "w-full justify-around" : "w-full justify-between py-1 px-2"
            }
          >
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.id}
                  data-id={link.id}
                  href={link.href}
                  aria-current={activeId === link.id ? "page" : undefined}
                  onClick={(event) => {
                    if (link.href === "/") scrollHome(event);
                  }}
                  className={tabClassName}
                >
                  <Icon
                    className={cn(
                      "transition-[width,height] duration-200",
                      compactTabs ? "size-5" : "size-[1.375rem]"
                    )}
                  />
                  <TabLabel compact={compactTabs}>{t(link.id)}</TabLabel>
                </Link>
              );
            })}
            <button
              type="button"
              data-id="settings"
              aria-expanded={settingsOpen}
              aria-haspopup="dialog"
              onClick={() => setSettingsOpen(true)}
              className={tabClassName}
            >
              <SettingsIcon
                className={cn(
                  "transition-[width,height] duration-200",
                  compactTabs ? "size-5" : "size-[1.375rem]"
                )}
              />
              <TabLabel compact={compactTabs}>{t("settings")}</TabLabel>
            </button>
          </AnimatedBackground>
        </div>
      </nav>
      <SettingsDrawer open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}

const pillClassName = "rounded-full [background-image:var(--gradient-button)]";
const pillHoverClassName =
  "rounded-full [background-image:var(--gradient-button)] brightness-110 saturate-125";

const tabClassName =
  "inline-flex flex-col items-center rounded-full px-3.5 py-1.5 text-[11px] leading-none font-medium text-(--color-text-secondary) transition-colors duration-150 ease-out [&_svg]:[stroke-width:1.75] [&_svg]:transition-[stroke-width] [&_svg]:duration-150 [&_svg]:ease-out data-[checked=true]:text-(--color-text-inverse) data-[checked=true]:delay-200 data-[checked=true]:duration-300 data-[checked=true]:[&_svg]:[stroke-width:2.25] data-[checked=true]:[&_svg]:delay-200 data-[checked=true]:[&_svg]:duration-300";

function TabLabel({ compact, children }: { compact: boolean; children: string }) {
  return (
    <span
      className={cn(
        "block min-w-0 overflow-hidden font-medium",
        compact
          ? "mt-0 h-0 max-w-0 opacity-0 transition-none"
          : "mt-1 h-3.5 max-w-20 opacity-100 transition-[max-width,height,margin,opacity] duration-200"
      )}
    >
      {children}
    </span>
  );
}

const themeChoices = ["light", "dark", "system"] as const satisfies readonly ThemeChoice[];

function ThemeChoices({ label, name }: { label: string; name: (choice: ThemeChoice) => string }) {
  const choice = useSyncExternalStore(subscribeToTheme, readThemeChoice, () => "system" as const);

  return (
    <section className="flex flex-col gap-1" role="radiogroup" aria-label={label}>
      <h2 className="px-4 text-xs font-medium text-(--color-text-secondary)">{label}</h2>
      {themeChoices.map((item) => (
        <button
          key={item}
          type="button"
          role="radio"
          aria-checked={item === choice}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => commitThemeChoice(item)}
          className={cn(
            "flex items-center justify-between rounded-full px-4 py-2.5 text-sm",
            item === choice
              ? "bg-(--nav-highlight) text-(--color-text-primary)"
              : "text-(--color-text-secondary)"
          )}
        >
          {name(item)}
          {item === choice ? <CheckIcon className="size-4" /> : null}
        </button>
      ))}
    </section>
  );
}

function SettingsDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("Navigation");
  const localeT = useTranslations("LocaleSwitcher");
  const themeT = useTranslations("Theme");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <DrawerHeader>
          <DrawerTitle>{t("settings")}</DrawerTitle>
          <DrawerDescription className="sr-only">
            {localeT("label")}. {themeT("label")}.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-6 px-4 pb-2">
          <section className="flex flex-col gap-1">
            <h2 className="px-4 text-xs font-medium text-(--color-text-secondary)">
              {localeT("label")}
            </h2>
            {routing.locales.map((item) => (
              <Link
                key={item}
                href={pathname}
                locale={item}
                hrefLang={item}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center justify-between rounded-full px-4 py-2.5 text-sm",
                  item === locale
                    ? "bg-(--nav-highlight) text-(--color-text-primary)"
                    : "text-(--color-text-secondary)"
                )}
              >
                {localeT(item)}
                {item === locale ? <CheckIcon className="size-4" /> : null}
              </Link>
            ))}
          </section>
          <ThemeChoices label={themeT("label")} name={(choice) => themeT(`choice.${choice}`)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function NavLinks({
  activeId,
  label,
  onHomeClick,
}: {
  activeId: string;
  label: (id: (typeof links)[number]["id"]) => string;
  onHomeClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <AnimatedBackground
      value={activeId}
      enableHover
      className={pillClassName}
      hoverClassName={pillHoverClassName}
      containerClassName="gap-1"
    >
      {links.map((link) => (
        <Link
          key={link.id}
          data-id={link.id}
          href={link.href}
          aria-current={activeId === link.id ? "page" : undefined}
          onClick={(event) => {
            if (link.href === "/") onHomeClick?.(event);
          }}
          className="inline-flex rounded-full px-3 py-1.5 text-sm text-(--color-text-secondary) transition-colors duration-150 ease-out data-[checked=true]:text-(--color-text-inverse) data-[checked=true]:delay-200 data-[checked=true]:duration-300"
        >
          {label(link.id)}
        </Link>
      ))}
    </AnimatedBackground>
  );
}
