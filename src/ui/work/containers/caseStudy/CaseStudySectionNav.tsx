"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion, type UseScrollOptions } from "motion/react";
import { cn } from "cn";
import type { CaseStudySection } from "@/lib/content/types";
import { ScrollProgress } from "@/ui/shared/components/scroll-progress";

const sectionOffset: UseScrollOptions["offset"] = ["start 112px", "end 112px"];

type NavSection = Pick<CaseStudySection, "id" | "navLabel">;

export function useCaseStudyNav(sections: NavSection[]) {
  const reduceMotion = Boolean(useReducedMotion());
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const sectionKey = sections.map((section) => section.id).join("|");
  const sectionRefs = useMemo(
    () =>
      sectionKey
        .split("|")
        .filter(Boolean)
        .map(() => ({ current: null }) as RefObject<HTMLElement | null>),
    [sectionKey]
  );

  useEffect(() => {
    const ids = sectionKey.split("|").filter(Boolean);
    const measure = () => {
      const line = 112;
      let index = 0;
      for (let i = 0; i < sectionRefs.length; i++) {
        const node = sectionRefs[i]?.current;
        if (node && node.getBoundingClientRect().top <= line) index = i;
      }
      const id = ids[index];
      if (id) setActive((current) => (current === id ? current : id));
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [sectionKey, sectionRefs]);

  const select = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return { active, select, sectionRefs };
}

function SectionTrack({
  orientation,
  targetRef,
}: {
  orientation: "horizontal" | "vertical";
  targetRef: RefObject<HTMLElement | null>;
}) {
  const vertical = orientation === "vertical";

  return (
    <div className={cn("relative", vertical ? "h-full w-px" : "h-px w-full")}>
      <div className={cn("absolute bg-(--line)", vertical ? "inset-y-0 w-px" : "inset-x-0 h-px")} />
      <ScrollProgress
        orientation={orientation}
        targetRef={targetRef}
        offset={sectionOffset}
      />
    </div>
  );
}

export function CaseStudySectionNav({
  variant,
  sections,
  sectionRefs,
  active,
  onSelect,
}: {
  variant: "rail" | "bar";
  sections: NavSection[];
  sectionRefs: Array<RefObject<HTMLElement | null>>;
  active: string;
  onSelect: (id: string) => void;
}) {
  const t = useTranslations("CaseStudyPage");

  if (variant === "bar") {
    return (
      <nav
        aria-label={t("sections")}
        className="sticky top-3 z-30 -mx-1 mb-2 rounded-[16px] bg-(--surface-glass) backdrop-blur-(--surface-glass-blur) sm:top-24 lg:hidden [@media(max-height:600px)]:lg:top-24 [@media(max-height:600px)]:lg:block"
      >
        <div className="flex gap-1 overflow-x-auto px-1 pt-2 pb-1.5">
          {sections.map((section, index) => (
            <div key={section.id} className="flex shrink-0 flex-col">
              <a
                href={`#${section.id}`}
                aria-current={active === section.id ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  onSelect(section.id);
                }}
                className={cn(
                  "rounded-full px-3 py-1 text-xs",
                  active === section.id ? "bg-foreground text-background" : "text-(--color-text-secondary)"
                )}
              >
                {section.navLabel}
              </a>
              <div className="px-3 pt-1">
                <SectionTrack orientation="horizontal" targetRef={sectionRefs[index]} />
              </div>
            </div>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label={t("sections")}
      className="sticky top-28 hidden h-[calc(100dvh-8rem)] [@media(max-height:600px)]:hidden lg:flex"
    >
      <ol className="flex h-full min-h-0 flex-1 flex-col">
        {sections.map((section, index) => (
          <li key={section.id} className="flex min-h-0 flex-1 gap-4">
            <SectionTrack orientation="vertical" targetRef={sectionRefs[index]} />
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? "true" : undefined}
              onClick={(event) => {
                event.preventDefault();
                onSelect(section.id);
              }}
              className={cn(
                "self-start text-sm leading-5 transition-colors",
                active === section.id
                  ? "font-medium text-(--color-text-primary)"
                  : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
              )}
            >
              {section.navLabel}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
