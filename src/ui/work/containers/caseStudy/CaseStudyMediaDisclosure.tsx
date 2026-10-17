"use client";

import { InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "motion/react";
import { Disclosure, DisclosureContent, DisclosureTrigger } from "@/ui/shared/components/disclosure";
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
  const t = useTranslations("CaseStudyPage");
  const reduceMotion = useReducedMotion();
  const title = item.caption || item.alt;
  const description = item.detail || (item.alt !== title ? item.alt : "");
  if (!title) return null;

  return (
    <div onClick={(event) => event.stopPropagation()} onPointerDown={(event) => event.stopPropagation()}>
      <Disclosure
        open={open}
        onOpenChange={onOpenChange}
        className="bg-white/95 text-[#1b1b1d] shadow-[inset_0_1px_0_rgb(0_0_0/0.08)] backdrop-blur-md"
        transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3 px-4 py-2.5">
          <p className="min-w-0 flex-1 truncate font-[family-name:var(--font-display)] text-sm font-medium tracking-[-0.015em]">
            {title}
          </p>
          {description ? (
            <DisclosureTrigger className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#1b1b1d] py-1 ps-2 pe-2.5 text-[11px] font-medium text-white transition-colors hover:bg-[#2c2c2f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b1b1d]">
              <InfoIcon className="size-3" aria-hidden />
              {t("readMore")}
            </DisclosureTrigger>
          ) : null}
        </div>
        {description ? (
          <DisclosureContent>
            <p className="px-4 pb-3.5 text-[13px] leading-5 text-[#414753]">{description}</p>
          </DisclosureContent>
        ) : null}
      </Disclosure>
    </div>
  );
}
