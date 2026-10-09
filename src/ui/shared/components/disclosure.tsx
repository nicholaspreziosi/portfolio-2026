"use client";

import { createContext, useContext, useId, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  type Variant,
  type Variants,
} from "motion/react";
import { cn } from "cn";

type DisclosureContextValue = {
  open: boolean;
  toggle: () => void;
  variants?: { expanded: Variant; collapsed: Variant };
};

const DisclosureContext = createContext<DisclosureContextValue | null>(null);

function useDisclosure() {
  const context = useContext(DisclosureContext);
  if (!context) throw new Error("useDisclosure must be used within a Disclosure");
  return context;
}

export type DisclosureProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
  variants?: { expanded: Variant; collapsed: Variant };
  transition?: Transition;
};

export function Disclosure({
  open: openProp = false,
  onOpenChange,
  children,
  className,
  transition,
  variants,
}: DisclosureProps) {
  const [open, setOpen] = useState(openProp);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <MotionConfig transition={transition}>
      <div className={className}>
        <DisclosureContext.Provider value={{ open, toggle, variants }}>
          {children}
        </DisclosureContext.Provider>
      </div>
    </MotionConfig>
  );
}

export function DisclosureTrigger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { toggle, open } = useDisclosure();

  return (
    <button type="button" className={className} onClick={toggle} aria-expanded={open}>
      {children}
    </button>
  );
}

export function DisclosureContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open, variants } = useDisclosure();
  const panelId = useId();
  const baseVariants: Variants = {
    expanded: { height: "auto", opacity: 1 },
    collapsed: { height: 0, opacity: 0 },
  };

  return (
    <div className={cn("overflow-hidden", className)}>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={{
              expanded: { ...baseVariants.expanded, ...variants?.expanded },
              collapsed: { ...baseVariants.collapsed, ...variants?.collapsed },
            }}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
