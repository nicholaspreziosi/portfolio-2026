"use client";

import { useCallback, useState, type ReactNode } from "react";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { AnimatedGroup } from "@/ui/shared/components/animated-group";
import { Button } from "@/ui/shared/components/button";
import { InView } from "@/ui/shared/components/in-view";
import { pageContainerClassName } from "@/ui/shell/pageContainer";
import { WorkFilters } from "@/ui/work/containers/filters/WorkFilters";
import {
  countByFilter,
  studies,
  type CapabilityId,
  type FilterId,
  type ProjectAction,
  type Study,
} from "@/ui/work/containers/caseStudies/studies";

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

const actionOrder = ["caseStudy", "liveProject", "repo"] as const;

const actionVariant = {
  caseStudy: "gradient",
  liveProject: "default",
  repo: "outline",
} as const;

const actionLabel = {
  caseStudy: "studies.view",
  liveProject: "studies.live",
  repo: "studies.repo",
} as const;

const spanClass = {
  5: "min-w-0 h-full lg:col-span-5",
  7: "min-w-0 h-full lg:col-span-7",
  12: "min-w-0 h-full lg:col-span-12",
} as const;

const cardClass =
  "flex h-full flex-col justify-between overflow-hidden rounded-[24px] bg-(--card) shadow-[var(--study-card-shadow)]";

const mediaClass = "overflow-hidden rounded-[16px] bg-(--study-media-bg) shadow-[var(--shadow-sm)]";

const layoutTransition = {
  layout: { type: "spring" as const, bounce: 0.2, duration: 0.5 },
  opacity: { duration: 0.2 },
};

function orderedActions(actions: readonly ProjectAction[]) {
  return [...actions].sort((a, b) => actionOrder.indexOf(a.type) - actionOrder.indexOf(b.type));
}

function StudyAction({ action }: { action: ProjectAction }) {
  const t = useTranslations("WorkPage");
  const label = t(actionLabel[action.type]);

  if (action.type === "caseStudy") {
    return (
      <Button variant={actionVariant.caseStudy} size="sm" asChild>
        <Link href={action.href}>
          {label}
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </Button>
    );
  }

  return (
    <Button variant={actionVariant[action.type]} size="sm" asChild>
      <a href={action.href} target="_blank" rel="noopener noreferrer">
        {label}
        <ArrowUpRightIcon data-icon="inline-end" />
      </a>
    </Button>
  );
}

function StudyImage({ study, alt, featured }: { study: Study; alt: string; featured: boolean }) {
  const frameClass = featured
    ? "h-[240px] w-full sm:h-[380px] lg:h-[440px]"
    : "h-[220px] w-full sm:h-[260px]";

  if (!study.image || !study.width || !study.height) {
    return <div className={frameClass} />;
  }

  const className = `${frameClass} object-cover object-top`;

  return (
    <>
      <img
        src={study.image}
        alt={alt}
        width={study.width}
        height={study.height}
        loading="lazy"
        className={study.darkImage ? `${className} dark:hidden` : className}
      />
      {study.darkImage ? (
        <img
          src={study.darkImage}
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
          {study.capabilities.map((capability) => (
            <li
              key={capability}
              className="inline-flex items-center rounded-pill bg-(--study-chip-muted-bg) px-2 py-0.5 text-[11px] leading-4 font-medium tracking-[0.02em] text-(--study-chip-muted-fg)"
            >
              {t(`filter.${capability}`)}
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
        <div className="flex flex-col gap-1 pt-1">
          <p className="text-xs leading-4 text-(--color-text-secondary)">
            <span className="font-semibold text-(--color-text-primary)">{t("studies.role")}:</span>{" "}
            {t(`studies.items.${study.id}.role`)}
          </p>
          <p className="text-xs leading-4 text-(--color-text-secondary)">
            <span className="font-semibold text-(--color-text-primary)">{t("studies.tools")}:</span>{" "}
            {t(`studies.items.${study.id}.tools`)}
          </p>
        </div>
      </div>
      <div className={featured ? undefined : "mt-6"}>
        <div className={mediaClass}>
          <StudyImage study={study} alt={t(`studies.items.${study.id}.alt`)} featured={featured} />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="min-w-0 text-xs leading-4 text-(--color-text-secondary)">
            {t(`studies.items.${study.id}.detail`)}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {orderedActions(study.actions).map((action) => (
              <StudyAction key={action.type} action={action} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function StudyReveal({
  studyId,
  seen,
  onSeen,
  children,
}: {
  studyId: string;
  seen: boolean;
  onSeen: (id: string) => void;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const [skipReveal] = useState(seen);
  const [active, setActive] = useState(skipReveal || Boolean(reduceMotion));
  const enter = useCallback(() => {
    setActive(true);
    onSeen(studyId);
  }, [onSeen, studyId]);

  if (skipReveal) {
    return <div className="h-full">{children}</div>;
  }

  return (
    <InView
      once
      className="h-full"
      viewOptions={{ once: true, margin: "0px 0px -80px 0px" }}
      variants={{ hidden: { opacity: 1 }, visible: { opacity: 1 } }}
      onViewportEnter={enter}
    >
      <AnimatedGroup
        active={active}
        className="h-full"
        variants={reduceMotion ? reducedVariants : revealVariants}
      >
        {children}
      </AnimatedGroup>
    </InView>
  );
}

function visibleStudies(active: FilterId) {
  if (active === "all") return studies;
  return studies.filter((study) =>
    (study.capabilities as readonly CapabilityId[]).includes(active)
  );
}

export function CaseStudies() {
  const t = useTranslations("WorkPage");
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<FilterId>("all");
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set());
  const markSeen = useCallback((id: string) => {
    setSeen((current) => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      return next;
    });
  }, []);
  const visible = visibleStudies(active);

  return (
    <section
      id="work"
      aria-label={t("studies.label")}
      className="relative z-10 bg-(--background) py-16 sm:py-20"
    >
      <div className={`${pageContainerClassName} flex flex-col gap-10`}>
        <WorkFilters active={active} counts={countByFilter(studies)} onChange={setActive} />
        <LayoutGroup>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((study) => (
                <motion.div
                  key={study.id}
                  layout={reduceMotion ? false : true}
                  layoutId={reduceMotion ? undefined : study.id}
                  className={spanClass[study.span]}
                  initial={false}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : layoutTransition}
                >
                  <StudyReveal studyId={study.id} seen={seen.has(study.id)} onSeen={markSeen}>
                    <StudyCard study={study} />
                  </StudyReveal>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
