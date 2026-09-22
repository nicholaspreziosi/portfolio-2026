"use client";

import { useLayoutEffect } from "react";
import { useLocale } from "next-intl";
import { applyTheme, readThemeChoice } from "@/ui/components/theme";

export function DocumentLangSync() {
  const locale = useLocale();

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = "ltr";
    root.classList.add("disable-transitions");
    applyTheme(readThemeChoice());
    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.remove("disable-transitions"));
    });
  }, [locale]);

  return null;
}
