"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { InView } from "@/ui/shared/components/in-view";
import { TextEffect } from "@/ui/shared/components/text-effect";
import { TextLoop } from "@/ui/shared/components/text-loop";

const roles = [
  "acrossDevelopment",
  "acrossDesign",
  "acrossProduct",
  "acrossMarketing",
  "acrossTechnology",
  "acrossManagement",
] as const;

const highlights = [
  { id: "badgeExperience", mark: "dot", tone: "bg-(--emerald-deep) dark:bg-(--emerald)" },
  { id: "badgeDevelopment", mark: "dot", tone: "bg-(--blue-deep) dark:bg-(--blue)" },
  { id: "badgeArchitecture", mark: "icon", tone: "" },
] as const;

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const roleVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: "0%", opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

const reducedRoleVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export function AboutHero() {
  const t = useTranslations("AboutPage");
  const rolesT = useTranslations("HomePage");
  const reduceMotion = useReducedMotion();
  const labels = roles.map((role) => rolesT(role));
  const [active, setActive] = useState(false);
  const [roleReady, setRoleReady] = useState(false);
  const enter = useCallback(() => setActive(true), []);

  useEffect(() => {
    if (!active || reduceMotion) return;
    const timeout = window.setTimeout(() => setRoleReady(true), 420);
    return () => window.clearTimeout(timeout);
  }, [active, reduceMotion]);

  const showRole = active && (Boolean(reduceMotion) || roleReady);

  return (
    <section className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-7">
        <h1 className="font-[family-name:var(--font-display)] text-[2rem] leading-[1.14] font-semibold tracking-[var(--text-display-tracking)] text-(--color-text-primary) sm:text-[2.5rem] lg:text-[length:var(--text-display-size)] lg:leading-[var(--text-display-leading)]">
          <span className="sr-only">{t("bridgeSummary")}</span>
          <InView
            once
            viewOptions={{ once: true, margin: "-18% 0px -18% 0px" }}
            variants={reduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : reveal}
            transition={{ duration: reduceMotion ? 0.01 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            onViewportEnter={enter}
          >
            <span aria-hidden className="block">
              {active ? (
                <TextEffect
                  as="span"
                  per="word"
                  preset={reduceMotion ? "fade" : "fade-in-blur"}
                  speedReveal={0.6}
                  speedSegment={0.85}
                  className="inline-block"
                >
                  {t("bridgePrefix")}
                </TextEffect>
              ) : (
                <span className="invisible">{t("bridgePrefix")}</span>
              )}
            </span>
            <span aria-hidden className="inline-grid leading-[1.15]">
              {labels.map((label) => (
                <span key={label} className="invisible col-start-1 row-start-1 whitespace-nowrap">
                  {label}.
                </span>
              ))}
              <span className="col-start-1 row-start-1 h-[1.4em] w-full overflow-hidden">
                {showRole ? (
                  <TextLoop
                    initial
                    className="h-full w-full"
                    itemClassName="flex h-full w-full items-center justify-start"
                    interval={1.6}
                    transition={{
                      duration: reduceMotion ? 0.2 : 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    variants={reduceMotion ? reducedRoleVariants : roleVariants}
                  >
                    {labels.map((label) => (
                      <span key={label} className="gradient-text whitespace-nowrap">
                        {label}.
                      </span>
                    ))}
                  </TextLoop>
                ) : null}
              </span>
            </span>
          </InView>
        </h1>

        <div className="mt-6 flex max-w-xl flex-col gap-4 text-[length:var(--text-body-lg-size)] leading-[1.625] tracking-[-0.008em] text-(--color-text-secondary)">
          <p>{t("body1")}</p>
          <p>{t("body2")}</p>
        </div>

        <ul className="mt-10 flex max-w-2xl flex-wrap gap-x-2 gap-y-3">
          {highlights.map((highlight) => (
            <li
              key={highlight.id}
              className="inline-flex items-center gap-2.5 rounded-pill border border-(--hero-panel-border) bg-(--hero-panel-bg) px-4 py-2 text-[length:var(--text-button-size)] leading-[var(--text-button-leading)] font-semibold text-(--color-text-primary) shadow-[var(--shadow-sm)]"
            >
              {highlight.mark === "icon" ? (
                <img src="/images/about/architecture.svg" alt="" width={8.25} height={13.5} />
              ) : (
                <span aria-hidden className={`size-2 shrink-0 rounded-full ${highlight.tone}`} />
              )}
              {t(highlight.id)}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center lg:col-span-5 lg:justify-end">
        <div className="relative w-full max-w-[26.25rem]">
          <div
            aria-hidden
            className="absolute -inset-4 rounded-3xl bg-[linear-gradient(51deg,rgb(from_var(--blue-deep)_r_g_b/0.15),rgb(from_var(--emerald-deep)_r_g_b/0.15))] blur-[20px]"
          />
          <figure className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-(--surface-solid) shadow-[var(--shadow-elevated)]">
            <img
              src="/images/about/nick-preziosi.webp"
              alt=""
              width={1024}
              height={906}
              className="size-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_top,#070a11_0%,rgb(7_10_17/0.25)_33%,transparent_100%)]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
              <div>
                <p className="font-[family-name:var(--font-display)] text-[length:var(--text-heading-size)] leading-[var(--text-heading-leading)] font-bold tracking-[var(--text-heading-tracking)] text-[#f8fafc]">
                  {t("name")}
                </p>
                <p className="text-[length:var(--text-body-size)] leading-[var(--text-body-leading)] tracking-[-0.005em] text-[#38bdf8]">
                  {t("location")}
                </p>
              </div>
              <p className="inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-[rgb(28_36_56/0.8)] px-2.5 py-1 text-[length:var(--text-body-size)] leading-[var(--text-body-leading)] tracking-[-0.005em] text-[#34d399] shadow-[0_1px_2px_rgb(0_0_0/0.05)] backdrop-blur-[6px]">
                <span aria-hidden className="size-2 rounded-full bg-[#34d399]" />
                {t("availability")}
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
