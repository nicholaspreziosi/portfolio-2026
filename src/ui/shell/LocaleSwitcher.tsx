"use client";

import { CheckIcon, LanguagesIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "cn";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/shared/components/dropdown-menu";

export function LocaleSwitcher({
  className,
  side = "bottom",
}: {
  className?: string;
  side?: "top" | "bottom";
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("label")}
        className={cn("theme-toggle relative grid size-10 place-items-center rounded-full", className)}
      >
        <LanguagesIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side={side} sideOffset={8}>
        {routing.locales.map((item) => (
          <DropdownMenuItem key={item} asChild>
            <Link href={pathname} locale={item} hrefLang={item}>
              {t(item)}
              {item === locale ? <CheckIcon className="ml-auto" /> : null}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
