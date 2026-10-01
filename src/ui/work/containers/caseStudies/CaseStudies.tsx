"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { AnimatedGroup } from "@/ui/shared/components/animated-group";
import { InView } from "@/ui/shared/components/in-view";
import { pageContainerClassName } from "@/ui/shell/pageContainer";
import { WorkFilters } from "@/ui/work/containers/filters/WorkFilters";

const revealVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring" as const, duration: 1.2, bounce: 0.3 },
    },
  },
};

const reducedVariants = {
  container: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  },
  item: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  },
};

const studies = [
  {
    id: "kLabEcosystem",
    span: 12,
    cta: "explore",
    image: "/images/work/k-lab-ecosystem.webp",
    darkImage: "/images/work/k-lab-ecosystem-dark.webp",
    width: 1024,
    height: 640,
  },
  {
    id: "kLabWebsite",
    span: 7,
    cta: "view",
    image: "/images/work/k-lab-website.webp",
    darkImage: "/images/work/k-lab-website-dark.webp",
    width: 1024,
    height: 640,
  },
  {
    id: "kasserole",
    span: 5,
    cta: "view",
    image: "/images/work/kasserole.webp",
    width: 800,
    height: 600,
  },
  {
    id: "vmWaste",
    span: 5,
    cta: "view",
    image: "/images/work/vm-waste.webp",
    width: 1024,
    height: 640,
  },
  {
    id: "drivenByAuto",
    span: 7,
    cta: "view",
    image: "/images/work/driven-by-auto.webp",
    width: 1024,
    height: 640,
  },
  {
    id: "knightsTravails",
    span: 7,
    cta: "view",
    image: "/images/work/knights-travails.webp",
    width: 800,
    height: 600,
  },
  {
    id: "nickprez",
    span: 5,
    cta: "view",
    image: "/images/work/nickprez-dev.jpg",
    width: 1280,
    height: 720,
  },
] as const;

type Study = (typeof studies)[number];

const rows = [
  [studies[0]],
  [studies[1], studies[2]],
  [studies[3], studies[4]],
  [studies[5], studies[6]],
] as const;

const spanClass = {
  5: "min-w-0 h-full lg:col-span-5",
  7: "min-w-0 h-full lg:col-span-7",
  12: "",
} as const;

const cardClass =
  "flex h-full flex-col justify-between overflow-hidden rounded-[24px] bg-(--card) shadow-[var(--study-card-shadow)]";

const mediaClass = "overflow-hidden rounded-[16px] bg-(--study-media-bg) shadow-[var(--shadow-sm)]";

function StudyLink({ children }: { children: string }) {
  return (
    <Link
      href="/work"
      className="inline-flex shrink-0 items-center gap-1 text-base leading-6 font-semibold tracking-[-0.01em] text-(--color-text-accent) focus-visible:ring-2 focus-visible:ring-(--blue) focus-visible:outline-none"
    >
      {children}
      <img src="/images/home/icon-arrow.svg" alt="" width={12} height={12} />
    </Link>
  );
}

function StudyImage({
  study,
  alt,
  featured,
}: {
  study: Study;
  alt: string;
  featured: boolean;
}) {
  const className = featured
    ? "h-[240px] w-full object-cover object-top sm:h-[380px] lg:h-[440px]"
    : "h-[220px] w-full object-cover object-top sm:h-[260px]";
  const darkImage = "darkImage" in study ? study.darkImage : undefined;

  return (
    <>
      <img
        src={study.image}
        alt={alt}
        width={study.width}
        height={study.height}
        loading="lazy"
        className={darkImage ? `${className} dark:hidden` : className}
      />
      {darkImage ? (
        <img
          src={darkImage}
          alt=""
          width={study.width}
          height={study.height}
          loading="lazy"
          className={`${className} hidden dark:block`}
        />
      ) : null}
    </>
  );
}

