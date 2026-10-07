"use client";

import { useTranslations } from "next-intl";
import { AnimatedBackground } from "@/ui/shared/components/animated-background";
import { filterIds, type FilterId } from "@/ui/work/containers/caseStudies/studies";

type WorkFiltersProps = {
  active: FilterId;
  counts: Record<FilterId, number>;
  onChange: (id: FilterId) => void;
};

export function WorkFilters({ active, counts, onChange }: WorkFiltersProps) {
  const t = useTranslations("WorkPage");

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
          {filterIds.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              data-id={id}
              aria-selected={id === active}
              onClick={() => onChange(id)}
              className="inline-flex h-[31px] items-center rounded-pill px-3.5 text-[length:var(--text-button-size)] leading-[var(--text-button-leading)] font-medium whitespace-nowrap text-(--color-text-secondary) transition-colors duration-150 ease-out focus-visible:outline-none data-[checked=true]:text-(--color-text-inverse) data-[checked=true]:delay-150"
            >
              {t(`filter.${id}`)}
              <span className="ms-1.5 text-[length:var(--text-eyebrow-size)] leading-[var(--text-eyebrow-leading)] font-medium text-current opacity-70 transition-none">
                {counts[id]}
              </span>
            </button>
          ))}
        </AnimatedBackground>
      </div>
    </div>
  );
}
