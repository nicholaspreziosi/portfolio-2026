"use client";

import { ArrowDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Hero } from "@/ui/patterns/Hero";
import { Button } from "@/ui/shared/components/button";
import { EyebrowBadge } from "@/ui/shared/components/eyebrow-badge";
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
    <Hero
      layout="split"
      gradient="start"
      className="lg:grid-cols-none lg:gap-10 xl:grid-cols-[minmax(0,1fr)_auto] xl:content-stretch xl:gap-x-16"
    >
      <Hero.Content className="max-w-3xl">
        <EyebrowBadge>{t("eyebrow")}</EyebrowBadge>

        <h1 className="mt-6 font-[family-name:var(--font-display)] text-[2rem] leading-[1.14] font-semibold tracking-[-0.03em] text-(--color-text-primary) sm:text-[2.5rem] lg:text-[3rem] xl:text-[3.25rem] 2xl:text-[length:var(--text-display-size)] 2xl:leading-[var(--text-display-leading)]">
          <span className="xl:block">
            <Hero.Text>{t("headlineLine1")}</Hero.Text>{" "}
          </span>
          <span className="xl:block">
            <Hero.Text delay={0.2}>{t("headlineLine2")}</Hero.Text>{" "}
          </span>
          <span className="xl:block">
            <Hero.Text delay={0.4}>{t("headlineLine3")}</Hero.Text>
          </span>
        </h1>

        <p className="mt-4 max-w-3xl text-[length:var(--text-body-lg-size)] leading-[1.625] tracking-[-0.008em] text-(--color-text-secondary)">
          {t("body")}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {metrics.map((metric) => (
            <li
              key={metric.id}
              className="inline-flex items-center gap-1 rounded-pill bg-(--surface-glass) px-4 py-1 text-[length:var(--text-button-size)] leading-[var(--text-button-leading)] font-semibold text-(--color-text-primary) shadow-[var(--shadow-sm)] backdrop-blur-(--blur-sm)"
            >
              <img src={metric.src} alt="" width={metric.width} height={metric.height} />
              {t(metric.id)}
            </li>
          ))}
        </ul>

        <Button
          variant="gradient"
          className="mt-8"
          onClick={() => {
            document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {t("viewWork")}
          <ArrowDownIcon data-icon="inline-end" />
        </Button>
      </Hero.Content>

      {/*
        At xl the aside adds no height of its own (h-0) so the hero row is sized by the copy and
        stretched to the viewport, then min-h-full fills that row. Inside, one 1fr row with
        min-h-0 children keeps the marquee from growing the aside past that height.
      */}
      <Hero.Aside className="min-h-0 xl:grid xl:h-0 xl:min-h-full xl:grid-rows-[minmax(0,1fr)] xl:overflow-hidden xl:*:min-h-0">
        <div className="h-full min-h-0">
          <TechMarquee orientation="horizontal" />
          <TechMarquee
            orientation="vertical"
            className="hidden h-full min-h-0 overflow-hidden xl:flex"
          />
        </div>
      </Hero.Aside>
    </Hero>
  );
}
