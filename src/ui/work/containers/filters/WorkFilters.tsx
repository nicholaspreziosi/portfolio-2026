"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedBackground } from "@/ui/shared/components/animated-background";

const filters = [
  { id: "all", count: 7 },
  { id: "uiux", count: 3 },
  { id: "systems", count: 3 },
  { id: "frontend", count: 6 },
  { id: "product", count: 4 },
  { id: "ai", count: 2 },
  { id: "leadership", count: 1 },
] as const;

type FilterId = (typeof filters)[number]["id"];

export function WorkFilters() {
  const t = useTranslations("WorkPage");
  const [active, setActive] = useState<FilterId>("all");

  return (
    <div className="-mx-[var(--page-padding-x)] overflow-x-auto px-[var(--page-padding-x)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        role="tablist"
        aria-label={t("filtersLabel")}
        className="inline-flex w-max rounded-pill bg-(--study-footer-bg) p-1.5 shadow-[var(--shadow-sm)]"
      >
        <AnimatedBackground
          value={active}
          className="rounded-pill [background-image:var(--gradient-button)]"
          containerClassName="gap-1.5"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="tab"
              data-id={filter.id}
              aria-selected={filter.id === active}
              onClick={() => setActive(filter.id)}
              className="inline-flex h-[31px] items-center rounded-pill px-3.5 text-[length:var(--text-button-size)] leading-[var(--text-button-leading)] font-medium whitespace-nowrap text-(--color-text-secondary) transition-colors duration-150 ease-out focus-visible:outline-none data-[checked=true]:text-(--color-text-inverse) data-[checked=true]:delay-150"
            >
              {t(`filter.${filter.id}`)}
              <span className="ms-1.5 text-[length:var(--text-eyebrow-size)] leading-[var(--text-eyebrow-leading)] font-medium text-current opacity-70 transition-none">
                {filter.count}
              </span>
            </button>
          ))}
        </AnimatedBackground>
      </div>
    </div>
  );
}
