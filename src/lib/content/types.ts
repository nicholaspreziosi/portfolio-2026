export type Capability =
  "product-design" | "design-systems" | "frontend-engineering" | "ai" | "brand" | "research";

export type MediaKind = "image" | "video" | "tall-screenshot";

export type MediaAsset = {
  src: string;
  alt: string;
  caption?: string;
  kind: MediaKind;
  width?: number;
  height?: number;
};

export type CaseStudySection = {
  id: string;
  title: string;
  body: string;
  media?: MediaAsset[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  year: number;
  client?: string;
  role: string;
  scope?: string;
  capabilities: Capability[];
  featured: boolean;
  published: boolean;
  hero: MediaAsset;
  overview: string;
  problem?: string;
  process?: string;
  decisions?: string;
  results?: string[];
  sections?: CaseStudySection[];
  gallery?: MediaAsset[];
  relatedSlugs?: string[];
};

export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  start: string;
  end?: string;
  summary: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  email?: string;
  availability?: string;
};
