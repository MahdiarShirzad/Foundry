import StageCycle from "./stage-cycle";
import { HEAD_LINES, SPECS } from "./data";

/** Signature hero: editorial headline locked to a live diagram of the
 *  eight-stage cycle — the product's core concept, made interactive and
 *  composed as one scene: a fading seam binds the copy to the plate the
 *  cycle rests on. */
export default function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden border-b border-line"
    >
      {/* Layer 1 — the engineering field. */}
      <div
        aria-hidden
        className="blueprint pointer-events-none absolute inset-0"
        style={{
          maskImage: "linear-gradient(180deg, rgb(0 0 0 / 0.9), transparent 88%)",
          WebkitMaskImage: "linear-gradient(180deg, rgb(0 0 0 / 0.9), transparent 88%)",
        }}
      />

      {/* Layer 2 — atmosphere: two washes and a finer second grid frequency
          that gathers around the diagram instead of covering the whole page. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-40 size-[46rem] rounded-full bg-[radial-gradient(closest-side,var(--mint-tint),transparent_72%)]" />
        <div className="absolute -left-48 bottom-[-22rem] size-[40rem] rounded-full bg-[radial-gradient(closest-side,var(--accent-tint),transparent_74%)]" />
        <div
          className="blueprint-fine absolute inset-0 opacity-80"
          style={{
            maskImage: "radial-gradient(72% 62% at 74% 34%, #000, transparent 72%)",
            WebkitMaskImage: "radial-gradient(72% 62% at 74% 34%, #000, transparent 72%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(to_top,var(--bg),transparent)]" />
      </div>

      <div
        aria-hidden
        className="absolute left-2 top-1/2 hidden -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-faint xl:block"
        style={{ writingMode: "vertical-rl" }}
      >
        Foundry — the startup builder ecosystem
      </div>

      <div className="relative grid w-full items-center gap-14 px-6 py-16 sm:px-10 sm:py-20 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-12 lg:gap-8 lg:py-24">
        <div className="relative lg:col-span-7">
          <p
            className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-accent"
          >
            <span aria-hidden className="size-1.5 bg-mint" />
            The startup builder ecosystem
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[0.96] tracking-[-0.045em]"
          >
            {HEAD_LINES.map((line) => (
              <span key={line.text} className="block overflow-hidden pb-[0.06em]">
                <span
                  className={`block ${line.accent ? "text-accent" : ""}`}
                >
                  {line.text}
                </span>
              </span>
            ))}
          </h1>

          <p className="mt-7 max-w-[58ch] text-[17px] leading-[1.7] text-muted">
            Foundry turns raw ideas into validated, market-ready products — market
            research, validation, MVP, roadmap, launch, feedback and analytics in one
            connected workflow, so every stage informs the next.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#stages"
              className="group inline-flex h-12 items-center gap-2.5 bg-mint px-6 text-[15px] font-medium text-ink shadow-[0_18px_34px_-20px_rgb(14_124_108/0.55)] transition duration-200 hover:-translate-y-0.5 hover:brightness-95"
            >
              Explore the eight stages
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href="#workflow"
              className="inline-flex h-12 items-center border border-line-2 px-6 text-[15px] text-fg transition-colors hover:border-accent hover:bg-mint-tint hover:text-accent"
            >
              See how it works
            </a>
          </div>

          <dl className="mt-10 flex flex-wrap items-baseline border-t border-line pt-6 font-mono">
            {SPECS.map(([label, value]) => (
              <div key={label} className="pr-8">
                <dt className="text-[10px] uppercase tracking-[0.25em] text-faint">
                  {label}
                </dt>
                <dd className="mt-1 text-[13px] text-fg">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <StageCycle />
      </div>
    </section>
  );
}
