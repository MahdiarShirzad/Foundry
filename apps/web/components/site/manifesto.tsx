import Eyebrow from "./eyebrow";
import Reveal from "./reveal";
import ManifestoDiagram from "./manifesto-diagram";

export default function Manifesto() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-title"
      className="relative isolate scroll-mt-16 overflow-hidden border-b border-line"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-16 size-[34rem] rounded-full bg-[radial-gradient(closest-side,var(--mint-tint),transparent_74%)]" />
        <div
          className="absolute -right-16 top-24 hidden size-[26rem] rotate-[8deg] border border-line md:block"
          style={{
            maskImage: "radial-gradient(closest-side, #000, transparent 78%)",
            WebkitMaskImage: "radial-gradient(closest-side, #000, transparent 78%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--line),transparent)]" />
      </div>

      <div className="relative px-6 py-20 sm:px-10 sm:py-28">
        <Reveal>
          <Eyebrow>Sec. 01 — Fragmentation</Eyebrow>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2
              id="problem-title"
              className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.03em]"
            >
              <span className="block">
                Most tools solve one problem exceptionally well.
              </span>
              <span className="mt-2 block text-accent">
                Foundry solves the fragmentation between them.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-5 lg:pt-3">
            <p className="max-w-[52ch] text-[16.5px] leading-[1.75] text-muted">
              A startup isn&apos;t just an idea, a roadmap, or a launch campaign. It&apos;s
              a sequence of interconnected decisions made under uncertainty — which is why
              every stage of building should inform the next.
            </p>
          </Reveal>
        </div>

        <ManifestoDiagram />
      </div>
    </section>
  );
}
