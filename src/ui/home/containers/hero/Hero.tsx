"use client";

import { ArrowDownIcon, ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/ui/shared/components/button";
import { EyebrowBadge } from "@/ui/shared/components/eyebrow-badge";

const stats = ["experience", "development", "execution"] as const;

export function Hero() {
  const t = useTranslations("HomePage");

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center pt-10 pb-28 text-center sm:pb-10">
      <EyebrowBadge>{t("eyebrow")}</EyebrowBadge>

      <h1 className="mt-6 max-w-[896px] font-[family-name:var(--font-display)] text-[length:var(--text-display-size)] leading-[var(--text-display-leading)] font-semibold tracking-[var(--text-display-tracking)] text-(--color-text-primary) dark:font-bold">
        {t("headlineLine1")}
        <br />
        {t("headlineLine2")}
      </h1>

      <p className="mt-4 max-w-[672px] text-[length:var(--text-body-lg-size)] leading-[var(--text-body-lg-leading)] tracking-[-0.008em] text-(--color-text-secondary)">
        {t("body")}
      </p>

      <div className="mt-8 inline-flex max-w-full flex-wrap items-center justify-center gap-x-6 gap-y-4 rounded-pill border border-(--hero-panel-border) bg-(--hero-panel-bg) px-5 py-3 shadow-[var(--hero-panel-shadow)] backdrop-blur-[6px] sm:px-6">
        <div className="flex items-center gap-3 text-left">
          <span className="relative size-14 shrink-0 overflow-hidden rounded-pill shadow-[var(--avatar-ring)]">
            <img
              src="/images/about/nick-preziosi.webp"
              alt=""
              width={1024}
              height={906}
              className="absolute top-[-20%] left-[-78%] h-auto w-[256%] max-w-none"
            />
          </span>
          <div>
            <p className="text-sm leading-5 font-semibold tracking-[-0.01em] text-(--color-text-primary)">
              {t("name")}
            </p>
            <p className="text-xs leading-4 text-(--color-text-secondary)">{t("title")}</p>
          </div>
        </div>
        <span aria-hidden className="hidden h-8 w-px shrink-0 bg-(--hero-divider) sm:block" />
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {stats.map((stat) => (
            <li key={stat} className="flex flex-col items-center gap-1.5">
              <span className="gradient-button rounded-pill px-3 py-1 text-sm leading-5 font-semibold tracking-[-0.01em] whitespace-nowrap">
                {t(`${stat}Value`)}
              </span>
              <span className="text-center text-xs leading-4 whitespace-nowrap text-(--color-text-secondary)">
                {t(`${stat}Label`)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button variant="gradient" asChild>
          <Link href="/work">
            {t("selectedWork")}
            <ArrowDownIcon data-icon="inline-end" />
          </Link>
        </Button>
        <Button asChild>
          <Link href="/about">
            {t("about")}
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
