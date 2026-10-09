import { ArrowLeftIcon, ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CaseStudy } from "@/lib/content/types";
import { AmbientGradient } from "@/ui/patterns/AmbientGradient";
import { Button } from "@/ui/shared/components/button";
import { EyebrowBadge } from "@/ui/shared/components/eyebrow-badge";
import { pageContainerClassName } from "@/ui/shell/pageContainer";

export function CaseStudyHero({ study }: { study: CaseStudy }) {
  const t = useTranslations("CaseStudyPage");

  return (
    <header className="relative">
      <AmbientGradient variant="start" />
      <div className={`${pageContainerClassName} relative z-10 pt-24 pb-6 sm:pt-28 sm:pb-10`}>
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 text-sm text-(--color-text-secondary) transition-colors hover:text-(--color-text-primary)"
        >
          <ArrowLeftIcon className="size-4 rtl:rotate-180" />
          {t("back")}
        </Link>
        <div className="mt-8">
          <EyebrowBadge>{study.eyebrow}</EyebrowBadge>
        </div>
        <h1 className="mt-5 max-w-4xl font-[family-name:var(--font-display)] text-4xl leading-[1.08] font-semibold tracking-[-0.03em] text-(--color-text-primary) sm:text-5xl lg:text-6xl">
          {study.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-(--color-text-secondary)">{study.summary}</p>
        <dl className="mt-8 grid max-w-3xl gap-x-10 gap-y-4 sm:grid-cols-2">
          <Meta label={t("role")} value={study.role} />
          <Meta label={t("timeline")} value={study.timeline} />
          <Meta label={t("capabilities")} value={study.capabilities.join(" · ")} />
          {study.technologies?.length ? (
            <Meta label={t("technologies")} value={study.technologies.join(" · ")} />
          ) : null}
          {study.highlights?.length ? (
            <div className="sm:col-span-2">
              <Meta label={t("highlights")} value={study.highlights.join(" · ")} />
            </div>
          ) : null}
        </dl>
        {study.links?.live || study.links?.repository ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {study.links.live ? (
              <Button size="sm" asChild>
                <a href={study.links.live} target="_blank" rel="noopener noreferrer">
                  {t("live")}
                  <ArrowUpRightIcon data-icon="inline-end" />
                </a>
              </Button>
            ) : null}
            {study.links.repository ? (
              <Button size="sm" variant="outline" asChild>
                <a href={study.links.repository} target="_blank" rel="noopener noreferrer">
                  {t("repository")}
                  <ArrowUpRightIcon data-icon="inline-end" />
                </a>
              </Button>
            ) : null}
          </div>
        ) : null}
        <figure className="relative mt-10 aspect-[16/10] overflow-hidden rounded-[16px] bg-(--surface-muted)">
          <Image
            src={study.hero.src}
            alt={study.hero.alt}
            fill
            priority
            sizes="(min-width: 1440px) 1280px, 100vw"
            className={study.hero.darkSrc ? "object-cover object-top dark:hidden" : "object-cover object-top"}
          />
          {study.hero.darkSrc ? (
            <Image
              src={study.hero.darkSrc}
              alt=""
              fill
              priority
              sizes="(min-width: 1440px) 1280px, 100vw"
              className="hidden object-cover object-top dark:block"
            />
          ) : null}
        </figure>
      </div>
    </header>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-(--color-text-secondary)">{label}</dt>
      <dd className="mt-1 text-sm text-(--color-text-primary)">{value}</dd>
    </div>
  );
}
