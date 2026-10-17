"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, RotateCcwIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { MorphingDialogDescription } from "@/ui/shared/components/morphing-dialog";
import type { MediaAsset } from "@/lib/content/types";
import { CaseStudyMediaDisclosure } from "@/ui/work/containers/caseStudy/CaseStudyMediaDisclosure";

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;

type CaseStudyLightboxProps = {
  items: MediaAsset[];
  index: number;
  onIndexChange: (index: number) => void;
  detailsOpen: boolean;
  onDetailsOpenChange: (open: boolean) => void;
};

export function CaseStudyLightbox({
  items,
  index,
  onIndexChange,
  detailsOpen,
  onDetailsOpenChange,
}: CaseStudyLightboxProps) {
  const t = useTranslations("CaseStudyPage");
  const item = items[index];
  const [zoom, setZoom] = useState(1);
  const [zoomIndex, setZoomIndex] = useState(index);
  const swipe = useRef<number | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const zoomAnchor = useRef<{ x: number; y: number; zoom: number } | null>(null);
  const scroll = useLightboxScroll(frameRef, `${index}:${zoom}:${item?.src ?? ""}`);
  const multiple = items.length > 1;
  const zoomable = item?.kind !== "video" && !item?.placeholder && Boolean(item?.src);

  if (zoomIndex !== index) {
    setZoomIndex(index);
    setZoom(1);
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

  useLayoutEffect(() => {
    const anchor = zoomAnchor.current;
    const frame = frameRef.current;
    if (!anchor || !frame) return;
    const ratio = zoom / anchor.zoom;
    frame.scrollLeft = anchor.x * ratio - frame.clientWidth / 2;
    frame.scrollTop = anchor.y * ratio - frame.clientHeight / 2;
    zoomAnchor.current = null;
  }, [zoom]);

  if (!item) return null;

  const still = item.kind !== "video";

  const setScale = (next: number) => {
    const scale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    const frame = frameRef.current;
    if (still && frame && scale !== zoom) {
      zoomAnchor.current = {
        x: frame.scrollLeft + frame.clientWidth / 2,
        y: frame.scrollTop + frame.clientHeight / 2,
        zoom,
      };
    }
    setZoom(scale);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!zoomable || zoom !== 1 || item.kind === "tall-screenshot") return;
    swipe.current = event.clientX;
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (swipe.current !== null && zoom === 1 && multiple) {
      const delta = event.clientX - swipe.current;
      if (delta > 48) onIndexChange(Math.max(0, index - 1));
      if (delta < -48) onIndexChange(Math.min(items.length - 1, index + 1));
    }
    swipe.current = null;
  };

  return (
    <div className="flex max-h-[88vh] w-[min(96vw,1120px)] flex-col">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[16px] bg-black">
        <div
          ref={frameRef}
          className={
            still
              ? "h-full min-h-0 overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : "grid h-full min-h-[40vh] place-items-center overflow-hidden"
          }
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <LightboxMedia item={item} zoom={zoom} />
        </div>
        {scroll.overflowY ? <ScrollIndicator axis="y" offset={scroll.y} size={scroll.height} /> : null}
        {scroll.overflowX ? <ScrollIndicator axis="x" offset={scroll.x} size={scroll.width} /> : null}
        <MorphingDialogDescription className="absolute inset-x-0 bottom-0 z-20">
          <CaseStudyMediaDisclosure item={item} open={detailsOpen} onOpenChange={onDetailsOpenChange} />
        </MorphingDialogDescription>
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
    </div>
  );
}

type FrameScroll = {
  overflowX: boolean;
  overflowY: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
};

function useLightboxScroll(frameRef: RefObject<HTMLDivElement | null>, watch: string) {
  const [metrics, setMetrics] = useState<FrameScroll>({
    overflowX: false,
    overflowY: false,
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  });

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = frame;
      const overflowY = scrollHeight > clientHeight + 1;
      const overflowX = scrollWidth > clientWidth + 1;
      const height = scrollHeight === 0 ? 1 : Math.min(1, Math.max(0.12, clientHeight / scrollHeight));
      const width = scrollWidth === 0 ? 1 : Math.min(1, Math.max(0.12, clientWidth / scrollWidth));
      const next: FrameScroll = {
        overflowX,
        overflowY,
        x: overflowX ? scrollLeft / (scrollWidth - clientWidth) : 0,
        y: overflowY ? scrollTop / (scrollHeight - clientHeight) : 0,
        width,
        height,
      };
      const round = (value: number) => Math.round(value * 1000) / 1000;
      next.x = round(next.x);
      next.y = round(next.y);
      next.width = round(next.width);
      next.height = round(next.height);
      setMetrics((current) =>
        current.overflowX === next.overflowX &&
        current.overflowY === next.overflowY &&
        current.x === next.x &&
        current.y === next.y &&
        current.width === next.width &&
        current.height === next.height
          ? current
          : next
      );
    };

    measure();
    frame.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    if (frame.firstElementChild) observer.observe(frame.firstElementChild);
    return () => {
      frame.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [frameRef, watch]);

  return metrics;
}

function ScrollIndicator({ axis, offset, size }: { axis: "x" | "y"; offset: number; size: number }) {
  const vertical = axis === "y";

  return (
    <div
      aria-hidden
      className={
        vertical
          ? "pointer-events-none absolute end-2 top-4 bottom-16 w-1 rounded-full bg-black/45"
          : "pointer-events-none absolute inset-x-4 bottom-16 h-1 rounded-full bg-black/45"
      }
    >
      <div
        className="absolute rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.55)]"
        style={
          vertical
            ? { top: `${offset * (1 - size) * 100}%`, height: `${size * 100}%`, left: 0, right: 0 }
            : { insetInlineStart: `${offset * (1 - size) * 100}%`, width: `${size * 100}%`, top: 0, bottom: 0 }
        }
      />
    </div>
  );
}

function LightboxMedia({ item, zoom }: { item: MediaAsset; zoom: number }) {
  if (item.kind === "video" && item.src) {
    return <video src={item.src} controls playsInline className="max-h-[78vh] max-w-full" />;
  }

  if (!item.src || item.placeholder) return null;

  const frameClass = "h-auto w-full";

  return (
    <div style={{ width: `${zoom * 100}%` }}>
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width ?? 1920}
        height={item.height ?? 1080}
        className={item.darkSrc ? `${frameClass} dark:hidden` : frameClass}
        sizes="100vw"
        unoptimized={Boolean(item.height && item.height > 4000)}
      />
      {item.darkSrc ? (
        <Image
          src={item.darkSrc}
          alt=""
          width={item.width ?? 1920}
          height={item.height ?? 1080}
          className={`hidden dark:block ${frameClass}`}
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
