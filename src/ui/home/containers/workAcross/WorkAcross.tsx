"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronsDownIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { InView } from "@/ui/shared/components/in-view";
import { TextEffect } from "@/ui/shared/components/text-effect";
import { TextLoop } from "@/ui/shared/components/text-loop";

const roles = [
  "acrossDevelopment",
  "acrossDesign",
  "acrossProduct",
  "acrossMarketing",
  "acrossManagement",
  "acrossTechnology",
] as const;

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function useNarrowScreen() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia("(max-width: 639px)");
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(max-width: 639px)").matches,
    () => false
  );
}

function roleVariants(reduceMotion: boolean | null, horizontal: boolean) {
  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }

  if (horizontal) {
    return {
      initial: { x: "100%", opacity: 0 },
      animate: { x: "0%", opacity: 1 },
      exit: { x: "-100%", opacity: 0 },
    };
  }

  return {
    initial: { y: "100%", opacity: 0 },
    animate: { y: "0%", opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  };
}

function scrollToNextSection(section: HTMLElement | null) {
  const next = section?.nextElementSibling;
  if (!(next instanceof HTMLElement)) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = next.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
}

export function WorkAcross() {
  const sectionRef = useRef<HTMLElement>(null);
  const t = useTranslations("HomePage");
  const reduceMotion = useReducedMotion();
  const horizontal = useNarrowScreen();
  const [active, setActive] = useState(false);
  const [roleReady, setRoleReady] = useState(false);
  const labels = roles.map((role) => t(role));
  const enter = useCallback(() => setActive(true), []);

  useEffect(() => {
    if (!active || reduceMotion) return;
    const timeout = window.setTimeout(() => setRoleReady(true), 420);
    return () => window.clearTimeout(timeout);
  }, [active, reduceMotion]);

  const showRole = active && (Boolean(reduceMotion) || roleReady);

  return (
    <section ref={sectionRef} id="work-across" className="relative h-[200dvh]">
      <div className="@container sticky top-0 flex h-dvh w-full items-center justify-center px-6">
        <p className="sr-only">{t("acrossSummary")}</p>
        <InView
          once
          className="flex w-full justify-center"
          viewOptions={{ once: true, margin: "-18% 0px -18% 0px" }}
          variants={reduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : reveal}
          transition={{ duration: reduceMotion ? 0.01 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          onViewportEnter={enter}
        >
          <h2
            aria-hidden
            className="flex max-w-full flex-wrap items-center justify-center gap-x-[0.3em] gap-y-1 text-center font-[family-name:var(--font-display)] text-[clamp(2.25rem,14cqi,3.5rem)] leading-[1.15] font-semibold tracking-[var(--text-display-tracking)] whitespace-nowrap text-(--color-text-primary) sm:flex-nowrap sm:items-baseline sm:text-[clamp(2rem,7cqi,3.5rem)]"
          >
            <span>
              {active ? (
                <TextEffect
                  as="span"
                  per="word"
                  preset={reduceMotion ? "fade" : "fade-in-blur"}
                  speedReveal={0.6}
                  speedSegment={0.85}
                  className="inline-block"
                >
                  {t("acrossPrefix")}
                </TextEffect>
              ) : (
                <span className="invisible">{t("acrossPrefix")}</span>
              )}
            </span>
            <span className="inline-grid">
              {labels.map((label) => (
                <span key={label} className="invisible col-start-1 row-start-1 whitespace-nowrap">
                  {label}
                </span>
              ))}
              <span className="col-start-1 row-start-1 h-[1.4em] w-full overflow-hidden">
                {showRole ? (
                  <TextLoop
                    initial
                    className="h-full w-full"
                    itemClassName={
                      horizontal
                        ? "flex h-full w-full items-center justify-center"
                        : "flex h-full w-full items-start"
                    }
                    interval={1.6}
                    transition={{
                      duration: reduceMotion ? 0.2 : 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    variants={roleVariants(reduceMotion, horizontal)}
                  >
                    {labels.map((label) => (
                      <span key={label} className="gradient-text whitespace-nowrap">
                        {label}
                      </span>
                    ))}
                  </TextLoop>
                ) : null}
              </span>
            </span>
          </h2>
        </InView>
        <button
          type="button"
          onClick={() => scrollToNextSection(sectionRef.current)}
          className="absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-(--color-text-tertiary) transition-colors hover:text-(--color-text-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:bottom-8"
        >
          <motion.span
            aria-hidden
            animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronsDownIcon className="size-7" strokeWidth={1.5} />
          </motion.span>
          <span className="text-xs font-medium tracking-wide">{t("scrollHint")}</span>
        </button>
      </div>
    </section>
  );
}
