"use client";

import { useEffect, useState } from "react";
import { applyTheme, readThemeChoice, THEME_STORAGE_KEY, type ThemeChoice } from "./theme";

const nextTheme: Record<ThemeChoice, ThemeChoice> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const labels: Record<ThemeChoice, string> = {
  light: "Light theme. Switch to dark.",
  dark: "Dark theme. Switch to system.",
  system: "System theme. Switch to light.",
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeChoice>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = readThemeChoice();
    applyTheme(stored);
    setTheme(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || theme !== "system") return;

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
  }, [theme, mounted]);

  function handleClick() {
    const root = document.documentElement;
    const choice = nextTheme[theme];
    root.classList.add("disable-transitions");
    applyTheme(choice);
    localStorage.setItem(THEME_STORAGE_KEY, choice);
    setTheme(choice);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.remove("disable-transitions"));
    });
  }

  const shown = mounted ? theme : "light";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={mounted ? labels[theme] : "Toggle theme"}
      className="theme-toggle relative grid size-10 place-items-center rounded-full transition-transform hover:scale-110 active:scale-95"
    >
      <Sun visible={shown === "light"} />
      <Moon visible={shown === "dark"} />
      <Monitor visible={shown === "system"} />
    </button>
  );
}

function Sun({ visible }: { visible: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={iconClass(visible)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function Moon({ visible }: { visible: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={iconClass(visible)}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function Monitor({ visible }: { visible: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={iconClass(visible)}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function iconClass(visible: boolean) {
  return `absolute size-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] transition-transform duration-200 ${
    visible ? "scale-100 rotate-0" : "scale-0 rotate-90"
  }`;
}
