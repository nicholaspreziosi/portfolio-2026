"use client";

import { ChevronDownIcon, InfoIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from "@/ui/shared/components/disclosure";
import { ProgressiveBlur } from "@/ui/shared/components/progressive-blur";
import type { MediaAsset } from "@/lib/content/types";

export function CaseStudyMediaDisclosure({
  item,
  open = false,
  onOpenChange,
}: {
  item: MediaAsset;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const reduceMotion = useReducedMotion();
  const title = item.caption || item.alt;
  const description = item.detail || (item.alt !== title ? item.alt : "");
  if (!title) return null;

  return (
    <div
      className="relative text-(--color-text-primary)"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <ProgressiveBlur direction="bottom" blurIntensity={4} className="absolute inset-x-0 bottom-0 -top-4" />
      <Disclosure
        open={open}
        onOpenChange={onOpenChange}
        className="relative"
        transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
        variants={{
          expanded: { height: "auto", opacity: 1 },
          collapsed: { height: 0, opacity: 1 },
        }}
      >
        {description ? (
          <DisclosureTrigger className="group flex w-full items-center gap-3 px-4 py-6 text-start">
            <span className="min-w-0 flex-1 truncate font-[family-name:var(--font-display)] text-sm leading-5 font-medium tracking-[-0.015em] underline-offset-4 group-hover:underline flex items-center gap-2">
              <InfoIcon className="size-4 shrink-0" />
              {title}
            </span>
            <ChevronDownIcon
              aria-hidden
              className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </DisclosureTrigger>
        ) : (
          <p className="px-4 py-6 font-[family-name:var(--font-display)] text-sm leading-5 font-medium tracking-[-0.015em]">
            {title}
          </p>
        )}
        {description ? (
          <DisclosureContent>
            <p className="px-4 pb-6 text-[13px] leading-5 text-(--color-text-secondary)">
              {description}
            </p>
          </DisclosureContent>
        ) : null}
      </Disclosure>
    </div>
  );
}
