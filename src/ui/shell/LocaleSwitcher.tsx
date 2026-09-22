"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");

  return (
    <nav
      aria-label={t("label")}
      className="flex gap-1 rounded-full p-1"
      style={{
        background: "var(--surface-glass)",
        border: "1px solid var(--surface-glass-border)",
        boxShadow: "var(--surface-glass-shadow)",
        backdropFilter: "blur(var(--surface-glass-blur))",
      }}
    >
      {routing.locales.map((item) => (
        <Link
          key={item}
          href={pathname}
          locale={item}
          hrefLang={item}
          aria-current={item === locale ? "page" : undefined}
          aria-label={t(item)}
          className="rounded-full px-2.5 py-1.5 text-[13px] uppercase"
          style={{
            background: item === locale ? "var(--surface-muted)" : "transparent",
            color: "var(--color-text-primary)",
          }}
        >
          {item}
        </Link>
      ))}
    </nav>
  );
}
