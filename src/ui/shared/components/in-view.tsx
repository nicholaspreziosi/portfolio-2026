"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  type Transition,
  type UseInViewOptions,
  type Variant,
} from "motion/react";

export type InViewProps = {
  children: ReactNode;
  className?: string;
  variants?: {
    hidden: Variant;
    visible: Variant;
  };
  transition?: Transition;
  viewOptions?: UseInViewOptions;
  as?: React.ElementType;
  once?: boolean;
  onViewportEnter?: () => void;
};

const defaultVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function InView({
  children,
  className,
  variants = defaultVariants,
  transition,
  viewOptions,
  as = "div",
  once,
  onViewportEnter,
}: InViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewOptions);
  const [isViewed, setIsViewed] = useState(false);
  const entered = useRef(false);

  useEffect(() => {
    if (!isInView || entered.current) return;
    entered.current = true;
    onViewportEnter?.();
  }, [isInView, onViewportEnter]);

  const MotionComponent = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView || isViewed ? "visible" : "hidden"}
      variants={variants}
      transition={transition}
      onAnimationComplete={() => {
        if (once) setIsViewed(true);
      }}
    >
      {children}
    </MotionComponent>
  );
}
