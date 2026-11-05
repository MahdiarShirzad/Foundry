import type { ReactNode } from "react";

type PlateProps = {
  children: ReactNode;
  /** Rendered on its own hairline below the body — recessed into the plate. */
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Secondary grid frequency inside the plate. Off for plates that already
   *  carry the primary blueprint. */
  grid?: boolean;
  /** Offset backing sheets — the page's recurring stack motif. */
  sheets?: boolean;
};

/**
 * A raised drafting surface. Large artwork (the stage cycle, the workflow
 * diagram, the architecture schematic) sits on one of these instead of
 * floating on the page field, which is what gives the page a mid plane
 * between the background and the foreground.
 */
export default function Plate({
  children,
  footer,
  className = "",
  bodyClassName = "",
  grid = true,
  sheets = true,
}: PlateProps) {
  return (
    <div className={`relative ${className}`}>
      {sheets ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
          <div className="sheet absolute inset-0 translate-x-4 translate-y-5 rotate-[3deg]" />
          <div className="sheet absolute inset-0 -translate-x-3 translate-y-2 rotate-[-2.2deg] opacity-80" />
        </div>
      ) : null}

      <div className="relative border border-line bg-panel shadow-plate">
        {grid ? (
          <div
            aria-hidden
            className="blueprint-fine pointer-events-none absolute inset-0 opacity-70"
            style={{
              maskImage: "radial-gradient(120% 100% at 50% 10%, #000, transparent 80%)",
              WebkitMaskImage: "radial-gradient(120% 100% at 50% 10%, #000, transparent 80%)",
            }}
          />
        ) : null}

        <div className={`relative ${bodyClassName}`}>{children}</div>

        {footer ? (
          <div className="relative border-t border-line bg-surface-sunken/25 px-4 pb-4 pt-4 sm:px-6 sm:pb-5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
