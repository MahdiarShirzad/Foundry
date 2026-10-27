import Link from "next/link";

import Eyebrow from "./eyebrow";

/**
 * Shared treatment for the destinations that are on the roadmap but not built
 * yet. One component keeps the promise: every header/footer link resolves to a
 * real, branded page instead of a dead route.
 */
export default function Scaffold({
  eyebrow,
  title,
  description,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="relative overflow-hidden px-6 pb-28 pt-40 sm:px-10 lg:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--line),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--accent-dim),transparent)]"
      />

      <div className="relative mx-auto max-w-3xl">
        <Eyebrow>{`Sec. ${eyebrow} — Coming soon`}</Eyebrow>

        <h1
          className="mt-7 font-display text-4xl font-medium leading-[1.06] tracking-[-0.025em] text-foreground sm:text-5xl"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {title}
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {primary ? (
            <Link
              href={primary.href}
              className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {primary.label}
            </Link>
          ) : null}
          {secondary ? (
            <Link
              href={secondary.href}
              className="inline-flex h-11 items-center rounded-md border border-line px-6 text-sm font-medium text-foreground transition-colors hover:border-foreground/35 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {secondary.label}
            </Link>
          ) : null}
        </div>

        {/* Coordinate-style rule: a quiet nod to the planning table on the
            landing page, so scaffolds still read as Foundry pages. */}
        <div aria-hidden className="mt-16 flex items-center gap-3 text-muted-foreground/70">
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-[10px] tracking-[0.28em] uppercase">Foundry</span>
          <span className="h-px w-10 bg-accent/50" />
        </div>
      </div>
    </section>
  );
}
