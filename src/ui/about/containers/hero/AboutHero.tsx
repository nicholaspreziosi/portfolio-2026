"use client";

import { useTranslations } from "next-intl";

const highlights = [
  { id: "badgeExperience", mark: "dot", tone: "bg-(--emerald-deep) dark:bg-(--emerald)" },
  { id: "badgeDevelopment", mark: "dot", tone: "bg-(--blue-deep) dark:bg-(--blue)" },
  { id: "badgeArchitecture", mark: "icon", tone: "" },
] as const;

export function AboutHero() {
  const t = useTranslations("AboutPage");

  return (
    <section className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-7">
        <h1 className="font-[family-name:var(--font-display)] text-[2rem] leading-[1.14] font-semibold tracking-[var(--text-display-tracking)] text-(--color-text-primary) sm:text-[2.5rem] lg:text-[length:var(--text-display-size)] lg:leading-[var(--text-display-leading)]">
          <span className="block">{t("headlineLine1")}</span>
          <span className="block">{t("headlineLine2")}</span>
        </h1>

        <div className="mt-6 flex max-w-xl flex-col gap-4 text-[length:var(--text-body-lg-size)] leading-[1.625] tracking-[-0.008em] text-(--color-text-secondary)">
          <p>{t("body1")}</p>
          <p>{t("body2")}</p>
        </div>

        <ul className="mt-10 flex max-w-2xl flex-wrap gap-x-2 gap-y-3">
          {highlights.map((highlight) => (
            <li
              key={highlight.id}
              className="inline-flex items-center gap-2.5 rounded-full border border-(--hero-panel-border) bg-(--hero-panel-bg) px-4 py-2 text-[length:var(--text-button-size)] leading-[var(--text-button-leading)] font-semibold text-(--color-text-primary) shadow-[var(--shadow-sm)]"
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
              <p className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[rgb(28_36_56/0.8)] px-2.5 py-1 text-[length:var(--text-body-size)] leading-[var(--text-body-leading)] tracking-[-0.005em] text-[#34d399] shadow-[0_1px_2px_rgb(0_0_0/0.05)] backdrop-blur-[6px]">
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
