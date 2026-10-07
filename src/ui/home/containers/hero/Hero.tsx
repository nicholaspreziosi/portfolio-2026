"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ArrowDownIcon, ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { Link } from "@/i18n/navigation";
import { Hero } from "@/ui/patterns/Hero";
import { Button } from "@/ui/shared/components/button";
import { EyebrowBadge } from "@/ui/shared/components/eyebrow-badge";

const stats = ["experience", "development", "execution"] as const;

function wraps(elements: HTMLElement[]) {
  const visible = elements.filter(
    (element) => getComputedStyle(element).display !== "none" && element.offsetHeight > 0
  );

  return visible.some((element, index) => {
    const previous = visible[index - 1];
    return previous ? element.offsetTop >= previous.offsetTop + previous.offsetHeight : false;
  });
}

export function HomeHero() {
  const t = useTranslations("HomePage");
  const panelRef = useRef<HTMLDivElement>(null);
  const [stacked, setStacked] = useState(false);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const measure = () => {
      const children = [...panel.children] as HTMLElement[];
      const items = [...panel.querySelectorAll("li")] as HTMLElement[];
      setStacked(wraps(children) || wraps(items));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  return (
    <Hero layout="centered">
      <Hero.Content>
        <EyebrowBadge>{t("eyebrow")}</EyebrowBadge>

        <h1 className="mt-6 max-w-4xl font-[family-name:var(--font-display)] text-[2rem] leading-[1.14] font-semibold tracking-[-0.03em] text-(--color-text-primary) sm:text-[2.5rem] lg:text-[3rem] xl:text-[3.25rem] 2xl:text-[length:var(--text-display-size)] 2xl:leading-[var(--text-display-leading)] 2xl:tracking-[var(--text-display-tracking)]">
          <span className="xl:block">
            <Hero.Text>{t("headlineLine1")}</Hero.Text>{" "}
          </span>
          <span className="xl:block">
            <Hero.Text delay={0.25}>{t("headlineLine2")}</Hero.Text>
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-[length:var(--text-body-lg-size)] leading-[1.625] tracking-[-0.008em] text-(--color-text-secondary)">
          {t("body")}
        </p>

        <div
          ref={panelRef}
          className={cn(
            "mt-8 inline-flex max-w-full flex-wrap items-center justify-center gap-x-6 gap-y-4 border border-(--hero-panel-border) bg-(--hero-panel-bg) px-5 py-3 shadow-[var(--hero-panel-shadow)] backdrop-blur-[6px] sm:px-6",
            stacked ? "rounded-3xl" : "rounded-pill"
          )}
        >
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
      </Hero.Content>
    </Hero>
  );
}
