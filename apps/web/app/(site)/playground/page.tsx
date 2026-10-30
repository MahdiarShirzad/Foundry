import type { Metadata } from "next";

import Eyebrow from "@/components/site/eyebrow";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "A sandbox for walking an idea through the eight Foundry modules before committing real work — draft hypotheses, run validation, and watch context pass between stages.",
};

export default function PlaygroundPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-28 pt-40 sm:px-10 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--line),transparent)]"
        />

        <div className="mx-auto max-w-3xl">
          <Eyebrow>Sec. P — Playground</Eyebrow>

          <h1 className="mt-7 text-[clamp(2rem,4.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-fg">
            Playground
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            A sandbox for walking an idea through Foundry without touching a real
            project: draft market hypotheses, test validation criteria, and watch how
            each module hands context to the next. It runs against the same REST API
            documented in the reference.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="/docs"
              className="inline-flex h-11 items-center gap-2 bg-mint px-6 text-[15px] font-medium text-ink transition duration-200 hover:-translate-y-0.5 hover:brightness-95"
            >
              Read the documentation
              <span aria-hidden>→</span>
            </a>
            <a
              href="/examples"
              className="inline-flex h-11 items-center border border-line-2 px-6 text-[15px] text-fg transition-colors hover:border-accent hover:bg-mint-tint hover:text-accent"
            >
              See examples
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            What the playground does
          </h2>

          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            The playground is a throwaway sandbox. Nothing you type here is saved to a
            real project — it exists to let you explore the eight-module workflow and
            understand how evidence moves from stage to stage before you commit to
            building.
          </p>

          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                id: "01",
                name: "Idea Lab",
                verb: "Capture",
                desc: "Draft a problem statement, name the audience, and list your assumptions.",
              },
              {
                id: "02",
                name: "Market Intelligence",
                verb: "Investigate",
                desc: "Enter market segments, competitors, and turn findings into insights.",
              },
              {
                id: "03",
                name: "Validation Lab",
                verb: "Validate",
                desc: "Write falsifiable hypotheses, design experiments, and record findings.",
              },
              {
                id: "04",
                name: "MVP Studio",
                verb: "Build",
                desc: "Define MVP scope, cut non-essentials, and link requirements to evidence.",
              },
              {
                id: "05",
                name: "Product Roadmap",
                verb: "Plan",
                desc: "Set objectives, prioritize features, and phase the work into releases.",
              },
              {
                id: "06",
                name: "Launch Center",
                verb: "Launch",
                desc: "Set launch objectives, organize tasks, and plan positioning and messaging.",
              },
              {
                id: "07",
                name: "Feedback Hub",
                verb: "Listen",
                desc: "Collect user feedback, categorize by topic, and surface recurring problems.",
              },
              {
                id: "08",
                name: "Founder Analytics",
                verb: "Learn",
                desc: "Monitor metrics, track objectives, and feed insights into the next iteration.",
              },
            ].map((stage) => (
              <article
                key={stage.id}
                className="rounded-xl border border-line bg-panel p-6 hover:border-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                    {stage.id} · {stage.verb}
                  </span>
                  <h3 className="text-lg font-medium tracking-tight text-fg">{stage.name}</h3>
                </div>
                <p className="text-[13.5px] leading-relaxed text-muted">{stage.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 border-t border-line pt-8">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.28em] text-fg mb-4">
              Coming next
            </h3>
            <div className="rounded-xl border border-line bg-ink p-6 text-[#e9f5f2]">
              <p className="font-mono text-[13px] leading-relaxed">
                The interactive playground connects to the Foundry REST API. Until the
                backend modules land, use{' '}
                <a
                  href="/docs/backend-api"
                  className="text-accent underline decoration-line underline-offset-4 hover:decoration-accent"
                >
                  the API reference
                </a>{' '}
                to see what the server exposes today, or browse{' '}
                <a
                  href="/examples"
                  className="text-accent underline decoration-line underline-offset-4 hover:decoration-accent"
                >
                  worked examples
                </a>
                to see each module in action.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
