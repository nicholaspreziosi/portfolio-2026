import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export type NextProject = {
  title: string;
  summary: string;
  href: string;
  external: boolean;
  image?: string;
  darkImage?: string;
  width?: number;
  height?: number;
  alt: string;
};

export function NextCaseStudy({ project }: { project: NextProject }) {
  const t = useTranslations("CaseStudyPage");
  const className =
    "group mt-4 grid overflow-hidden rounded-[24px] bg-(--card) shadow-[var(--study-card-shadow)] md:grid-cols-2";
  const body = (
    <>
      <div className="relative min-h-56 bg-(--surface-muted)">
        {project.image && project.width && project.height ? (
          <>
            <Image
              src={project.image}
              alt={project.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className={project.darkImage ? "object-cover object-top dark:hidden" : "object-cover object-top"}
            />
            {project.darkImage ? (
              <Image
                src={project.darkImage}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="hidden object-cover object-top dark:block"
              />
            ) : null}
          </>
        ) : null}
      </div>
      <div className="flex flex-col justify-center gap-3 p-6 sm:p-10">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-[-0.03em] text-(--color-text-primary)">
          {project.title}
        </h2>
        <p className="text-base leading-7 text-(--color-text-secondary)">{project.summary}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-(--color-text-primary)">
          {project.external ? t("live") : t("viewStudy")}
          {project.external ? (
            <ArrowUpRightIcon className="size-4" />
          ) : (
            <ArrowRightIcon className="size-4 rtl:rotate-180" />
          )}
        </span>
      </div>
    </>
  );

  return (
    <section aria-label={t("nextProject")} className="scroll-mt-28 border-t border-(--line) py-16 sm:py-20">
      <p className="text-xs font-medium tracking-[0.14em] text-(--color-text-secondary) uppercase">
        {t("nextProject")}
      </p>
      {project.external ? (
        <a href={project.href} target="_blank" rel="noopener noreferrer" className={className}>
          {body}
        </a>
      ) : (
        <Link href={project.href} className={className}>
          {body}
        </Link>
      )}
    </section>
  );
}
