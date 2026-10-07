type AmbientGradientProps = {
  variant?: "centered" | "start";
  contained?: boolean;
};

export function AmbientGradient({
  variant = "centered",
  contained = false,
}: AmbientGradientProps) {
  return (
    <div
      aria-hidden
      className={`ambient ambient--${variant}${contained ? " ambient--contained" : ""}`}
    >
      <span className="ambient__glow" />
      <span className="ambient__frost" />
    </div>
  );
}
