"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useReducedMotion, type Transition, type Variant } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
  CarouselNavigation,
} from "@/ui/shared/components/carousel";
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTrigger,
} from "@/ui/shared/components/morphing-dialog";
import { TransitionPanel } from "@/ui/shared/components/transition-panel";
import type { MediaAsset, MediaComparison, MediaGroup } from "@/lib/content/types";
import { CaseStudyLightbox } from "@/ui/work/containers/caseStudy/CaseStudyLightbox";
import { CaseStudyMediaDisclosure } from "@/ui/work/containers/caseStudy/CaseStudyMediaDisclosure";

const dialogTransition: Transition = { type: "spring", bounce: 0.12, duration: 0.45 };

export function CaseStudyMediaGallery({ group }: { group: MediaGroup }) {
  const t = useTranslations("CaseStudyPage");
  const reduceMotion = Boolean(useReducedMotion());
  const [index, setIndex] = useState(0);

  if (group.presentation === "comparison" && group.comparison) {
    return <ComparisonFrames comparison={group.comparison} reduceMotion={reduceMotion} />;
  }

  const items = group.items;
  if (items.length === 0) return null;
  const active = items[Math.min(index, items.length - 1)] ?? items[0];
  const multiple = items.length > 1 && group.presentation !== "single";

  return (
    <MorphingDialog transition={reduceMotion ? { duration: 0 } : dialogTransition}>
      <figure>
        {multiple && group.presentation === "carousel" ? (
          <Carousel
            index={index}
            onIndexChange={setIndex}
            disableDrag={reduceMotion}
            itemCount={items.length}
          >
            <MorphingDialogTrigger
              ariaLabel={t("openImage")}
              className="block w-full border-0 bg-transparent p-0 text-start"
            >
              <CarouselContent>
                {items.map((item) => (
                  <CarouselItem key={item.id}>
                    <MediaFrame item={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </MorphingDialogTrigger>
            <CarouselNavigation alwaysShow previousLabel={t("previous")} nextLabel={t("next")} />
            <CarouselIndicator label={(itemIndex) => t("goToItem", { index: itemIndex })} />
          </Carousel>
        ) : null}
        {multiple && group.presentation === "transition" ? (
          <TransitionFrames
            items={items}
            index={index}
            onIndexChange={setIndex}
            reduceMotion={reduceMotion}
            openLabel={t("openImage")}
          />
        ) : null}
        {!multiple ? (
          <MorphingDialogTrigger
            ariaLabel={t("openImage")}
            className="block w-full border-0 bg-transparent p-0 text-start"
          >
            <MediaFrame item={items[0]} />
          </MorphingDialogTrigger>
        ) : null}
        <CaseStudyMediaDisclosure item={active} />
      </figure>
      <MorphingDialogContainer>
        <MorphingDialogContent className="bg-transparent">
          <CaseStudyLightbox items={items} index={index} onIndexChange={setIndex} />
          <MorphingDialogClose label={t("close")} />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

function TransitionFrames({
  items,
  index,
  onIndexChange,
  reduceMotion,
  openLabel,
}: {
  items: MediaAsset[];
  index: number;
  onIndexChange: (index: number) => void;
  reduceMotion: boolean;
  openLabel: string;
}) {
  const t = useTranslations("CaseStudyPage");
  const [direction, setDirection] = useState(1);
  const variants: { enter: Variant; center: Variant; exit: Variant } = reduceMotion
    ? { enter: { opacity: 1 }, center: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        enter: (value: number) => ({ opacity: 0, x: value > 0 ? 24 : -24 }),
        center: { opacity: 1, x: 0 },
        exit: (value: number) => ({ opacity: 0, x: value > 0 ? -24 : 24 }),
      };

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1);
    onIndexChange(next);
  };

  return (
    <div>
      <MorphingDialogTrigger ariaLabel={openLabel} className="block w-full border-0 bg-transparent p-0 text-start">
        <TransitionPanel
          activeIndex={index}
          custom={direction}
          variants={variants}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[16px]"
        >
          {items.map((item) => (
            <MediaFrame key={item.id} item={item} />
          ))}
        </TransitionPanel>
      </MorphingDialogTrigger>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={t("previous")}
            disabled={index === 0}
            onClick={() => go(index - 1)}
            className="grid size-8 place-items-center rounded-full bg-(--surface-elevated) text-foreground shadow-[var(--shadow-sm)] disabled:opacity-40"
          >
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </button>
          <button
            type="button"
            aria-label={t("next")}
            disabled={index === items.length - 1}
            onClick={() => go(index + 1)}
            className="grid size-8 place-items-center rounded-full bg-(--surface-elevated) text-foreground shadow-[var(--shadow-sm)] disabled:opacity-40"
          >
            <ChevronRight className="size-4 rtl:rotate-180" />
          </button>
        </div>
        <div className="flex gap-2">
          {items.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              aria-label={t("goToItem", { index: itemIndex + 1 })}
              aria-current={itemIndex === index ? "true" : undefined}
              onClick={() => go(itemIndex)}
              className={itemIndex === index ? "size-2 rounded-full bg-foreground" : "size-2 rounded-full bg-foreground/35"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ComparisonFrames({
  comparison,
  reduceMotion,
}: {
  comparison: MediaComparison;
  reduceMotion: boolean;
}) {
  const t = useTranslations("CaseStudyPage");
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ComparisonFrame label={t("before")} item={comparison.before} reduceMotion={reduceMotion} />
      <ComparisonFrame label={t("after")} item={comparison.after} reduceMotion={reduceMotion} />
    </div>
  );
}

function ComparisonFrame({
  label,
  item,
  reduceMotion,
}: {
  label: string;
  item: MediaAsset;
  reduceMotion: boolean;
}) {
  const t = useTranslations("CaseStudyPage");
  return (
    <MorphingDialog transition={reduceMotion ? { duration: 0 } : dialogTransition}>
      <figure>
        <p className="mb-2 text-xs font-medium tracking-[0.12em] text-(--color-text-secondary) uppercase">
          {label}
        </p>
        <MorphingDialogTrigger
          ariaLabel={t("openImage")}
          className="block w-full border-0 bg-transparent p-0 text-start"
        >
          <MediaFrame item={item} />
        </MorphingDialogTrigger>
        <CaseStudyMediaDisclosure item={item} />
      </figure>
      <MorphingDialogContainer>
        <MorphingDialogContent className="bg-transparent">
          <CaseStudyLightbox items={[item]} index={0} onIndexChange={() => undefined} />
          <MorphingDialogClose label={t("close")} />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

function MediaFrame({ item }: { item: MediaAsset }) {
  const t = useTranslations("CaseStudyPage");

  if (item.placeholder || !item.src) {
    return (
      <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-[16px] bg-(--surface-muted) px-6 text-center">
        <p className="font-[family-name:var(--font-display)] text-lg font-medium text-(--color-text-primary)">
          {item.caption ?? item.alt}
        </p>
        <p className="text-sm text-(--color-text-secondary)">{t("placeholder")}</p>
      </div>
    );
  }

  if (item.kind === "video") {
    return (
      <video
        src={item.src}
        controls
        playsInline
        className="aspect-[16/10] w-full rounded-[16px] bg-(--surface-muted) object-contain"
      />
    );
  }

  const crop = item.kind === "tall-screenshot" ? "object-cover object-top" : "object-cover object-center";

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[16px] bg-(--surface-muted)">
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(min-width: 1024px) 880px, 100vw"
        className={item.darkSrc ? `${crop} dark:hidden` : crop}
      />
      {item.darkSrc ? (
        <Image src={item.darkSrc} alt="" fill sizes="(min-width: 1024px) 880px, 100vw" className={`${crop} hidden dark:block`} />
      ) : null}
    </div>
  );
}
