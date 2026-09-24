"use client";

import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { InfiniteSlider } from "@/ui/shared/components/infinite-slider";

type Technology = {
  name: string;
  src: string;
  mono?: boolean;
};

const technologies = [
  { name: "React", src: "/logos/react.svg" },
  { name: "Next.js", src: "/logos/nextdotjs.svg", mono: true },
  { name: "TypeScript", src: "/logos/typescript.svg" },
  { name: "Tailwind", src: "/logos/tailwindcss.svg" },
  { name: "shadcn/ui", src: "/logos/shadcnui.svg", mono: true },
  { name: "React Native", src: "/logos/react-native.svg" },
  { name: "Motion", src: "/logos/motion.svg", mono: true },
  { name: "Node.js", src: "/logos/nodedotjs.svg" },
  { name: "Express", src: "/logos/express.svg", mono: true },
  { name: "Figma", src: "/logos/figma.svg" },
  { name: "Vercel AI SDK", src: "/logos/vercel.svg", mono: true },
  { name: "Firebase", src: "/logos/firebase.svg" },
  { name: "PostgreSQL", src: "/logos/postgresql.svg" },
  { name: "Sanity", src: "/logos/sanity.svg" },
  { name: "Cursor", src: "/logos/cursor.svg", mono: true },
  { name: "GitHub", src: "/logos/github.svg", mono: true },
  { name: "Jest", src: "/logos/jest.svg" },
  { name: "next-intl", src: "/logos/next-intl.svg", mono: true },
] as const satisfies readonly Technology[];

const firstColumn = technologies.slice(0, 9);
const secondColumn = technologies.slice(9);

const fadeVertical =
  "[mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]";
const fadeHorizontal =
  "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]";

function TechPill({ name, src, mono }: Technology) {
  return (
    <div className="flex items-center gap-2.5 rounded-full px-3 py-2.5">
      <img
        src={src}
        alt=""
        width={20}
        height={20}
        className={cn("size-5 shrink-0", mono && "dark:invert")}
      />
      <span className="text-[length:var(--text-caption-size)] leading-5 font-medium tracking-[-0.025em] whitespace-nowrap text-(--color-text-secondary)">
        {name}
      </span>
    </div>
  );
}

function TechList({ items }: { items: readonly Technology[] }) {
  return items.map((item) => <TechPill key={item.name} {...item} />);
}

export function TechMarquee() {
  const t = useTranslations("WorkPage");
  const reduceMotion = useReducedMotion();

  return (
    <div aria-label={t("techLabel")} role="region" className="min-w-0">
      <ul className="sr-only">
        {technologies.map((item) => (
          <li key={item.name}>{item.name}</li>
        ))}
      </ul>

      {reduceMotion ? (
        <ul className="flex flex-wrap gap-x-2 gap-y-1 xl:max-w-[19.5rem]" aria-hidden>
          {technologies.map((item) => (
            <li key={item.name}>
              <TechPill {...item} />
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div className={cn("flex flex-col gap-1 xl:hidden", fadeHorizontal)} aria-hidden>
            <InfiniteSlider gap={16} speed={36} speedOnHover={12}>
              <TechList items={firstColumn} />
            </InfiniteSlider>
            <InfiniteSlider gap={16} speed={36} speedOnHover={12} reverse>
              <TechList items={secondColumn} />
            </InfiniteSlider>
          </div>
          <div
            className={cn("hidden h-[340px] w-[19.5rem] shrink-0 gap-4 xl:flex", fadeVertical)}
            aria-hidden
          >
            <InfiniteSlider direction="vertical" gap={16} speed={28} speedOnHover={10} className="h-full">
              <TechList items={firstColumn} />
            </InfiniteSlider>
            <InfiniteSlider
              direction="vertical"
              gap={16}
              speed={28}
              speedOnHover={10}
              reverse
              className="h-full"
            >
              <TechList items={secondColumn} />
            </InfiniteSlider>
          </div>
        </>
      )}
    </div>
  );
}
