"use client";

import { useTranslations } from "next-intl";
import { TechMarquee } from "@/ui/work/containers/techMarquee/TechMarquee";

const metrics = [
  {
    id: "metricShipped",
    src: "/images/work/metric-shipped.svg",
    width: 16.5,
    height: 15.75,
  },
  {
    id: "metricTokens",
    src: "/images/work/metric-tokens.svg",
    width: 13.5,
    height: 15,
  },
  {
    id: "metricAi",
    src: "/images/work/metric-ai.svg",
    width: 14.259,
    height: 15,
  },
] as const;

export function WorkHero() {
  const t = useTranslations("WorkPage");

  return (
    <section className="flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">
      <div className="max-w-3xl">
        <p className="inline-flex items-center gap-1 rounded-full bg-(--surface-glass) px-2 py-1 text-[length:var(--text-eyebrow-size)] leading-[var(--text-eyebrow-leading)] font-semibold tracking-[var(--text-eyebrow-tracking)] text-(--color-text-secondary) uppercase shadow-[var(--shadow-sm)] backdrop-blur-(--blur-sm)">
          <span aria-hidden className="gradient-accent inline-block size-2 rounded-full" />
          {t("eyebrow")}
        </p>

        <h1 className="mt-6 font-[family-name:var(--font-display)] text-[2rem] leading-[1.14] font-semibold tracking-[-0.03em] text-(--color-text-primary) sm:text-[2.5rem] lg:text-[3rem] xl:text-[3.25rem] 2xl:text-[length:var(--text-display-size)] 2xl:leading-[var(--text-display-leading)]">
          <span className="xl:block">{t("headlineLine1")} </span>
          <span className="xl:block">{t("headlineLine2")} </span>
          <span className="xl:block">{t("headlineLine3")}</span>
        </h1>

        <p className="mt-4 max-w-3xl text-[length:var(--text-body-lg-size)] leading-[1.625] tracking-[-0.008em] text-(--color-text-secondary)">
          {t("body")}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {metrics.map((metric) => (
            <li
              key={metric.id}
              className="inline-flex items-center gap-1 rounded-full bg-(--surface-glass) px-4 py-1 text-[length:var(--text-button-size)] leading-[var(--text-button-leading)] font-semibold text-(--color-text-primary) shadow-[var(--shadow-sm)] backdrop-blur-(--blur-sm)"
            >
              <img src={metric.src} alt="" width={metric.width} height={metric.height} />
              {t(metric.id)}
            </li>
          ))}
        </ul>
      </div>

      <TechMarquee />
    </section>
  );
}
