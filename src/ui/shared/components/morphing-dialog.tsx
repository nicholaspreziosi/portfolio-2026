"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, MotionConfig, motion, type Transition, type Variant } from "motion/react";
import { XIcon } from "lucide-react";
import { cn } from "cn";
import { useClickOutside } from "@/ui/shared/hooks/useClickOutside";

type MorphingDialogContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  uniqueId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const MorphingDialogContext = createContext<MorphingDialogContextValue | null>(null);

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext);
  if (!context) throw new Error("useMorphingDialog must be used within a MorphingDialog");
  return context;
}

export type MorphingDialogProps = {
  children: ReactNode;
  transition?: Transition;
};

export function MorphingDialog({ children, transition }: MorphingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const value = useMemo(
    () => ({ isOpen, setIsOpen, uniqueId, triggerRef }),
    [isOpen, uniqueId]
  );

  return (
    <MorphingDialogContext.Provider value={value}>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </MorphingDialogContext.Provider>
  );
}

export type MorphingDialogTriggerProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  triggerRef?: RefObject<HTMLButtonElement | null>;
  ariaLabel?: string;
};

export function MorphingDialogTrigger({
  children,
  className,
  style,
  triggerRef,
  ariaLabel,
}: MorphingDialogTriggerProps) {
  const { setIsOpen, isOpen, uniqueId, triggerRef: contextTriggerRef } = useMorphingDialog();

  return (
    <motion.button
      type="button"
      ref={(node) => {
        contextTriggerRef.current = node;
        if (triggerRef) triggerRef.current = node;
      }}
      layoutId={`dialog-${uniqueId}`}
      className={cn("relative cursor-zoom-in", className)}
      style={style}
      onClick={() => setIsOpen(!isOpen)}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={`motion-ui-morphing-dialog-content-${uniqueId}`}
      aria-label={ariaLabel ?? "Open dialog"}
    >
      {children}
    </motion.button>
  );
}

export type MorphingDialogContainerProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function MorphingDialogContainer({ children }: MorphingDialogContainerProps) {
  const { isOpen, uniqueId, setIsOpen } = useMorphingDialog();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence initial={false} mode="sync">
      {isOpen ? (
        <>
          <motion.div
            key={`backdrop-${uniqueId}`}
            className="fixed inset-0 z-[80] bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8">
            {children}
          </div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export type MorphingDialogContentProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function MorphingDialogContent({ children, className, style }: MorphingDialogContentProps) {
  const { setIsOpen, uniqueId, triggerRef } = useMorphingDialog();
  const containerRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);
  useClickOutside(containerRef, close);

  useEffect(() => {
    const previouslyFocused = triggerRef.current;
    document.body.classList.add("overflow-hidden");
    containerRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab" || !containerRef.current) return;
      const focusable = [
        ...containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ),
      ].filter((element) => !element.hasAttribute("disabled"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("overflow-hidden");
      previouslyFocused?.focus();
    };
  }, [setIsOpen, triggerRef]);

  return (
    <motion.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn("relative overflow-hidden outline-none", className)}
      style={style}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      id={`motion-ui-morphing-dialog-content-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

export function MorphingDialogClose({
  children,
  className,
  label = "Close",
}: {
  children?: ReactNode;
  className?: string;
  variants?: { initial: Variant; animate: Variant; exit: Variant };
  label?: string;
}) {
  const { setIsOpen } = useMorphingDialog();

  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={() => setIsOpen(false)}
      className={cn(
        "absolute end-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-black/55 text-white",
        className
      )}
    >
      {children ?? <XIcon className="size-4" />}
    </motion.button>
  );
}

export function MorphingDialogTitle({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const { uniqueId } = useMorphingDialog();
  return (
    <motion.div layoutId={`dialog-title-${uniqueId}`} className={className} style={style} layout>
      {children}
    </motion.div>
  );
}

export function MorphingDialogSubtitle({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const { uniqueId } = useMorphingDialog();
  return (
    <motion.div layoutId={`dialog-subtitle-${uniqueId}`} className={className} style={style}>
      {children}
    </motion.div>
  );
}

export function MorphingDialogDescription({
  children,
  className,
  disableLayoutAnimation,
  variants,
}: {
  children: ReactNode;
  className?: string;
  disableLayoutAnimation?: boolean;
  variants?: { initial: Variant; animate: Variant; exit: Variant };
}) {
  const { uniqueId } = useMorphingDialog();
  return (
    <motion.div
      layoutId={disableLayoutAnimation ? undefined : `dialog-description-${uniqueId}`}
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

export function MorphingDialogImage({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}) {
  const { uniqueId } = useMorphingDialog();
  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn(className)}
      style={style}
      layoutId={`dialog-img-${uniqueId}`}
    />
  );
}
