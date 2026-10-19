"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useReducedMotion, type Transition } from "motion/react";
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
  MorphingDialogDescription,
  MorphingDialogTrigger,
} from "@/ui/shared/components/morphing-dialog";
import type { MediaAsset, MediaComparison, MediaGroup } from "@/lib/content/types";
import { CaseStudyLightbox } from "@/ui/work/containers/caseStudy/CaseStudyLightbox";
import { CaseStudyMediaDisclosure } from "@/ui/work/containers/caseStudy/CaseStudyMediaDisclosure";

const dialogTransition: Transition = { type: "spring", bounce: 0.12, duration: 0.45 };

export function CaseStudyMediaGallery({ group }: { group: MediaGroup }) {
  const t = useTranslations("CaseStudyPage");
  const reduceMotion = Boolean(useReducedMotion());
  const [index, setIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsIndex, setDetailsIndex] = useState(index);

  if (detailsIndex !== index) {
    setDetailsIndex(index);
    setDetailsOpen(false);
  }

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
        {multiple ? (
          <Carousel
            index={index}
            onIndexChange={setIndex}
            disableDrag={reduceMotion}
            itemCount={items.length}
          >
            <div className="relative overflow-hidden rounded-[16px] contain-paint">
              <MorphingDialogTrigger
                ariaLabel={t("openImage")}
                className="block w-full border-0 bg-transparent p-0 text-start"
              >
                <CarouselContent>
                  {items.map((item, itemIndex) => (
                    <CarouselItem key={item.id}>
                      <MediaFrame item={item} eager={itemIndex === 0} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </MorphingDialogTrigger>
              <CarouselNavigation alwaysShow className="z-30" previousLabel={t("previous")} nextLabel={t("next")} />
              <MorphingDialogDescription className="absolute inset-x-0 bottom-0 z-20">
                <CaseStudyMediaDisclosure item={active} open={detailsOpen} onOpenChange={setDetailsOpen} />
              </MorphingDialogDescription>
            </div>
            <CarouselIndicator label={(itemIndex) => t("goToItem", { index: itemIndex })} />
          </Carousel>
        ) : (
          <div className="relative overflow-hidden rounded-[16px] contain-paint">
            <MorphingDialogTrigger
              ariaLabel={t("openImage")}
              className="block w-full border-0 bg-transparent p-0 text-start"
            >
              <MediaFrame item={items[0]} eager />
            </MorphingDialogTrigger>
            <MorphingDialogDescription className="absolute inset-x-0 bottom-0 z-20">
              <CaseStudyMediaDisclosure item={active} open={detailsOpen} onOpenChange={setDetailsOpen} />
            </MorphingDialogDescription>
          </div>
        )}
      </figure>
      <MorphingDialogContainer>
        <MorphingDialogContent className="bg-transparent">
          <CaseStudyLightbox
            items={items}
            index={index}
            onIndexChange={setIndex}
            detailsOpen={detailsOpen}
            onDetailsOpenChange={setDetailsOpen}
          />
          <MorphingDialogClose label={t("close")} />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
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
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <MorphingDialog transition={reduceMotion ? { duration: 0 } : dialogTransition}>
      <figure>
        <p className="mb-2 text-xs font-medium tracking-[0.12em] text-(--color-text-secondary) uppercase">
          {label}
        </p>
        <div className="relative overflow-hidden rounded-[16px] contain-paint">
          <MorphingDialogTrigger
            ariaLabel={t("openImage")}
            className="block w-full border-0 bg-transparent p-0 text-start"
          >
            <MediaFrame item={item} eager />
          </MorphingDialogTrigger>
          <MorphingDialogDescription className="absolute inset-x-0 bottom-0 z-20">
            <CaseStudyMediaDisclosure item={item} open={detailsOpen} onOpenChange={setDetailsOpen} />
          </MorphingDialogDescription>
        </div>
      </figure>
      <MorphingDialogContainer>
        <MorphingDialogContent className="bg-transparent">
          <CaseStudyLightbox
            items={[item]}
            index={0}
            onIndexChange={() => undefined}
            detailsOpen={detailsOpen}
            onDetailsOpenChange={setDetailsOpen}
          />
          <MorphingDialogClose label={t("close")} />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

function MediaFrame({ item, eager = false }: { item: MediaAsset; eager?: boolean }) {
  const t = useTranslations("CaseStudyPage");

  if (item.placeholder || !item.src) {
    return (
      <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 bg-(--surface-muted) px-6 text-center">
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
        className="aspect-[16/10] w-full bg-(--surface-muted) object-contain"
      />
    );
  }

  const crop = item.kind === "tall-screenshot" ? "object-cover object-top" : "object-cover object-center";

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-(--surface-muted)">
      <Image
        src={item.src}
        alt={item.alt}
        fill
        loading={eager ? "eager" : "lazy"}
        sizes="(min-width: 1024px) 880px, 100vw"
        className={item.darkSrc ? `${crop} dark:hidden` : crop}
      />
      {item.darkSrc ? (
        <Image
          src={item.darkSrc}
          alt=""
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(min-width: 1024px) 880px, 100vw"
          className={`${crop} hidden dark:block`}
        />
      ) : null}
    </div>
  );
}
