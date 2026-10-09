"use client";

import { useEffect, useState, type RefObject } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "motion/react";
import { cn } from "cn";
import type { CaseStudySection } from "@/lib/content/types";
import { ScrollProgress } from "@/ui/shared/components/scroll-progress";

type NavSection = Pick<CaseStudySection, "id" | "navLabel">;

export function useCaseStudyNav(sections: NavSection[]) {
  const reduceMotion = Boolean(useReducedMotion());
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const ids = sections.map((section) => section.id).join("|");

  useEffect(() => {
    const nodes = ids
      .split("|")
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const next = visible[0]?.target.id;
        if (next) setActive(next);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.2, 0.5] }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [ids]);

  const select = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return { active, select };
}

export function CaseStudySectionNav({
  variant,
  sections,
  articleRef,
  active,
  onSelect,
}: {
  variant: "rail" | "bar";
  sections: NavSection[];
  articleRef: RefObject<HTMLElement | null>;
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
        <div className="flex gap-1 overflow-x-auto px-1 py-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={active === section.id ? "true" : undefined}
              onClick={(event) => {
                event.preventDefault();
                onSelect(section.id);
              }}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs",
                active === section.id ? "bg-foreground text-background" : "text-(--color-text-secondary)"
              )}
            >
              {section.navLabel}
            </a>
          ))}
        </div>
        <div className="relative h-px">
          <div className="absolute inset-x-0 h-px bg-(--line)" />
          <ScrollProgress orientation="horizontal" targetRef={articleRef} />
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label={t("sections")}
      className="sticky top-28 hidden h-[calc(100dvh-8rem)] [@media(max-height:600px)]:hidden lg:flex"
    >
      <div className="relative me-4 w-px">
        <div className="absolute inset-y-0 w-px bg-(--line)" />
        <ScrollProgress orientation="vertical" targetRef={articleRef} />
      </div>
      <ol className="flex min-h-0 flex-1 flex-col justify-between py-1">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? "true" : undefined}
              onClick={(event) => {
                event.preventDefault();
                onSelect(section.id);
              }}
              className={cn(
                "text-sm leading-5 transition-colors",
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
