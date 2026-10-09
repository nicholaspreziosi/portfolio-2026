export type MediaKind = "image" | "video" | "tall-screenshot";

export type MediaPresentation = "single" | "carousel" | "transition" | "comparison";

export type MediaAsset = {
  id: string;
  src: string;
  darkSrc?: string;
  alt: string;
  kind: MediaKind;
  width?: number;
  height?: number;
  caption?: string;
  detail?: string;
  placeholder?: boolean;
};

export type MediaComparison = {
  id: string;
  before: MediaAsset;
  after: MediaAsset;
  caption?: string;
  detail?: string;
};

export type MediaGroup = {
  id: string;
  presentation: MediaPresentation;
  items: MediaAsset[];
  comparison?: MediaComparison;
};

export type CaseStudyTextBlock = {
  title: string;
  body: string;
};

export type CaseStudyParagraphsBlock = {
  type: "paragraphs";
  text: string[];
};

export type CaseStudyListBlock = {
  type: "list";
  items: string[];
};

export type CaseStudyLayersBlock = {
  type: "layers";
  numbered?: boolean;
  items: CaseStudyTextBlock[];
};

export type CaseStudyStepsBlock = {
  type: "steps";
  items: CaseStudyTextBlock[];
};

export type CaseStudyCalloutBlock = {
  type: "callout";
  title?: string;
  body: string;
};

export type CaseStudyMediaBlock = {
  type: "media";
  group: MediaGroup;
};

export type FeaturedWorkItem = {
  id: string;
  heading: string;
  body: string;
  media: MediaGroup;
};

export type CaseStudyFeaturedBlock = {
  type: "featured";
  items: FeaturedWorkItem[];
};

export type CaseStudyBlock =
  | CaseStudyParagraphsBlock
  | CaseStudyListBlock
  | CaseStudyLayersBlock
  | CaseStudyStepsBlock
  | CaseStudyCalloutBlock
  | CaseStudyMediaBlock
  | CaseStudyFeaturedBlock;

export type CaseStudySection = {
  id: string;
  navLabel?: string;
  heading: string;
  lede?: string;
  blocks: CaseStudyBlock[];
};

export type CaseStudyLinks = {
  live?: string;
  repository?: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  year: number;
  client?: string;
  role: string;
  eyebrow: string;
  timeline: string;
  capabilities: string[];
  technologies?: string[];
  highlights?: string[];
  links?: CaseStudyLinks;
  featured: boolean;
  published: boolean;
  hero: MediaAsset;
  sections: CaseStudySection[];
  relatedSlug?: string;
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
