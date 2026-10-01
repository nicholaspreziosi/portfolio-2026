import type { ReactNode } from "react";
import { cn } from "cn";
import { Badge } from "@/ui/shared/components/badge";

export function EyebrowBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Badge variant="eyebrow" className={cn("gap-1", className)}>
      <span
        aria-hidden
        className="gradient-button inline-block size-2 rounded-full shadow-[var(--hero-dot-shadow)]"
      />
      {children}
    </Badge>
  );
}
