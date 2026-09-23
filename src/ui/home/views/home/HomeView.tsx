"use client";

import { Hero } from "@/ui/home/containers/hero/Hero";
import { ComponentShowcase } from "@/ui/home/containers/componentShowcase/ComponentShowcase";
import { HeroAmbient } from "@/ui/home/containers/heroAmbient/HeroAmbient";

export function HomeView() {
  return (
    <main>
      <HeroAmbient />
      <div className="relative z-10">
        <Hero />
        <ComponentShowcase />
      </div>
    </main>
  );
}
