"use client";

import { useState } from "react";
import { AmbientGradient } from "@/ui/patterns/AmbientGradient";

type Variant = "centered" | "start";

const variants: { id: Variant; label: string }[] = [
  { id: "centered", label: "Centered" },
  { id: "start", label: "Start" },
];

export default function GradientPreviewPage() {
  const [variant, setVariant] = useState<Variant>("centered");

  return (
    <div
      className="relative h-dvh overflow-hidden"
      style={{
        background: "var(--surface-primary)",
        color: "var(--color-text-primary)",
      }}
    >
      <AmbientGradient contained variant={variant} />
      <div className="relative z-10 flex h-full flex-col justify-between px-[var(--page-padding-x)] py-[var(--page-padding-y)]">
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex gap-1 rounded-full p-1"
            style={{
              background: "var(--surface-glass)",
              border: "1px solid var(--surface-glass-border)",
              backdropFilter: "blur(var(--surface-glass-blur))",
            }}
          >
            {variants.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={variant === item.id}
                onClick={() => setVariant(item.id)}
                className="rounded-full px-4 py-1.5 text-[13px]"
                style={{
                  background: variant === item.id ? "var(--surface-muted)" : "transparent",
                  color: "var(--color-text-primary)",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className={variant === "centered" ? "mx-auto max-w-3xl text-center" : "max-w-xl"}>
          <p
            className="text-[11px] font-semibold tracking-[0.05em] uppercase"
            style={{ color: "var(--color-text-accent)" }}
          >
            {variant}
          </p>
          <h1 className="gradient-text mt-4 font-semibold" style={{ fontSize: "var(--text-display-size)", lineHeight: "var(--text-display-leading)", letterSpacing: "var(--text-display-tracking)" }}>
            Designing intuitive products
          </h1>
          <p className="mt-4" style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-body-lg-size)", lineHeight: "var(--text-body-lg-leading)" }}>
            Ambient field behind the page. Surfaces cover it; they do not repaint it.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="gradient-button rounded-full px-4 py-2 text-[13px] font-medium">Brand button</span>
          <span className="inline-flex items-center gap-2 text-[13px]" style={{ color: "var(--color-text-secondary)" }}>
            <span className="gradient-accent size-2 rounded-full" />
            Accent
          </span>
        </div>
      </div>
    </div>
  );
}
