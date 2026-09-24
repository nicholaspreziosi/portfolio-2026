"use client";

import { ArrowDownIcon, ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/ui/shared/components/button";

const stats = ["experience", "development", "execution"] as const;

export function Hero() {
  const t = useTranslations("HomePage");

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 pt-10 pb-28 text-center sm:pb-10">
      <p className="inline-flex items-center gap-1 rounded-full border border-(--hero-chip-border) bg-(--hero-chip-bg) px-3.5 py-1.5 text-[length:var(--text-eyebrow-size)] leading-[var(--text-eyebrow-leading)] font-semibold tracking-[var(--text-eyebrow-tracking)] text-(--hero-chip-fg) uppercase shadow-[var(--hero-chip-shadow)]">
        <span
          aria-hidden
          className="gradient-button inline-block size-2 rounded-full shadow-[var(--hero-dot-shadow)]"
        />
        {t("eyebrow")}
      </p>

      <h1 className="mt-6 max-w-[896px] font-[family-name:var(--font-display)] text-[length:var(--text-display-size)] leading-[var(--text-display-leading)] font-semibold tracking-[var(--text-display-tracking)] text-(--color-text-primary) dark:font-bold">
        {t("headlineLine1")}
        <br />
        {t("headlineLine2")}
      </h1>

      <p className="mt-4 max-w-[672px] text-[length:var(--text-body-lg-size)] leading-[var(--text-body-lg-leading)] tracking-[-0.008em] text-(--color-text-secondary)">
        {t("body")}
      </p>

      <div className="mt-6 flex max-w-full flex-wrap items-center justify-center gap-4 rounded-full border border-(--hero-panel-border) bg-(--hero-panel-bg) py-2 pr-6 pl-4 shadow-[var(--hero-panel-shadow)] backdrop-blur-[6px]">
        <div className="flex items-center gap-2 text-left">
          <img
            src="/images/nick-preziosi.png"
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-full object-cover shadow-[var(--avatar-ring)]"
          />
          <div>
            <p className="text-base leading-5 font-semibold tracking-[-0.01em] text-(--color-text-primary)">
              {t("name")}
            </p>
            <p className="text-xs leading-4 text-(--color-text-secondary)">{t("title")}</p>
          </div>
        </div>
        <span aria-hidden className="hidden h-6 w-px bg-(--hero-divider) sm:block" />
        <div className="flex flex-wrap items-start justify-center gap-4">
          {stats.map((stat) => (
            <div key={stat} className="flex w-[7.5rem] flex-col items-center gap-0.5">
              <span className="gradient-button rounded-full px-2.5 py-0.5 text-base leading-6 font-semibold tracking-[-0.01em]">
                {t(`${stat}Value`)}
              </span>
              <span className="text-xs leading-4 text-(--color-text-secondary)">
                {t(`${stat}Label`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button variant="gradient" asChild>
          <Link href="/work">
            {t("work")}
            <ArrowDownIcon data-icon="inline-end" className="size-3" />
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/about">
            {t("about")}
            <ArrowRightIcon data-icon="inline-end" className="size-3" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
