"use client";

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useRef,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
} from "motion/react";
import { cn } from "cn";

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;

type DockDirection = "start" | "center" | "end";
type DockOrientation = "horizontal" | "vertical";

type DockProps = {
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  disableMagnification?: boolean;
  iconDistance?: number;
  iconPadding?: number;
  direction?: DockDirection;
  orientation?: DockOrientation;
  children: ReactNode;
};

type DockIconProps = HTMLMotionProps<"div"> & {
  size?: number;
  magnification?: number;
  disableMagnification?: boolean;
  distance?: number;
  iconPadding?: number;
  mousePosition?: MotionValue<number>;
  orientation?: DockOrientation;
  children?: ReactNode;
};

const Dock = forwardRef<HTMLDivElement, DockProps>(function Dock(
  {
    className,
    children,
    iconSize = DEFAULT_SIZE,
    iconMagnification = DEFAULT_MAGNIFICATION,
    disableMagnification = false,
    iconDistance = DEFAULT_DISTANCE,
    iconPadding,
    direction = "center",
    orientation = "horizontal",
  },
  ref,
) {
  const mousePosition = useMotionValue(Infinity);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(event) => {
        mousePosition.set(orientation === "vertical" ? event.clientY : event.clientX);
      }}
      onMouseLeave={() => mousePosition.set(Infinity)}
      className={cn(
        "m-0 flex w-max items-center justify-center gap-0",
        orientation === "vertical" ? "flex-col" : "flex-row",
        direction === "start" && "items-start",
        direction === "center" && "items-center",
        direction === "end" && "items-end",
        className,
      )}
    >
      {Children.map(children, (child) => {
        if (isValidElement<DockIconProps>(child) && child.type === DockIcon) {
          return cloneElement(child, {
            mousePosition,
            size: iconSize,
            magnification: iconMagnification,
            disableMagnification,
            distance: iconDistance,
            iconPadding,
            orientation,
          });
        }
        return child;
      })}
    </motion.div>
  );
});

function DockIcon({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  disableMagnification,
  distance = DEFAULT_DISTANCE,
  iconPadding,
  mousePosition,
  orientation = "horizontal",
  className,
  children,
  ...props
}: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const padding = iconPadding ?? Math.max(6, size * 0.2);
  const fallbackMouse = useMotionValue(Infinity);
  const mouse = mousePosition ?? fallbackMouse;

  const distanceFromPointer = useTransform(mouse, (value) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 };
    if (orientation === "vertical") return value - bounds.y - bounds.height / 2;
    return value - bounds.x - bounds.width / 2;
  });

  const sizeTransform = useTransform(
    distanceFromPointer,
    [-distance, 0, distance],
    [size, disableMagnification ? size : magnification, size],
  );
  const scaleSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: scaleSize, height: scaleSize, padding }}
      className={cn("flex aspect-square cursor-pointer items-center justify-center", className)}
      {...props}
    >
      <div className="flex size-full items-center justify-center">{children}</div>
    </motion.div>
  );
}

export { Dock, DockIcon };
export type { DockDirection, DockOrientation, DockIconProps, DockProps };
