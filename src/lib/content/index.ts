import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { CaseStudy, ExperienceItem, Profile, Testimonial } from "./types";

const CONTENT_DIR = join(process.cwd(), "src/content");

function readJsonFile<T>(relativePath: string): T {
  const filePath = join(CONTENT_DIR, relativePath);
  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

export function getProfile(): Profile {
  return readJsonFile<Profile>("profile.json");
}

export function getExperience(): ExperienceItem[] {
  return readJsonFile<ExperienceItem[]>("experience.json");
}

export function getTestimonials(): Testimonial[] {
  return readJsonFile<Testimonial[]>("testimonials.json");
}

export function getCaseStudies(): CaseStudy[] {
  const directory = join(CONTENT_DIR, "case-studies");
  const files = readdirSync(directory).filter((file) => file.endsWith(".json"));

  return files
    .map((file) => {
      const filePath = join(directory, file);
      return JSON.parse(readFileSync(filePath, "utf8")) as CaseStudy;
    })
    .filter((caseStudy) => caseStudy.published)
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return getCaseStudies().find((caseStudy) => caseStudy.slug === slug);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return getCaseStudies().filter((caseStudy) => caseStudy.featured);
}
