import { AmbientGradient } from "@/ui/patterns/AmbientGradient";
import { WorkFilters } from "@/ui/work/containers/filters/WorkFilters";
import { WorkHero } from "@/ui/work/containers/hero/WorkHero";

export function WorkView() {
  return (
    <main>
      <AmbientGradient variant="start" />
      <div className="relative z-10 mx-auto flex w-full max-w-[82.5rem] flex-col gap-8 px-[var(--page-padding-x)] pt-8 pb-28 sm:pt-28 sm:pb-20">
        <WorkHero />
        <WorkFilters />
      </div>
    </main>
  );
}
