"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { AnimatedGroup } from "@/ui/shared/components/animated-group";
import { InView } from "@/ui/shared/components/in-view";
import { pageContainerClassName } from "@/ui/shell/pageContainer";
import { WorkFilters } from "@/ui/work/containers/filters/WorkFilters";

const revealVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring" as const, duration: 1.2, bounce: 0.3 },
    },
  },
};

const reducedVariants = {
  container: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  },
  item: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  },
};

type ChipTone = "accent" | "muted" | "positive" | "positiveSoft" | "infoSoft";

const chipToneClass: Record<ChipTone, string> = {
  accent: "bg-(--study-chip-accent-bg) font-semibold text-(--study-chip-accent-fg)",
  muted: "bg-(--study-chip-muted-bg) font-medium text-(--study-chip-muted-fg)",
  positive: "bg-(--study-chip-positive-bg) font-semibold text-(--study-chip-positive-fg)",
  positiveSoft:
    "bg-(--study-chip-positive-soft-bg) font-medium text-(--study-chip-positive-soft-fg)",
  infoSoft: "bg-(--study-chip-info-soft-bg) font-medium text-(--study-chip-info-soft-fg)",
};

function Chips({ items }: { items: { label: string; tone: ChipTone }[] }) {
  return (
    <ul className="flex flex-wrap gap-1">
      {items.map((item) => (
        <li
          key={item.label}
          className={`inline-flex items-center rounded-pill px-2 py-0.5 text-[11px] leading-4 tracking-[0.02em] ${chipToneClass[item.tone]}`}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function StudyLink({ children, pill = false }: { children: string; pill?: boolean }) {
  return (
    <Link
      href="/work"
      className={
        pill
          ? "inline-flex shrink-0 items-center gap-1 rounded-pill bg-(--line-subtle) px-4 py-2 text-base leading-6 font-semibold tracking-[-0.01em] text-(--color-text-accent) shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-(--blue) focus-visible:outline-none"
          : "inline-flex shrink-0 items-center gap-1 text-base leading-6 font-semibold tracking-[-0.01em] text-(--color-text-accent) focus-visible:ring-2 focus-visible:ring-(--blue) focus-visible:outline-none"
      }
    >
      {children}
      <img src="/images/home/icon-arrow.svg" alt="" width={12} height={12} />
    </Link>
  );
}

function Status({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs leading-4 font-semibold text-(--success)">
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-(--success)" />
      {children}
    </span>
  );
}

function Meta({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs leading-4 tracking-[-0.005em] text-(--color-text-tertiary)">
      {children}
    </p>
  );
}

const mediaClass =
  "overflow-hidden rounded-[16px] bg-(--study-media-bg) shadow-[var(--shadow-sm)]";

const cardClass =
  "flex h-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[var(--study-card-shadow)]";

function FeaturedStudy() {
  return (
    <article className={`${cardClass} gap-6 p-5 sm:p-8 lg:p-10`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex max-w-[672px] flex-col gap-3">
          <Chips
            items={[
              { label: "Featured Flagship", tone: "accent" },
              { label: "UI/UX", tone: "muted" },
              { label: "Design Systems", tone: "muted" },
              { label: "Front-End", tone: "muted" },
              { label: "Fintech", tone: "muted" },
            ]}
          />
          <h2 className="font-[family-name:var(--font-display)] text-[1.75rem] leading-9 font-semibold tracking-[var(--text-title-tracking)] text-(--color-text-primary) sm:text-[length:var(--text-title-size)] sm:leading-[var(--text-title-leading)]">
            K Lab Product Ecosystem
          </h2>
          <p className="text-sm leading-[1.625] tracking-[-0.005em] text-(--color-text-secondary)">
            Multi-tier design token architecture and unified product patterns for a high-growth
            fintech platform handling multi-asset reconciliation and distributed payments.
          </p>
          <p className="pt-1 text-xs leading-4 text-(--color-text-secondary)">
            <span className="font-semibold text-(--color-text-primary)">Role:</span> Lead Product
            Designer &amp; Design Technologist (End-to-End Execution)
          </p>
        </div>
        <StudyLink pill>Explore Case Study</StudyLink>
      </div>

      <div className={`relative ${mediaClass}`}>
        <img
          src="/images/home/k-lab-ecosystem.jpg"
          alt="K Lab Product Ecosystem dashboard and design token compiler interface"
          width={512}
          height={286}
          loading="lazy"
          className="h-[240px] w-full object-cover sm:h-[380px] lg:h-[480px]"
        />
        <div className="absolute inset-x-3 bottom-3 flex max-w-md items-center gap-2 rounded-pill bg-(--study-overlay) p-2 shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)] backdrop-blur-[12px] sm:inset-x-auto sm:right-auto sm:left-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-(--study-chip-accent-bg)">
            <img src="/images/home/icon-token.svg" alt="" width={15} height={12} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[11px] leading-4 font-semibold tracking-[0.02em] text-(--color-text-primary)">
              tokens.semantic.color.accent
            </span>
            <span className="block truncate font-mono text-xs leading-4 text-(--color-text-tertiary)">
              $sys.color.primary-container → #0071e3
            </span>
          </span>
          <span className="shrink-0 rounded-pill bg-(--study-active-bg) px-1 py-px text-[11px] leading-4 font-semibold tracking-[0.02em] text-(--success)">
            Active
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-(--study-footer-border) bg-(--study-footer-bg) px-4 py-[17px]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-xs leading-4 font-semibold text-(--success)">
            <img src="/images/home/icon-check.svg" alt="" width={13.3333} height={13.3333} />
            99.4% Design-to-Code Parity
          </span>
          <span aria-hidden className="text-xs text-(--color-text-tertiary)">
            •
          </span>
          <span className="text-xs leading-4 font-medium text-(--color-text-secondary)">
            4 Core Product Patterns
          </span>
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-xs leading-5 tracking-[-0.005em] text-(--color-text-tertiary)">
          <img src="/images/home/icon-code.svg" alt="" width={11.6667} height={9.3333} />
          tokens.json: v2.14-dist
        </span>
      </div>
    </article>
  );
}

function GenesisStudy() {
  return (
    <article className={`${cardClass} justify-between p-6`}>
      <div className="flex flex-col gap-3">
        <Chips
          items={[
            { label: "AI Tooling", tone: "accent" },
            { label: "Node Canvas", tone: "muted" },
            { label: "Front-End", tone: "muted" },
            { label: "Deterministic Graph Execution", tone: "positiveSoft" },
          ]}
        />
        <h3 className="font-[family-name:var(--font-display)] text-2xl leading-8 font-semibold tracking-[-0.025em] text-(--color-text-primary)">
          Genesis AI Studio
        </h3>
        <p className="text-sm leading-[1.625] tracking-[-0.005em] text-(--color-text-secondary)">
          Visual prompt-engineering canvas and deterministic node-based workflow editor built for
          developer-led multi-model orchestration.
        </p>
        <p className="flex flex-wrap items-center gap-2 pt-1 text-xs leading-4 font-medium text-(--color-text-primary)">
          Role: Principal Product Architect &amp; UX Engineer
          <span aria-hidden className="font-normal text-(--color-text-secondary)">
            •
          </span>
          <Status>Sub-40ms Canvas Latency</Status>
        </p>
      </div>
      <div className="mt-6">
        <div className={mediaClass}>
          <img
            src="/images/home/genesis-ai-studio.jpg"
            alt="Genesis AI Studio visual prompt node editor workspace"
            width={512}
            height={286}
            loading="lazy"
            className="h-[220px] w-full object-cover sm:h-[280px] lg:h-[357px]"
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Meta>NODE_GRAPH_ENGINE_V2</Meta>
          <StudyLink>View Case Study</StudyLink>
        </div>
      </div>
    </article>
  );
}

function NexusStudy() {
  return (
    <article className={`${cardClass} justify-between p-6`}>
      <div className="flex flex-col gap-3">
        <Chips
          items={[
            { label: "Mobile", tone: "positive" },
            { label: "iOS UI/UX", tone: "muted" },
            { label: "Fintech", tone: "muted" },
            { label: "Sub-50ms Interaction", tone: "infoSoft" },
          ]}
        />
        <h3 className="font-[family-name:var(--font-display)] text-2xl leading-8 font-semibold tracking-[-0.025em] text-(--color-text-primary)">
          Nexus Mobile Exchange
        </h3>
        <p className="text-sm leading-[1.625] tracking-[-0.005em] text-(--color-text-secondary)">
          Next-generation crypto wallet and high-frequency trading mobile application engineered
          for precision, speed, and biometric authorization.
        </p>
        <p className="pt-1 text-xs leading-4 font-medium text-(--color-text-primary)">
          Role: UI/UX Lead &amp; iOS Prototyping
        </p>
      </div>
      <div className="mt-6">
        <div className="aspect-[4/3] overflow-hidden rounded-[16px] bg-[linear-gradient(37deg,var(--line-subtle)_0%,var(--paper-muted)_50%,rgb(111_251_190/0.2)_100%)] p-2 shadow-[var(--shadow-sm)]">
          <img
            src="/images/home/nexus-mobile.jpg"
            alt="Nexus Mobile Exchange crypto trading iOS application mockups"
            width={512}
            height={382}
            loading="lazy"
            className="size-full rounded-[48px] object-cover"
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Status>99.99% Trade Order Uptime</Status>
          <StudyLink>View Case Study</StudyLink>
        </div>
      </div>
    </article>
  );
}

function EnterpriseStudy() {
  return (
    <article className={`${cardClass} justify-between p-6`}>
      <div className="flex flex-col gap-3">
        <Chips
          items={[
            { label: "Systems", tone: "accent" },
            { label: "Tokens", tone: "muted" },
            { label: "W3C DTCG", tone: "muted" },
            { label: "Automated CI/CD Sync", tone: "positiveSoft" },
          ]}
        />
        <h3 className="font-[family-name:var(--font-display)] text-2xl leading-8 font-semibold tracking-[-0.025em] text-(--color-text-primary)">
          Enterprise Token Core
        </h3>
        <p className="text-sm leading-[1.625] tracking-[-0.005em] text-(--color-text-secondary)">
          W3C DTCG-compliant design token compiler and real-time interactive component inspector
          eliminating drift across React, Swift, and Figma.
        </p>
        <p className="pt-1 text-xs leading-4 font-medium text-(--color-text-primary)">
          Role: Design Systems Lead
        </p>
      </div>
      <div className="mt-6">
        <div className={mediaClass}>
          <img
            src="/images/home/enterprise-token-core.jpg"
            alt="Enterprise Token Core design system component inspector and token preview matrix"
            width={512}
            height={382}
            loading="lazy"
            className="h-[220px] w-full object-cover object-top sm:h-[260px] lg:h-[321px]"
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Meta>1,420 TOKENS COMPILED</Meta>
          <StudyLink>View Case Study</StudyLink>
        </div>
      </div>
    </article>
  );
}

const metrics = [
  {
    label: "Conversion",
    value: "+38%",
    caption: "Funnel Conversion",
    valueClass: "font-[family-name:var(--font-display)] text-xl leading-7 text-(--success)",
  },
  {
    label: "Latency",
    value: "< 90s",
    caption: "Median Verification",
    valueClass: "font-[family-name:var(--font-display)] text-xl leading-7 text-(--color-text-accent)",
  },
  {
    label: "Compliance",
    value: "SOC2 Type II",
    caption: "Compliant",
    valueClass: "text-base leading-6 text-(--color-text-primary)",
    captionClass: "font-medium text-(--success)",
  },
] as const;

function KycStudy() {
  return (
    <article className={`${cardClass} justify-between p-6`}>
      <div className="flex flex-col gap-3">
        <Chips
          items={[
            { label: "Growth & Compliance", tone: "positive" },
            { label: "UI/UX", tone: "muted" },
            { label: "Product", tone: "muted" },
            { label: "Global KYC", tone: "muted" },
          ]}
        />
        <h3 className="font-[family-name:var(--font-display)] text-2xl leading-8 font-semibold tracking-[-0.025em] text-(--color-text-primary)">
          K-Connect Onboarding &amp; KYC Flow
        </h3>
        <p className="text-sm leading-[1.625] tracking-[-0.005em] text-(--color-text-secondary)">
          Streamlined multi-jurisdiction compliance and self-service identity verification
          engineered with dynamic form micro-steps and adaptive validation.
        </p>
        <p className="pt-1 text-xs leading-4 font-medium text-(--color-text-primary)">
          Role: Product Design &amp; Front-End Architecture
        </p>
      </div>
      <div className="mt-6">
        <div className="flex flex-col gap-4 rounded-[16px] bg-[linear-gradient(164deg,var(--paper-muted)_0%,var(--line-subtle)_50%,rgb(215_226_255/0.2)_100%)] p-4 shadow-[var(--shadow-sm)]">
          <div className="grid gap-2 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[32px] bg-(--study-overlay) px-2 pt-2.5 pb-2 shadow-[var(--shadow-sm)] backdrop-blur-[6px] sm:rounded-[48px]"
              >
                <p className="text-xs leading-4 tracking-[0.05em] text-(--color-text-tertiary) uppercase">
                  {metric.label}
                </p>
                <p className={`mt-0.5 font-semibold tracking-[-0.012em] ${metric.valueClass}`}>
                  {metric.value}
                </p>
                <p
                  className={`text-xs leading-4 ${"captionClass" in metric ? metric.captionClass : "text-(--color-text-secondary)"}`}
                >
                  {metric.caption}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 rounded-[32px] bg-(--study-overlay-soft) px-2 py-2 shadow-[var(--shadow-sm)] backdrop-blur-[6px] sm:rounded-[48px]">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-(--study-chip-positive-bg)">
                <img src="/images/home/icon-trend.svg" alt="" width={15} height={9} />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] leading-4 font-semibold tracking-[0.02em] text-(--color-text-primary)">
                  Conversion Velocity
                </span>
                <span className="block text-xs leading-4 text-(--color-text-secondary)">
                  Drop-off reduced from 24.6% to 6.2%
                </span>
              </span>
            </div>
            <img src="/images/home/sparkline.svg" alt="" width={96} height={32} className="shrink-0" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Meta>GLOBAL_KYC_COMPLIANCE_SUITE</Meta>
          <StudyLink>View Case Study</StudyLink>
        </div>
      </div>
    </article>
  );
}

function StudyRow({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  const [seen, setSeen] = useState(false);
  const enter = useCallback(() => setSeen(true), []);
  const shown = Boolean(reduceMotion) || seen;

  return (
    <InView
      once
      className={className}
      viewOptions={{ once: true, margin: "0px 0px -80px 0px" }}
      variants={{ hidden: { opacity: 1 }, visible: { opacity: 1 } }}
      onViewportEnter={enter}
    >
      <AnimatedGroup
        active={shown}
        inheritChildClassName
        className="h-full"
        variants={reduceMotion ? reducedVariants : revealVariants}
      >
        {children}
      </AnimatedGroup>
    </InView>
  );
}

export function CaseStudies() {
  return (
    <section id="work" aria-label="Case studies" className="study-canvas relative z-10 bg-white py-16 sm:py-20">
      <div className={`${pageContainerClassName} flex flex-col gap-10`}>
        <WorkFilters />
        <div className="flex flex-col gap-10">
          <StudyRow>
            <FeaturedStudy />
          </StudyRow>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <StudyRow className="min-w-0 h-full lg:col-span-7">
              <GenesisStudy />
            </StudyRow>
            <StudyRow className="min-w-0 h-full lg:col-span-5">
              <NexusStudy />
            </StudyRow>
          </div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <StudyRow className="min-w-0 h-full lg:col-span-5">
              <EnterpriseStudy />
            </StudyRow>
            <StudyRow className="min-w-0 h-full lg:col-span-7">
              <KycStudy />
            </StudyRow>
          </div>
        </div>
      </div>
    </section>
  );
}
