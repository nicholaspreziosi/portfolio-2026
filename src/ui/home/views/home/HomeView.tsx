"use client";

import { HomeHero } from "@/ui/home/containers/hero/Hero";
import { ComponentShowcase } from "@/ui/home/containers/componentShowcase/ComponentShowcase";
import { pageContainerClassName } from "@/ui/shell/pageContainer";

export function HomeView() {
  return (
    <main>
      <HomeHero />
      <div className={`relative z-10 ${pageContainerClassName}`}>
        <ComponentShowcase />
      </div>
    </main>
  );
}
