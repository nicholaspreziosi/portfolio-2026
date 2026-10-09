"use client";

import { MotionConfig } from "motion/react";
import type { CaseStudy } from "@/lib/content/types";
import { CaseStudyHero } from "@/ui/work/containers/caseStudy/CaseStudyHero";
import { CaseStudyLayout } from "@/ui/work/containers/caseStudy/CaseStudyLayout";
import type { NextProject } from "@/ui/work/containers/caseStudy/NextCaseStudy";

export function CaseStudyView({
  study,
  nextProject,
}: {
  study: CaseStudy;
  nextProject: NextProject | null;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <main>
        <CaseStudyHero study={study} />
        <CaseStudyLayout study={study} nextProject={nextProject} />
      </main>
    </MotionConfig>
  );
}
