"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, InfoIcon, RotateCcwIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Disclosure, DisclosureContent, DisclosureTrigger } from "@/ui/shared/components/disclosure";
import type { MediaAsset } from "@/lib/content/types";

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;

type CaseStudyLightboxProps = {
  items: MediaAsset[];
  index: number;
  onIndexChange: (index: number) => void;
};

export function CaseStudyLightbox({ items, index, onIndexChange }: CaseStudyLightboxProps) {
  const t = useTranslations("CaseStudyPage");
  const item = items[index];
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoomIndex, setZoomIndex] = useState(index);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const swipe = useRef<number | null>(null);
  const multiple = items.length > 1;
  const zoomable = item?.kind !== "video" && !item?.placeholder && Boolean(item?.src);

  if (zoomIndex !== index) {
    setZoomIndex(index);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!multiple) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onIndexChange(Math.min(items.length - 1, index + 1));
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onIndexChange(Math.max(0, index - 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, items.length, multiple, onIndexChange]);

  if (!item) return null;

  const setScale = (next: number) => {
    const scale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    setZoom(scale);
    if (scale === 1) setPan({ x: 0, y: 0 });
  };

  const tall = item.kind === "tall-screenshot";
  const scrolling = tall && zoom === 1;

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!zoomable) return;
    if (zoom > 1) {
      drag.current = { x: event.clientX, y: event.clientY, px: pan.x, py: pan.y };
      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }
    if (!scrolling) swipe.current = event.clientX;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setPan({
      x: drag.current.px + event.clientX - drag.current.x,
      y: drag.current.py + event.clientY - drag.current.y,
    });
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (swipe.current !== null && zoom === 1 && multiple) {
      const delta = event.clientX - swipe.current;
      if (delta > 48) onIndexChange(Math.max(0, index - 1));
      if (delta < -48) onIndexChange(Math.min(items.length - 1, index + 1));
    }
    drag.current = null;
    swipe.current = null;
  };

  return (
    <div className="flex max-h-[88vh] w-[min(96vw,1120px)] flex-col">
      <div
        className={
          scrolling
            ? "min-h-0 flex-1 overflow-auto rounded-[16px] bg-black"
            : "grid min-h-[40vh] flex-1 place-items-center overflow-hidden rounded-[16px] bg-black"
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <LightboxMedia item={item} zoom={zoom} pan={pan} scrolling={scrolling} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {multiple ? (
          <IconButton label={t("previous")} disabled={index === 0} onClick={() => onIndexChange(index - 1)}>
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </IconButton>
        ) : null}
        {zoomable ? (
          <>
            <IconButton label={t("zoomOut")} disabled={zoom <= MIN_ZOOM} onClick={() => setScale(zoom - 0.5)}>
              <ZoomOutIcon className="size-4" />
            </IconButton>
            <IconButton label={t("zoomReset")} disabled={zoom === 1} onClick={() => setScale(1)}>
              <RotateCcwIcon className="size-4" />
            </IconButton>
            <IconButton label={t("zoomIn")} disabled={zoom >= MAX_ZOOM} onClick={() => setScale(zoom + 0.5)}>
              <ZoomInIcon className="size-4" />
            </IconButton>
          </>
        ) : null}
        {multiple ? (
          <IconButton
            label={t("next")}
            disabled={index === items.length - 1}
            onClick={() => onIndexChange(index + 1)}
          >
            <ChevronRight className="size-4 rtl:rotate-180" />
          </IconButton>
        ) : null}
        {multiple ? (
          <p className="px-2 text-xs text-white/80">
            {index + 1} / {items.length}
          </p>
        ) : null}
      </div>
      {item.caption || item.detail ? (
        <Disclosure className="mt-3 text-white">
          <DisclosureTrigger className="mx-auto flex items-center gap-1.5 text-sm text-white/90">
            <InfoIcon className="size-4" />
            {t("info")}
          </DisclosureTrigger>
          <DisclosureContent>
            <div className="mx-auto max-w-lg pt-2 text-center text-sm leading-6 text-white/80">
              {item.caption ? <p>{item.caption}</p> : null}
              {item.detail ? <p className="mt-1">{item.detail}</p> : null}
            </div>
          </DisclosureContent>
        </Disclosure>
      ) : null}
    </div>
  );
}

function LightboxMedia({
  item,
  zoom,
  pan,
  scrolling,
}: {
  item: MediaAsset;
  zoom: number;
  pan: { x: number; y: number };
  scrolling: boolean;
}) {
  if (item.kind === "video" && item.src) {
    return <video src={item.src} controls playsInline className="max-h-[78vh] max-w-full" />;
  }

  if (!item.src || item.placeholder) return null;

  const transform =
    zoom === 1 ? undefined : `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;

  return (
    <div
      className={scrolling ? "w-full" : "max-h-[78vh] max-w-full"}
      style={{ transform, transformOrigin: "center center" }}
    >
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width ?? 1920}
        height={item.height ?? 1080}
        className={
          item.darkSrc
            ? scrolling
              ? "h-auto w-full dark:hidden"
              : "max-h-[78vh] w-auto max-w-full object-contain dark:hidden"
            : scrolling
              ? "h-auto w-full"
              : "max-h-[78vh] w-auto max-w-full object-contain"
        }
        sizes="100vw"
        unoptimized={Boolean(item.height && item.height > 4000)}
      />
      {item.darkSrc ? (
        <Image
          src={item.darkSrc}
          alt=""
          width={item.width ?? 1920}
          height={item.height ?? 1080}
          className={
            scrolling
              ? "hidden h-auto w-full dark:block"
              : "hidden max-h-[78vh] w-auto max-w-full object-contain dark:block"
          }
          sizes="100vw"
          unoptimized={Boolean(item.height && item.height > 4000)}
        />
      ) : null}
    </div>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-full bg-white/15 text-white disabled:opacity-40"
    >
      {children}
    </button>
  );
}
