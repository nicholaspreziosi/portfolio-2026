"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "cn";

const filters = [
  { id: "all", count: 5 },
  { id: "uiux", count: 4 },
  { id: "systems", count: 3 },
  { id: "frontend", count: 4 },
  { id: "product", count: 3 },
  { id: "ai", count: 2 },
  { id: "leadership", count: 2 },
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
        className="inline-flex w-max gap-1.5 rounded-full bg-(--surface-glass) p-1.5 shadow-[var(--hero-panel-shadow)] backdrop-blur-(--blur-md)"
      >
        {filters.map((filter) => {
          const selected = filter.id === active;

          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(filter.id)}
              className={cn(
                "inline-flex h-[31px] items-center rounded-full px-3.5 text-[length:var(--text-button-size)] leading-[var(--text-button-leading)] whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                selected
                  ? "gradient-button font-semibold shadow-[var(--shadow-sm)]"
                  : "font-medium text-(--color-text-secondary) hover:bg-(--accent)"
              )}
            >
              {t(`filter.${filter.id}`)}
              <span
                className={cn(
                  "ms-1.5 text-[length:var(--text-eyebrow-size)] leading-[var(--text-eyebrow-leading)]",
                  selected ? "font-semibold text-white/80" : "font-medium text-(--color-text-tertiary)"
                )}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
