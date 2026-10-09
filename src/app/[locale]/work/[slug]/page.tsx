import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getCaseStudies, getCaseStudy } from "@/lib/content";
import type { CaseStudy } from "@/lib/content/types";
import { studyBySlug } from "@/ui/work/containers/caseStudies/studies";
import type { NextProject } from "@/ui/work/containers/caseStudy/NextCaseStudy";
import { CaseStudyView } from "@/ui/work/views/caseStudy/CaseStudyView";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return getCaseStudies().map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.summary,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const study = getCaseStudy(slug);
  if (!study) notFound();

  const nextProject = await resolveNextProject(study, locale);
  return <CaseStudyView study={study} nextProject={nextProject} />;
}

async function resolveNextProject(study: CaseStudy, locale: Locale): Promise<NextProject | null> {
  if (!study.relatedSlug) return null;

  const related = getCaseStudy(study.relatedSlug);
  if (related) {
    return {
      title: related.title,
      summary: related.summary,
      href: `/work/${related.slug}`,
      external: false,
      image: related.hero.placeholder ? undefined : related.hero.src,
      darkImage: related.hero.darkSrc,
      width: related.hero.width,
      height: related.hero.height,
      alt: related.hero.alt,
    };
  }

  const listing = studyBySlug(study.relatedSlug);
  if (!listing) return null;

  const t = await getTranslations({ locale, namespace: "WorkPage" });
  const live = listing.actions.find((action) => action.type === "liveProject");

  return {
    title: t(`studies.items.${listing.id}.title`),
    summary: t(`studies.items.${listing.id}.description`),
    href: live && live.type === "liveProject" ? live.href : "/work",
    external: Boolean(live),
    image: listing.image,
    darkImage: listing.darkImage,
    width: listing.width,
    height: listing.height,
    alt: t(`studies.items.${listing.id}.alt`),
  };
}
