"use client";

import { createContext, useCallback, useContext, useState, type JSX, type ReactNode } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { cn } from "cn";
import { AmbientGradient } from "@/ui/patterns/AmbientGradient";
import { AnimatedGroup } from "@/ui/shared/components/animated-group";
import { InView } from "@/ui/shared/components/in-view";
import { TextEffect } from "@/ui/shared/components/text-effect";
import { pageContainerClassName } from "@/ui/shell/pageContainer";

type HeroLayout = "centered" | "split";
type HeroGradient = "centered" | "start";

type HeroMotion = {
  /** True once the hero has entered the viewport. Slotted content starts its own motion on this. */
  active: boolean;
  reduceMotion: boolean;
};

type HeroContextValue = HeroMotion & { layout: HeroLayout };

const HeroContext = createContext<HeroContextValue>({
  active: true,
  reduceMotion: false,
  layout: "centered",
});

export function useHeroMotion(): HeroMotion {
  const { active, reduceMotion } = useContext(HeroContext);
  return { active, reduceMotion };
}

/* The hero never fades as a whole. InView only reports when it enters. */
const stillVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

/* Centered copy sits over the centered field; split copy pins to the start edge. */
const defaultGradient: Record<HeroLayout, HeroGradient> = {
  centered: "centered",
  split: "start",
};

const layoutClassName: Record<HeroLayout, string> = {
  centered: "justify-items-center text-center",
  split: "items-center gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-8",
};

type HeroProps = {
  children: ReactNode;
  layout?: HeroLayout;
  /** Ambient gradient variant. Defaults to the layout's variant. */
  gradient?: HeroGradient;
  className?: string;
};

function HeroRoot({
  children,
  layout = "centered",
  gradient = defaultGradient[layout],
  className,
}: HeroProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [active, setActive] = useState(false);
  const enter = useCallback(() => setActive(true), []);

  return (
    <HeroContext.Provider value={{ active, reduceMotion, layout }}>
      <AmbientGradient variant={gradient} />
      {/* Server and client render the same initial styles; Motion snaps transforms for reduced motion. */}
      <MotionConfig reducedMotion="user">
        <InView
          as="section"
          once
          viewOptions={{ once: true, margin: "-18% 0px -18% 0px" }}
          variants={stillVariants}
          onViewportEnter={enter}
          className={cn(
            /* Equal padding clears the bottom dock and the top navbar. Stacked layouts start at the top so every hero shares one offset; from md the content centers. */
            "relative z-10 grid min-h-dvh w-full content-start py-24 sm:py-28 md:content-center",
            pageContainerClassName,
            layoutClassName[layout],
            className
          )}
        >
          {children}
        </InView>
      </MotionConfig>
    </HeroContext.Provider>
  );
}

type HeroColumnProps = {
  children: ReactNode;
  className?: string;
};

/* Each direct child reveals in turn. Centered layout centers each row. */
function HeroColumn({ children, className }: HeroColumnProps) {
  const { active, layout } = useContext(HeroContext);

  return (
    <AnimatedGroup
      active={active}
      preset="blur-slide"
      className={cn("flex min-w-0 flex-col", layout === "centered" && "items-center", className)}
    >
      {children}
    </AnimatedGroup>
  );
}

function HeroContent(props: HeroColumnProps) {
  return <HeroColumn {...props} />;
}

function HeroAside(props: HeroColumnProps) {
  return <HeroColumn {...props} />;
}

type HeroTextProps = {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  delay?: number;
};

/*
 * Headline text. Until the hero enters it renders plain text so the markup and the
 * accessibility tree carry the heading; the column wrapper is still at opacity 0, so
 * nothing shows. Then it reveals per word.
 */
function HeroText({ children, as = "span", className, delay }: HeroTextProps) {
  const { active, reduceMotion } = useContext(HeroContext);

  if (!active) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <TextEffect
      as={as}
      per="word"
      preset={reduceMotion ? "fade" : "fade-in-blur"}
      speedReveal={0.6}
      speedSegment={0.85}
      delay={delay}
      className={className}
    >
      {children}
    </TextEffect>
  );
}

export const Hero = Object.assign(HeroRoot, {
  Content: HeroContent,
  Aside: HeroAside,
  Text: HeroText,
});
