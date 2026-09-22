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
      <div className="ambient__stage">
        <span className="ambient__wash" />
        <span className="ambient__hero" />
        <span className="ambient__field ambient__field--start" />
        <span className="ambient__field ambient__field--end" />
      </div>
    </div>
  );
}
