import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import Eyebrow from "@/components/site/eyebrow";
import { STAGES } from "@/components/site/data";

export const metadata: Metadata = {
  title: "Examples",
  description:
    "Worked, end-to-end scenarios showing all eight Foundry modules applied to a single product idea — from research inputs to validation criteria, scope, and metrics.",
};

type ModuleExample = {
  stage: (typeof STAGES)[number];
  input: string;
  output: string;
  artifact: string;
  next: string;
};

const EXAMPLES: ModuleExample[] = STAGES.map((stage) => ({
  stage,
  input: "",
  output: "",
  artifact: "",
  next: "",
}));

// Custom per-stage content, keyed by stage id.
const STAGE_CONTENT: Record<string, { input: string; output: string; artifact: string; next: string }> = {
  "01": {
    input: "A raw idea: \"A marketplace for indie game developers to sell digital assets directly to players.\"",
    output: "A structured opportunity record with problem, audience, solution, and assumptions.",
    artifact: "Idea record · ID #IL-042",
    next: "Feeds into Market Intelligence.",
  },
  "02": {
    input: "Idea record from Idea Lab plus a list of assumed customer segments.",
    output: "Two validated segments (solo devs, small studios), three direct competitors, and a pricing gap under $20/month.",
    artifact: "Market research brief · MI-042",
    next: "Hypotheses move into Validation Lab.",
  },
  "03": {
    input: "Market brief: top assumption is \"indie devs will pay $15/month for a zero-fee storefront.\"",
    output: "Landing-page test with 200 signups and 12 pre-orders — go decision with pricing at $14/month.",
    artifact: "Validation report · VL-042",
    next: "Validated problem moves into MVP Studio.",
  },
  "04": {
    input: "Validated problem: indies need a low-fee storefront with instant payouts.",
    output: "MVP scope: storefront listing, Stripe Connect payouts, asset delivery. Excluded: social features, subscriptions, analytics dashboard.",
    artifact: "MVP spec · MVP-042",
    next: "Scoped backlog moves into Product Roadmap.",
  },
  "05": {
    input: "MVP spec plus validation evidence on pricing and demand.",
    output: "Three-phase roadmap: Phase 1 (launch storefront), Phase 2 (team licenses), Phase 3 (analytics & promotions).",
    artifact: "Roadmap · PR-042",
    next: "Phase 1 tasks move into Launch Center.",
  },
  "06": {
    input: "Roadmap Phase 1: launch the storefront to indies.",
    output: "Launch plan with objectives, task list, positioning message, and post-launch checklist.",
    artifact: "Launch plan · LC-042",
    next: "Live product moves into Feedback Hub.",
  },
  "07": {
    input: "Storefront live; first 50 sellers onboarded.",
    output: "Feedback categorized: payout speed (high), discovery (medium), bulk upload (low).",
    artifact: "Feedback synthesis · FH-042",
    next: "Prioritized feedback moves into Founder Analytics.",
  },
  "08": {
    input: "Feedback synthesis plus live product metrics.",
    output: "Dashboard showing conversion, churn, and payout latency; decision to prioritize payout speed in next iteration.",
    artifact: "Analytics report · FA-042",
    next: "Insights cycle back to Idea Lab.",
  },
};

function ArtifactBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-panel px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
      {text}
    </span>
  );
}

function ChainChip({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center border border-line-2 rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-fg transition-colors hover:border-accent hover:text-accent hover:bg-mint-tint"
    >
      {label}
    </Link>
  );
}

export default function ExamplesPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-28 pt-40 sm:px-10 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--line),transparent)]"
        />

        <div className="mx-auto max-w-3xl">
          <Eyebrow>Sec. E — Examples</Eyebrow>

          <h1 className="mt-7 text-[clamp(2rem,4.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-fg">
            Examples
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Worked, end-to-end scenarios showing all eight Foundry modules applied to
            one product idea — a digital-asset marketplace for indie game developers.
            Each card traces one module: what goes in, what comes out, and the
            artifact it hands to the next stage.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ChainChip label="Guides" href="/guides" />
            <ChainChip label="The workflow walkthrough" href="/docs/workflow" />
            <ChainChip label="Try the playground" href="/playground" />
          </div>
        </div>
      </section>

      <section className="border-t border-line px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {EXAMPLES.map((example) => {
              const content = STAGE_CONTENT[example.stage.id];
              return (
                <article
                  key={example.stage.id}
                  className="group relative overflow-hidden rounded-xl border border-line bg-panel p-7 transition-colors hover:border-accent"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                        {example.stage.id} · {example.stage.verb}
                      </span>
                      <h3 className="mt-1.5 text-lg font-medium tracking-tight text-fg group-hover:text-accent">
                        {example.stage.name}
                      </h3>
                    </div>
                    <ArtifactBadge text={content.artifact} />
                  </div>

                  <div className="space-y-4">
                    <div className="pt-2 border-t border-line">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint mb-2">
                        Input
                      </p>
                      <p className="text-[13.5px] leading-relaxed text-muted">{content.input}</p>
                    </div>
                    <div className="pt-2 border-t border-line">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint mb-2">
                        Output
                      </p>
                      <p className="text-[13.5px] leading-relaxed text-muted">{content.output}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-line">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
                      Leads to
                    </p>
                    <Link
                      href={`/examples#stage-${example.stage.next.slice(0, 2)}`}
                      className="font-mono text-[13px] text-fg transition-colors hover:text-accent"
                    >
                      {example.stage.next} →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <ChainChip label="Guides" href="/guides" />
            <ChainChip label="The eight stages" href="/docs/eight-stages" />
            <ChainChip label="Try the playground" href="/playground" />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 pb-28 pt-20 sm:px-10 sm:py-32 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--line),transparent)]"
        />

        <div className="mx-auto max-w-3xl">
          <Image
            src="/logo.png"
            alt="Foundry"
            width={932}
            height={297}
            className="h-9 w-auto self-start sm:h-10 mb-8"
          />

          <h2 className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.03em] text-fg">
            See the full idea walk through
          </h2>

          <p className="mt-6 max-w-[52ch] text-[16.5px] leading-[1.75] text-muted">
            The examples above trace one product through all eight modules. Open the
            playground to draft your own hypothesis and watch how each module hands
            context to the next.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/playground"
              className="group inline-flex h-12 items-center gap-2.5 bg-mint px-6 text-[15px] font-medium text-ink transition duration-200 hover:-translate-y-0.5 hover:brightness-95"
            >
              Open the playground
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/guides"
              className="inline-flex h-12 items-center border border-line-2 px-6 text-[15px] text-fg transition-colors hover:border-accent hover:bg-mint-tint hover:text-accent"
            >
              Read the guides
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
