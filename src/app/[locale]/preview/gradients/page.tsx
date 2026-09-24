"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AmbientGradient } from "@/ui/patterns/AmbientGradient";

type Variant = "centered" | "start";

const variants: Variant[] = ["centered", "start"];

export default function GradientPreviewPage() {
  const t = useTranslations("GradientPreview");
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
            className="flex gap-1 rounded-pill p-1"
            style={{
              background: "var(--surface-glass)",
              border: "1px solid var(--surface-glass-border)",
              backdropFilter: "blur(var(--surface-glass-blur))",
            }}
          >
            {variants.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={variant === item}
                onClick={() => setVariant(item)}
                className="rounded-pill px-4 py-1.5 text-[13px]"
                style={{
                  background: variant === item ? "var(--surface-muted)" : "transparent",
                  color: "var(--color-text-primary)",
                }}
              >
                {t(item)}
              </button>
            ))}
          </div>
        </div>

        <div className={variant === "centered" ? "mx-auto max-w-3xl text-center" : "max-w-xl"}>
          <p
            className="text-[11px] font-semibold tracking-[0.05em] uppercase"
            style={{ color: "var(--color-text-accent)" }}
          >
            {t(variant)}
          </p>
          <h1
            className="gradient-text mt-4 font-semibold"
            style={{
              fontSize: "var(--text-display-size)",
              lineHeight: "var(--text-display-leading)",
              letterSpacing: "var(--text-display-tracking)",
            }}
          >
            {t("heading")}
          </h1>
          <p
            className="mt-4"
            style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-body-lg-size)", lineHeight: "var(--text-body-lg-leading)" }}
          >
            {t("body")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="gradient-button rounded-pill px-4 py-2 text-[13px] font-medium">{t("button")}</span>
          <span className="inline-flex items-center gap-2 text-[13px]" style={{ color: "var(--color-text-secondary)" }}>
            <span className="gradient-accent size-2 rounded-full" />
            {t("accent")}
          </span>
        </div>
      </div>
    </div>
  );
}
