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
        className="scroll-mt-16 border-b border-line"
      >
        <div className="px-6 py-20 sm:px-10 sm:py-24">
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

          <ul className="mt-10 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-5">
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
      </section>

      <section
        aria-labelledby="closing-title"
        className="on-ink relative overflow-hidden border-b border-line bg-bg text-fg"
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
                className="group inline-flex h-12 items-center gap-2.5 bg-mint px-6 text-[15px] font-medium text-ink transition duration-200 hover:-translate-y-0.5 hover:brightness-95"
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