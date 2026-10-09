"use client";

import { useReducedMotion } from "motion/react";
import type { CaseStudyBlock, CaseStudySection as CaseStudySectionData } from "@/lib/content/types";
import { InView } from "@/ui/shared/components/in-view";
import { CaseStudyMediaGallery } from "@/ui/work/containers/caseStudy/CaseStudyMediaGallery";

const prose = "max-w-2xl text-base leading-7 text-(--color-text-secondary)";

export function CaseStudySection({ section }: { section: CaseStudySectionData }) {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <section id={section.id} className="scroll-mt-28 border-t border-(--line) py-16 sm:py-20">
      <InView
        once
        viewOptions={{ once: true, margin: "0px 0px -80px 0px" }}
        variants={
          reduceMotion
            ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
            : { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }
        }
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
      >
        <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-[-0.03em] text-(--color-text-primary) sm:text-4xl">
          {section.heading}
        </h2>
        {section.lede ? <p className={`mt-4 ${prose}`}>{section.lede}</p> : null}
        <div className="mt-8 flex flex-col gap-8">
          {section.blocks.map((block, index) => (
            <Block key={`${section.id}-${index}`} block={block} />
          ))}
        </div>
      </InView>
    </section>
  );
}

function Block({ block }: { block: CaseStudyBlock }) {
  if (block.type === "paragraphs") {
    return (
      <div className={`space-y-4 ${prose}`}>
        {block.text.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    );
  }

  if (block.type === "list") {
    return (
      <ul className={`${prose} list-disc space-y-2 ps-5`}>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "layers" || block.type === "steps") {
    const numbered = block.type === "steps" || block.numbered;
    return (
      <ol className="flex max-w-2xl flex-col gap-6">
        {block.items.map((item, index) => (
          <li key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)] gap-4">
            {numbered ? (
              <span className="pt-1 text-sm text-(--color-text-secondary)">{index + 1}</span>
            ) : (
              <span className="mt-2 size-1.5 rounded-full bg-foreground/40" />
            )}
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-(--color-text-primary)">
                {item.title}
              </h3>
              <p className="mt-2 text-base leading-7 text-(--color-text-secondary)">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "callout") {
    return (
      <aside className="max-w-2xl rounded-[16px] border border-(--line) bg-(--surface-elevated) p-6">
        {block.title ? (
          <p className="text-xs font-medium tracking-[0.12em] text-(--color-text-secondary) uppercase">
            {block.title}
          </p>
        ) : null}
        <p className="mt-3 text-base leading-7 text-(--color-text-primary)">{block.body}</p>
      </aside>
    );
  }

  if (block.type === "media") {
    return <CaseStudyMediaGallery group={block.group} />;
  }

  return (
    <div className="flex flex-col gap-16">
      {block.items.map((item) => (
        <div key={item.id} id={item.id} className="scroll-mt-28">
          <h3 className="max-w-2xl font-[family-name:var(--font-display)] text-2xl font-semibold tracking-[-0.02em] text-(--color-text-primary)">
            {item.heading}
          </h3>
          <p className={`mt-4 ${prose}`}>{item.body}</p>
          <div className="mt-8">
            <CaseStudyMediaGallery group={item.media} />
          </div>
        </div>
      ))}
    </div>
  );
}
