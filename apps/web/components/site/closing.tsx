import Eyebrow from "./eyebrow";
import Reveal from "./reveal";
import { AUDIENCES } from "./data";

const CLOSING_LINES = ["Build with clarity.", "Validate with evidence.", "Launch with purpose."];

export default function Closing() {
  return (
    <>
      <section
        id="audience"
        aria-labelledby="audience-title"
        className="relative isolate scroll-mt-16 overflow-hidden border-b border-line"
      >
        {/* Brightness as depth: this band is the page's lightest field, so the
            index of audiences reads as a lit surface between two darker blocks. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,transparent,var(--panel)_52%,transparent)] opacity-60" />
          <div className="absolute -right-24 top-10 size-[26rem] rounded-full bg-[radial-gradient(closest-side,var(--mint-tint),transparent_76%)]" />
        </div>

        <div className="relative px-6 py-20 sm:px-10 sm:py-24">
          <Reveal>
            <Eyebrow>Sec. 05 — Who it&apos;s for</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              id="audience-title"
              className="mt-8 text-[clamp(1.75rem,3.4vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.03em]"
            >
              Built for the people building.
            </h2>
          </Reveal>

          <div className="relative mt-10">
            {/* One backing sheet behind the index — a stack, not a second card. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 translate-x-2 translate-y-2 border border-line bg-panel/50"
            />
            <ul className="relative grid grid-cols-1 gap-x-8 border border-line bg-panel p-6 shadow-card sm:grid-cols-2 sm:p-8 lg:grid-cols-5 lg:gap-x-5">
              {AUDIENCES.map(([index, name, description], i) => (
                <li key={index} className="border-t border-line pt-5 pb-2">
                  <Reveal delay={0.06 * i}>
                    <span className="font-mono text-[11px] tracking-[0.2em] text-faint">
                      {index}
                    </span>
                    <p className="mt-2 text-[16px] font-medium tracking-tight">{name}</p>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
                      {description}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="closing-title"
        className="on-ink relative isolate overflow-hidden border-b border-line bg-bg text-fg"
      >
        <div
          aria-hidden
          className="blueprint pointer-events-none absolute inset-0"
          style={{
            maskImage:
              "radial-gradient(120% 90% at 50% 40%, rgb(0 0 0 / 0.9), transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(120% 90% at 50% 40%, rgb(0 0 0 / 0.9), transparent 75%)",
          }}
        />
        {/* Depth around, never behind, the type: the glow lifts the centre while
            the offset frames sit at the edges of the composition. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--mint-tint),transparent_72%)]" />
          <div className="absolute -left-24 top-16 hidden size-72 rotate-12 border border-line md:block" />
          <div className="absolute -right-28 bottom-10 hidden size-80 -rotate-6 border border-line md:block" />
          <div className="absolute -left-6 bottom-24 hidden size-24 rotate-45 border border-line md:block" />
          <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgb(247_249_248/0.07),transparent)]" />
        </div>
        <div className="relative flex flex-col items-center px-6 py-24 text-center sm:px-10 sm:py-32">
          <Reveal>
            <p className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              <span aria-hidden className="size-1.5 bg-mint" />
              From idea to launch
            </p>
          </Reveal>

          <h2
            id="closing-title"
            className="mt-8 text-[clamp(2rem,4.6vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.035em]"
          >
            {CLOSING_LINES.map((line, i) => (
              <Reveal key={line} delay={0.1 + i * 0.1}>
                <span className="block">
                  {line.slice(0, -1)}
                  <span className="text-accent">.</span>
                </span>
              </Reveal>
            ))}
          </h2>

          <Reveal delay={0.45}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#stages"
                className="group inline-flex h-12 items-center gap-2.5 bg-mint px-6 text-[15px] font-medium text-ink shadow-[0_18px_36px_-20px_rgb(14_124_108/0.75)] transition duration-200 hover:-translate-y-0.5 hover:brightness-95"
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
          </Reveal>

          <Reveal delay={0.55}>
            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-faint">
              One idea. Eight stages. One ecosystem.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}