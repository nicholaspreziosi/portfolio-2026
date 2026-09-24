import { AmbientGradient } from "@/ui/patterns/AmbientGradient";
import { pageContainerClassName } from "@/ui/shell/pageContainer";
import { WorkFilters } from "@/ui/work/containers/filters/WorkFilters";
import { WorkHero } from "@/ui/work/containers/hero/WorkHero";

export function WorkView() {
  return (
    <main>
      <AmbientGradient variant="start" />
      <div className={`relative z-10 flex flex-col gap-8 pt-8 pb-28 sm:pt-28 sm:pb-20 ${pageContainerClassName}`}>
        <WorkHero />
        <WorkFilters />
      </div>
    </main>
  );
}