function StudyCard({ study }: { study: Study }) {
  const t = useTranslations("WorkPage");
  const featured = study.span === 12;
  const tags = t.raw(`studies.items.${study.id}.tags`);
  const Title = featured ? "h2" : "h3";

  return (
    <article className={`${cardClass} ${featured ? "gap-6 p-5 sm:p-8 lg:p-10" : "p-6"}`}>
      <div className="flex max-w-[672px] flex-col gap-3">
        <ul className="flex flex-wrap gap-1">
          {featured ? (
            <li className="inline-flex items-center rounded-pill bg-(--study-chip-accent-bg) px-2 py-0.5 text-[11px] leading-4 font-semibold tracking-[0.02em] text-(--study-chip-accent-fg)">
              {t("studies.flagship")}
            </li>
          ) : null}
          {tags.map((tag: string) => (
            <li
              key={tag}
              className="inline-flex items-center rounded-pill bg-(--study-chip-muted-bg) px-2 py-0.5 text-[11px] leading-4 font-medium tracking-[0.02em] text-(--study-chip-muted-fg)"
            >
              {tag}
            </li>
          ))}
        </ul>
        <Title
          className={
            featured
              ? "font-[family-name:var(--font-display)] text-[1.75rem] leading-9 font-semibold tracking-[var(--text-title-tracking)] text-(--color-text-primary) sm:text-[length:var(--text-title-size)] sm:leading-[var(--text-title-leading)]"
              : "font-[family-name:var(--font-display)] text-2xl leading-8 font-semibold tracking-[-0.025em] text-(--color-text-primary)"
          }
        >
          {t(`studies.items.${study.id}.title`)}
        </Title>
        <p className="text-sm leading-[1.625] tracking-[-0.005em] text-(--color-text-secondary)">
          {t(`studies.items.${study.id}.description`)}
        </p>
        <p className="pt-1 text-xs leading-4 text-(--color-text-secondary)">
          <span className="font-semibold text-(--color-text-primary)">{t("studies.role")}:</span>{" "}
          {t(`studies.items.${study.id}.role`)}
        </p>
      </div>
      <div className={featured ? undefined : "mt-6"}>
        <div className={mediaClass}>
          <StudyImage study={study} alt={t(`studies.items.${study.id}.alt`)} featured={featured} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="min-w-0 text-xs leading-4 text-(--color-text-secondary)">
            {t(`studies.items.${study.id}.detail`)}
          </p>
          <StudyLink>{t(`studies.${study.cta}`)}</StudyLink>
        </div>
      </div>
    </article>
  );
}

function StudyRow({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  const [seen, setSeen] = useState(false);
  const enter = useCallback(() => setSeen(true), []);
  const shown = Boolean(reduceMotion) || seen;

  return (
    <InView
      once
      className={className}
      viewOptions={{ once: true, margin: "0px 0px -80px 0px" }}
      variants={{ hidden: { opacity: 1 }, visible: { opacity: 1 } }}
      onViewportEnter={enter}
    >
      <AnimatedGroup
        active={shown}
        inheritChildClassName
        className="h-full"
        variants={reduceMotion ? reducedVariants : revealVariants}
      >
        {children}
      </AnimatedGroup>
    </InView>
  );
}

export function CaseStudies() {
  const t = useTranslations("WorkPage");

  return (
    <section
      id="work"
      aria-label={t("studies.label")}
      className="relative z-10 bg-(--background) py-16 sm:py-20"
    >
      <div className={`${pageContainerClassName} flex flex-col gap-10`}>
        <WorkFilters />
        <div className="flex flex-col gap-10">
          {rows.map((row) =>
            row.length === 1 ? (
              <StudyRow key={row[0].id}>
                <StudyCard study={row[0]} />
              </StudyRow>
            ) : (
              <div key={row[0].id} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                {row.map((study) => (
                  <StudyRow key={study.id} className={spanClass[study.span]}>
                    <StudyCard study={study} />
                  </StudyRow>
                ))}
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
