import { AmbientGradient } from "@/ui/patterns/AmbientGradient";
import { pageContainerClassName } from "@/ui/shell/pageContainer";
import { WorkFilters } from "@/ui/work/containers/filters/WorkFilters";
import { WorkHero } from "@/ui/work/containers/hero/WorkHero";
import { TechMarquee } from "@/ui/work/containers/techMarquee/TechMarquee";

export function WorkView() {
  return (
    <main>
      <AmbientGradient variant="start" />
      <div
        className={`relative z-10 flex flex-col gap-8 pt-8 pb-28 sm:pt-28 sm:pb-20 xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-stretch xl:gap-x-16 xl:gap-y-8 ${pageContainerClassName}`}
      >
        <div className="xl:col-start-1 xl:row-start-1">
          <WorkHero />
        </div>
        <div className="xl:col-start-1 xl:row-start-2">
          <WorkFilters />
        </div>
        <TechMarquee
          orientation="vertical"
          className="col-start-2 row-span-2 row-start-1 hidden h-0 min-h-full overflow-hidden xl:flex"
        />
      </div>
    </main>
  );
}
