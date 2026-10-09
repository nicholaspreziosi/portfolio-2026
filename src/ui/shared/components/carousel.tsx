"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { motion, useMotionValue, type Transition } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";

type CarouselContextValue = {
  index: number;
  setIndex: (index: number) => void;
  itemsCount: number;
  disableDrag: boolean;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used within a Carousel");
  return context;
}

export type CarouselProps = {
  children: ReactNode;
  className?: string;
  initialIndex?: number;
  index?: number;
  onIndexChange?: (index: number) => void;
  disableDrag?: boolean;
  itemCount?: number;
};

export function Carousel({
  children,
  className,
  initialIndex = 0,
  index: externalIndex,
  onIndexChange,
  disableDrag = false,
  itemCount = 0,
}: CarouselProps) {
  const [internalIndex, setInternalIndex] = useState(initialIndex);
  const isControlled = externalIndex !== undefined;
  const index = isControlled ? externalIndex : internalIndex;

  const setIndex = (next: number) => {
    if (!isControlled) setInternalIndex(next);
    onIndexChange?.(next);
  };

  return (
    <CarouselContext.Provider value={{ index, setIndex, itemsCount: itemCount, disableDrag }}>
      <div className={cn("group/hover relative", className)}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </CarouselContext.Provider>
  );
}

export type CarouselNavigationProps = {
  className?: string;
  classNameButton?: string;
  alwaysShow?: boolean;
  previousLabel?: string;
  nextLabel?: string;
};

export function CarouselNavigation({
  className,
  classNameButton,
  alwaysShow = false,
  previousLabel = "Previous",
  nextLabel = "Next",
}: CarouselNavigationProps) {
  const { index, setIndex, itemsCount } = useCarousel();
  const buttonClass = cn(
    "pointer-events-auto grid size-8 place-items-center rounded-full bg-(--surface-elevated) text-foreground shadow-[var(--shadow-sm)] transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:opacity-40",
    alwaysShow ? "opacity-100" : "opacity-0 group-hover/hover:opacity-100",
    classNameButton
  );

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-3 top-1/2 z-10 flex -translate-y-1/2 justify-between",
        className
      )}
    >
      <button
        type="button"
        className={buttonClass}
        aria-label={previousLabel}
        disabled={index === 0}
        onClick={() => setIndex(Math.max(0, index - 1))}
      >
        <ChevronLeft className="size-4 rtl:rotate-180" />
      </button>
      <button
        type="button"
        className={buttonClass}
        aria-label={nextLabel}
        disabled={index + 1 >= itemsCount}
        onClick={() => setIndex(Math.min(itemsCount - 1, index + 1))}
      >
        <ChevronRight className="size-4 rtl:rotate-180" />
      </button>
    </div>
  );
}

export type CarouselIndicatorProps = {
  className?: string;
  classNameButton?: string;
  label?: (index: number) => string;
};

export function CarouselIndicator({ className, classNameButton, label }: CarouselIndicatorProps) {
  const { index, itemsCount, setIndex } = useCarousel();

  return (
    <div className={cn("mt-4 flex items-center justify-center gap-2", className)}>
      {Array.from({ length: itemsCount }, (_, itemIndex) => (
        <button
          key={itemIndex}
          type="button"
          aria-label={label ? label(itemIndex + 1) : `Go to item ${itemIndex + 1}`}
          aria-current={itemIndex === index ? "true" : undefined}
          onClick={() => setIndex(itemIndex)}
          className={cn(
            "size-2 rounded-full transition-opacity",
            itemIndex === index ? "bg-foreground" : "bg-foreground/35",
            classNameButton
          )}
        />
      ))}
    </div>
  );
}

export type CarouselContentProps = {
  children: ReactNode;
  className?: string;
  transition?: Transition;
};

export function CarouselContent({ children, className, transition }: CarouselContentProps) {
  const { index, setIndex, itemsCount, disableDrag } = useCarousel();
  const dragX = useMotionValue(0);

  const onDragEnd = () => {
    const x = dragX.get();
    if (x <= -10 && index < itemsCount - 1) setIndex(index + 1);
    else if (x >= 10 && index > 0) setIndex(index - 1);
  };

  return (
    <motion.div
      drag={disableDrag ? false : "x"}
      dragConstraints={disableDrag ? undefined : { left: 0, right: 0 }}
      dragMomentum={false}
      style={{ x: disableDrag ? undefined : dragX }}
      animate={{ translateX: `-${index * 100}%` }}
      onDragEnd={disableDrag ? undefined : onDragEnd}
      transition={transition ?? { type: "spring", stiffness: 220, damping: 28 }}
      className={cn("flex", !disableDrag && "cursor-grab active:cursor-grabbing", className)}
    >
      {children}
    </motion.div>
  );
}

export function CarouselItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("w-full min-w-full shrink-0", className)}>{children}</div>;
}
