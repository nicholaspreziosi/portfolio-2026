"use client";

import type { CaseStudy } from "@/lib/content/types";
import { pageContainerClassName } from "@/ui/shell/pageContainer";
import {
  CaseStudySectionNav,
  useCaseStudyNav,
} from "@/ui/work/containers/caseStudy/CaseStudySectionNav";
import { CaseStudySection } from "@/ui/work/containers/caseStudy/CaseStudySection";
import { NextCaseStudy, type NextProject } from "@/ui/work/containers/caseStudy/NextCaseStudy";

export function CaseStudyLayout({
  study,
  nextProject,
}: {
  study: CaseStudy;
  nextProject: NextProject | null;
}) {
  const sections = study.sections.filter((section) => section.navLabel);
  const { active, select, sectionRefs } = useCaseStudyNav(sections);

  return (
    <div className={`${pageContainerClassName} relative z-10 pb-8`}>
      <div className="lg:grid lg:grid-cols-[10.5rem_minmax(0,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[12rem_minmax(0,1fr)] xl:gap-14">
        <CaseStudySectionNav
          variant="rail"
          sections={sections}
          sectionRefs={sectionRefs}
          active={active}
          onSelect={select}
        />
        <div className="min-w-0">
          <CaseStudySectionNav
            variant="bar"
            sections={sections}
            sectionRefs={sectionRefs}
            active={active}
            onSelect={select}
          />
          <article>
            {study.sections.map((section) => {
              const navIndex = sections.findIndex((item) => item.id === section.id);
              return (
                <CaseStudySection
                  key={section.id}
                  section={section}
                  sectionRef={navIndex >= 0 ? sectionRefs[navIndex] : undefined}
                />
              );
            })}
          </article>
          {nextProject ? <NextCaseStudy project={nextProject} /> : null}
        </div>
      </div>
    </div>
  );
}
