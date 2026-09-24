import { AboutHero } from "@/ui/about/containers/hero/AboutHero";
import { AmbientGradient } from "@/ui/patterns/AmbientGradient";
import { pageContainerClassName } from "@/ui/shell/pageContainer";

export function AboutView() {
  return (
    <main>
      <AmbientGradient variant="start" />
      <div className={`relative z-10 pt-8 pb-28 sm:pt-28 sm:pb-20 ${pageContainerClassName}`}>
        <AboutHero />
      </div>
    </main>
  );
}
