"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { applyTheme, commitThemeChoice, readThemeChoice, type ThemeChoice } from "./theme";

const nextTheme: Record<ThemeChoice, ThemeChoice> = {
  light: "dark",
  dark: "system",
  system: "light",
};

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("Theme");
  const [theme, setTheme] = useState<ThemeChoice>("system");

  useLayoutEffect(() => {
    const stored = readThemeChoice();
    applyTheme(stored);
    setTheme(stored);
  }, []);

  useEffect(() => {
    const onChange = () => setTheme(readThemeChoice());
    document.documentElement.addEventListener("themechange", onChange);
    return () => document.documentElement.removeEventListener("themechange", onChange);
  }, []);

  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const root = document.documentElement;
      root.classList.add("disable-transitions");
      applyTheme("system");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => root.classList.remove("disable-transitions"));
      });
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  function handleClick() {
    commitThemeChoice(nextTheme[theme]);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t(theme)}
      className={cn("theme-toggle relative grid size-10 place-items-center rounded-pill", className)}
    >
      <Sun />
      <Moon />
      <Monitor />
    </button>
  );
}

function Sun() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={iconClass("light")}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function Moon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={iconClass("dark")}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function Monitor() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={iconClass("system")}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function iconClass(choice: ThemeChoice) {
  return `theme-toggle__icon theme-toggle__icon--${choice} absolute size-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]`;
}
