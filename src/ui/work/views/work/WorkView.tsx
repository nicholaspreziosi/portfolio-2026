import { AmbientGradient } from "@/ui/patterns/AmbientGradient";
import { pageContainerClassName } from "@/ui/shell/pageContainer";
import { CaseStudies } from "@/ui/work/containers/caseStudies/CaseStudies";
import { WorkHero } from "@/ui/work/containers/hero/WorkHero";
import { TechMarquee } from "@/ui/work/containers/techMarquee/TechMarquee";

export function WorkView() {
  return (
    <main>
      <AmbientGradient variant="start" />
      <div
        className={`relative z-10 flex h-screen flex-col justify-center pt-8 pb-24 sm:pt-28 sm:pb-10 xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-stretch xl:gap-x-16 ${pageContainerClassName}`}
      >
        <WorkHero />
        <TechMarquee
          orientation="vertical"
          className="col-start-2 hidden h-full min-h-0 overflow-hidden xl:flex"
        />
      </div>
      <CaseStudies />
    </main>
  );
}
