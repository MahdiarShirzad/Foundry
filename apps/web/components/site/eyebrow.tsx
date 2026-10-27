import type { ReactNode } from "react";

/** Mono section marker with a hairline rule — the page's recurring header motif. */
export default function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
        <span aria-hidden className="size-1.5 shrink-0 bg-mint" />
        {children}
      </span>
      <span aria-hidden className="h-px flex-1 bg-line" />
    </div>
  );
}