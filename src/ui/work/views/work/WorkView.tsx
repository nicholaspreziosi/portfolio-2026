import { CaseStudies } from "@/ui/work/containers/caseStudies/CaseStudies";
import { WorkHero } from "@/ui/work/containers/hero/WorkHero";

export function WorkView() {
  return (
    <main>
      <WorkHero />
      <CaseStudies />
    </main>
  );
}
