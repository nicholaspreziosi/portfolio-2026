"use client";

import { useTranslations } from "next-intl";
import { useReducedMotion } from "motion/react";
import { Disclosure, DisclosureContent, DisclosureTrigger } from "@/ui/shared/components/disclosure";
import type { MediaAsset } from "@/lib/content/types";

export function CaseStudyMediaDisclosure({ item }: { item: MediaAsset }) {
  const t = useTranslations("CaseStudyPage");
  const reduceMotion = useReducedMotion();
  if (!item.caption && !item.detail) return null;

  return (
    <figcaption className="mt-3 max-w-2xl">
      {item.caption ? (
        <p className="text-sm leading-6 text-(--color-text-secondary)">{item.caption}</p>
      ) : null}
      {item.detail ? (
        <Disclosure transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}>
          <DisclosureTrigger className="mt-2 text-sm font-medium text-(--color-text-primary) underline-offset-4 hover:underline">
            {t("moreContext")}
          </DisclosureTrigger>
          <DisclosureContent>
            <p className="pt-2 text-sm leading-6 text-(--color-text-secondary)">{item.detail}</p>
          </DisclosureContent>
        </Disclosure>
      ) : null}
    </figcaption>
  );
}
