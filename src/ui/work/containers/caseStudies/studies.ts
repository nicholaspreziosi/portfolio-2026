export const capabilityIds = ["uiux", "frontend", "backend", "ai", "leadership"] as const;

export type CapabilityId = (typeof capabilityIds)[number];

export const filterIds = ["all", ...capabilityIds] as const;

export type FilterId = (typeof filterIds)[number];

export type ProjectAction =
  | { type: "caseStudy"; href: "/work" }
  | { type: "liveProject"; href: string }
  | { type: "repo"; href: string };

export const studyIds = [
  "kLabEcosystem",
  "kLabWebsite",
  "kasserole",
  "vmWaste",
  "drivenByAuto",
  "knightsTravails",
  "nickprez",
  "flowFitness",
] as const;

export type StudyId = (typeof studyIds)[number];

export type StudySpan = 5 | 7 | 12;

export type Study = {
  id: StudyId;
  span: StudySpan;
  capabilities: readonly CapabilityId[];
  actions: readonly ProjectAction[];
  image?: string;
  darkImage?: string;
  width?: number;
  height?: number;
};

const caseStudy = { type: "caseStudy", href: "/work" } as const;

export const studies = [
  {
    id: "kLabEcosystem",
    span: 12,
    capabilities: ["uiux", "frontend", "ai", "leadership"],
    actions: [caseStudy],
    image: "/images/work/k-lab-ecosystem.webp",
    darkImage: "/images/work/k-lab-ecosystem-dark.webp",
    width: 1024,
    height: 640,
  },
  {
    id: "kLabWebsite",
    span: 7,
    capabilities: ["frontend"],
    actions: [caseStudy, { type: "liveProject", href: "https://k-lab.ai/en" }],
    image: "/images/work/k-lab-website.webp",
    darkImage: "/images/work/k-lab-website-dark.webp",
    width: 1024,
    height: 640,
  },
  {
    id: "kasserole",
    span: 5,
    capabilities: ["frontend"],
    actions: [caseStudy, { type: "liveProject", href: "https://kasserole.com/" }],
    image: "/images/work/kasserole.webp",
    width: 800,
    height: 600,
  },
  {
    id: "vmWaste",
    span: 5,
    capabilities: ["uiux", "frontend", "leadership"],
    actions: [caseStudy, { type: "liveProject", href: "https://www.vnmwasteservices.com/" }],
    image: "/images/work/vm-waste.webp",
    width: 1024,
    height: 640,
  },
  {
    id: "drivenByAuto",
    span: 7,
    capabilities: ["uiux", "frontend"],
    actions: [caseStudy, { type: "liveProject", href: "https://www.drivenbyauto.com/" }],
    image: "/images/work/driven-by-auto.webp",
    width: 1024,
    height: 640,
  },
  {
    id: "knightsTravails",
    span: 7,
    capabilities: ["frontend"],
    actions: [
      caseStudy,
      { type: "liveProject", href: "https://nicholaspreziosi.github.io/knights-travails/" },
      { type: "repo", href: "https://github.com/nicholaspreziosi/knights-travails" },
    ],
    image: "/images/work/knights-travails.webp",
    width: 800,
    height: 600,
  },
  {
    id: "nickprez",
    span: 5,
    capabilities: ["uiux", "frontend", "backend", "ai"],
    actions: [
      caseStudy,
      { type: "repo", href: "https://github.com/nicholaspreziosi/portfolio-2026" },
    ],
    image: "/images/work/nickprez-dev.jpg",
    width: 1280,
    height: 720,
  },
  {
    id: "flowFitness",
    span: 5,
    capabilities: ["uiux", "frontend", "backend"],
    actions: [
      caseStudy,
      { type: "liveProject", href: "https://flow-fitness.vercel.app/" },
      { type: "repo", href: "https://github.com/nicholaspreziosi/fitness-app" },
    ],
  },
] as const satisfies readonly Study[];

export function countByFilter(items: readonly Study[]): Record<FilterId, number> {
  const counts: Record<FilterId, number> = {
    all: items.length,
    uiux: 0,
    frontend: 0,
    backend: 0,
    ai: 0,
    leadership: 0,
  };

  for (const study of items) {
    for (const capability of study.capabilities) {
      counts[capability] += 1;
    }
  }

  return counts;
}
