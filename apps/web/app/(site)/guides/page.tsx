import type { Metadata } from "next";
import Link from "next/link";

import Eyebrow from "@/components/site/eyebrow";
import type { Stage } from "@/components/site/data";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Long-form, step-by-step walkthroughs of the Foundry workflow — capture, validate, build, plan, launch, listen, learn — with worked examples for each stage.",
};

type GuideCard = {
  id: string;
  stage: Stage;
  title: string;
  tagline: string;
  summary: string;
  steps: { number: number; label: string; what: string }[];
  depends: { stage: string; name: string }[];
  leadsTo: { stage: string; name: string }[];
};

const GUIDES: GuideCard[] = [
  {
    id: "idea-lab",
    stage: {
      id: "01",
      name: "Idea Lab",
      verb: "Capture",
      tagline: "Where ideas take shape.",
      detail: "",
      bullets: [],
      next: "02 Market Intelligence",
    },
    title: "Capture your first idea",
    tagline: "From a raw thought to a structured opportunity.",
    summary:
      "Turn an unstructured spark into a concrete product opportunity: define the problem, name the audience, state the solution, and document your assumptions before you write any code.",
    steps: [
      { number: 1, label: "Open Idea Lab", what: "Create a new idea record and give it a working title." },
      { number: 2, label: "Define the problem", what: "Write the problem statement in one sentence — what hurts, for whom, and why it matters." },
      { number: 3, label: "Name the audience", what: "Describe who experiences the problem and where they look for solutions today." },
      { number: 4, label: "State the solution", what: "Summarize your product's value proposition and how it solves the problem." },
      { number: 5, label: "Document assumptions", what: "List every belief that must be true for the idea to work — these become your validation criteria." },
      { number: 6, label: "Prioritize", what: "Compare competing ideas on impact, confidence, and ease before moving to market research." },
    ],
    depends: [],
    leadsTo: [{ stage: "02", name: "Market Intelligence" }],
  },
  {
    id: "market-intelligence",
    stage: {
      id: "02",
      name: "Market Intelligence",
      verb: "Investigate",
      tagline: "Understand the market before entering it.",
      detail: "",
      bullets: [],
      next: "03 Validation Lab",
    },
    title: "Research your market",
    tagline: "Map segments, competitors, and opportunities.",
    summary:
      "Investigate the environment your product will compete in: define target segments, research alternatives, and turn findings into actionable insights that feed validation.",
    steps: [
      { number: 1, label: "Pick your segments", what: "Define target markets and customer segments by size, need, and accessibility." },
      { number: 2, label: "Map the competition", what: "Research direct competitors and indirect alternatives — pricing, positioning, and gaps." },
      { number: 3, label: "Find the opening", what: "Identify opportunities and threats from your research, then write them as insights." },
      { number: 4, label: "Export to validation", what: "Pass the top market hypotheses into Validation Lab as testable assumptions." },
    ],
    depends: [{ stage: "01", name: "Idea Lab" }],
    leadsTo: [{ stage: "03", name: "Validation Lab" }],
  },
  {
    id: "validation-lab",
    stage: {
      id: "03",
      name: "Validation Lab",
      verb: "Validate",
      tagline: "Test assumptions before investing heavily.",
      detail: "",
      bullets: [],
      next: "04 MVP Studio",
    },
    title: "Run your first experiment",
    tagline: "Test assumptions and collect evidence.",
    summary:
      "Turn assumptions into hypotheses, design experiments and customer interviews, collect findings, and make an evidence-informed go / pivot / stop call before building.",
    steps: [
      { number: 1, label: "Write hypotheses", what: "Convert your assumptions into falsifiable statements with clear success criteria." },
      { number: 2, label: "Design experiments", what: "Plan landing-page tests, smoke tests, or customer interviews that can prove or disprove each hypothesis." },
      { number: 3, label: "Collect evidence", what: "Run the experiments, record findings, and track evidence against your validation criteria." },
      { number: 4, label: "Decide", what: "Make a go / pivot / stop call. Green light moves the idea into MVP Studio." },
    ],
    depends: [{ stage: "02", name: "Market Intelligence" }],
    leadsTo: [{ stage: "04", name: "MVP Studio" }],
  },
  {
    id: "mvp-studio",
    stage: {
      id: "04",
      name: "MVP Studio",
      verb: "Build",
      tagline: "Turn validated ideas into tangible products.",
      detail: "",
      bullets: [],
      next: "05 Product Roadmap",
    },
    title: "Scope your MVP",
    tagline: "Define a focused path to core value.",
    summary:
      "Translate a validated problem into a minimal product: define scope, separate must-haves from future work, and connect every requirement back to a validated problem.",
    steps: [
      { number: 1, label: "Import validation", what: "Pull the validated problem and success criteria from Validation Lab into MVP Studio." },
      { number: 2, label: "Define scope", what: "List essential features that deliver core value, and explicitly cut everything else." },
      { number: 3, label: "Connect to evidence", what: "Link each requirement to a validated problem or market insight so nothing is speculative." },
      { number: 4, label: "Freeze the first release", what: "Keep the MVP focused on core value — scope creep belongs in the roadmap, not version one." },
    ],
    depends: [{ stage: "03", name: "Validation Lab" }],
    leadsTo: [{ stage: "05", name: "Product Roadmap" }],
  },
  {
    id: "product-roadmap",
    stage: {
      id: "05",
      name: "Product Roadmap",
      verb: "Plan",
      tagline: "Give the product a clear direction.",
      detail: "",
      bullets: [],
      next: "06 Launch Center",
    },
    title: "Plan your roadmap",
    tagline: "Prioritize milestones and phases.",
    summary:
      "Translate product goals into an evolving, prioritized plan: set milestones, organize work into phases, and adapt as new evidence emerges.",
    steps: [
      { number: 1, label: "Set objectives", what: "Define product objectives from the MVP scope and validation findings." },
      { number: 2, label: "Prioritize", what: "Rank features and improvements by impact, effort, and evidence strength." },
      { number: 3, label: "Phase the work", what: "Organize the backlog into development phases with dates and owners." },
      { number: 4, label: "Review and adapt", what: "Revisit the roadmap as launch feedback and analytics arrive — iteration is built in." },
    ],
    depends: [{ stage: "04", name: "MVP Studio" }],
    leadsTo: [{ stage: "06", name: "Launch Center" }],
  },
  {
    id: "launch-center",
    stage: {
      id: "06",
      name: "Launch Center",
      verb: "Launch",
      tagline: "Prepare the product to meet the world.",
      detail: "",
      bullets: [],
      next: "07 Feedback Hub",
    },
    title: "Plan your launch",
    tagline: "Coordinate a market introduction.",
    summary:
      "Coordinate everything required to introduce the product to its audience: objectives, tasks, positioning, messaging, and post-launch actions.",
    steps: [
      { number: 1, label: "Define objectives", what: "Set launch goals and pick the audiences you're introducing the product to." },
      { number: 2, label: "Organize tasks", what: "Break the launch into tasks and milestones with owners and due dates." },
      { number: 3, label: "Plan positioning", what: "Write messaging that connects the product's value to the validated problem." },
      { number: 4, label: "Track execution", what: "Monitor launch and post-launch actions, then hand learnings to Feedback Hub." },
    ],
    depends: [{ stage: "05", name: "Product Roadmap" }],
    leadsTo: [{ stage: "07", name: "Feedback Hub" }],
  },
  {
    id: "feedback-hub",
    stage: {
      id: "07",
      name: "Feedback Hub",
      verb: "Listen",
      tagline: "Turn real user experiences into improvements.",
      detail: "",
      bullets: [],
      next: "08 Founder Analytics",
    },
    title: "Collect user feedback",
    tagline: "Connect real experiences to product decisions.",
    summary:
      "Create a structured channel between users and the product team: collect feedback, spot recurring problems, and turn insights into roadmap changes.",
    steps: [
      { number: 1, label: "Set up collection", what: "Choose channels — in-app prompts, support tickets, interviews — and route everything to one place." },
      { number: 2, label: "Categorize", what: "Tag feedback by topic, priority, and the stage of the product it refers to." },
      { number: 3, label: "Spot patterns", what: "Identify recurring problems and requests that signal real product gaps." },
      { number: 4, label: "Feed decisions", what: "Connect categorized feedback to roadmap items so product changes rest on user evidence." },
    ],
    depends: [{ stage: "06", name: "Launch Center" }],
    leadsTo: [{ stage: "08", name: "Founder Analytics" }],
  },
  {
    id: "founder-analytics",
    stage: {
      id: "08",
      name: "Founder Analytics",
      verb: "Learn",
      tagline: "Make decisions with evidence, not guesswork.",
      detail: "",
      bullets: [],
      next: "01 Idea Lab — insights & iteration",
    },
    title: "Measure and iterate",
    tagline: "Track metrics and guide the next cycle.",
    summary:
      "Bring product and startup signals together: monitor metrics, track progress against objectives, analyze trends, and use insights to start the next iteration.",
    steps: [
      { number: 1, label: "Choose metrics", what: "Select product and startup metrics that reflect your objectives and validation criteria." },
      { number: 2, label: "Build dashboards", what: "Visualize progress against objectives so the whole team sees the same numbers." },
      { number: 3, label: "Analyze trends", what: "Review feedback and performance trends to spot what's working and what needs to change." },
      { number: 4, label: "Restart the cycle", what: "Use insights to feed the next Idea Lab iteration — the loop closes on purpose." },
    ],
    depends: [{ stage: "07", name: "Feedback Hub" }],
    leadsTo: [{ stage: "01", name: "Idea Lab" }],
  },
];

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-panel px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
      {text}
    </span>
  );
}

function StepRow({ number, label, what }: { number: number; label: string; what: string }) {
  return (
    <div className="flex gap-3 py-3 border-b border-line last:border-b-0">
      <span className="shrink-0 w-8 h-8 rounded-full bg-accent text-ink font-mono text-[11px] font-medium flex items-center justify-center">
        {number}
      </span>
      <div>
        <p className="text-[14px] font-medium tracking-tight text-fg">{label}</p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{what}</p>
      </div>
    </div>
  );
}

function LinkPill({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center border border-line-2 rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-fg transition-colors hover:border-accent hover:text-accent hover:bg-mint-tint"
    >
      {label}
    </Link>
  );
}

export default function GuidesPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-28 pt-40 sm:px-10 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--line),transparent)]"
        />

        <div className="mx-auto max-w-3xl">
          <Eyebrow>Sec. G — Guides</Eyebrow>

          <h1 className="mt-7 text-[clamp(2rem,4.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-fg">
            Guides
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Step-by-step walkthroughs of the Foundry workflow — capture, validate,
            build, plan, launch, listen, learn. Each guide follows one stage of the
            eight-stage cycle and shows exactly what to do, in what order, before
            handing off to the next.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <LinkPill href="/docs/workflow" label="The workflow walkthrough" />
            <LinkPill href="/examples" label="Worked examples" />
            <LinkPill href="/playground" label="Try the playground" />
          </div>
        </div>
      </section>

      <section className="border-t border-line px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((guide) => (
              <article
                key={guide.id}
                className="group relative overflow-hidden rounded-xl border border-line bg-panel p-7 transition-colors hover:border-accent"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                      {guide.stage.id} · {guide.stage.verb}
                    </span>
                    <h3 className="mt-2 text-lg font-medium tracking-tight text-fg group-hover:text-accent">
                      {guide.title}
                    </h3>
                  </div>
                  <Badge text={guide.stage.name} />
                </div>

                <p className="text-[13.5px] leading-relaxed text-muted mb-6">
                  {guide.summary}
                </p>

                <ol className="mb-6 space-y-2">
                  {guide.steps.map((step) => (
                    <StepRow key={step.number} {...step} />
                  ))}
                </ol>

                <div className="grid gap-3 md:grid-cols-2">
                  {guide.depends.length > 0 && (
                    <div className="pt-3 border-t border-line">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint mb-2">
                        Requires
                      </p>
                      {guide.depends.map((d) => (
                        <LinkPill key={d.stage} href={`/guides#stage-${d.stage}`} label={d.name} />
                      ))}
                    </div>
                  )}
                  {guide.leadsTo.length > 0 && (
                    <div className="pt-3 border-t border-line">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint mb-2">
                        Leads to
                      </p>
                      {guide.leadsTo.map((d) => (
                        <LinkPill key={d.stage} href={`/guides#stage-${d.stage}`} label={d.name} />
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <LinkPill href="/docs/eight-stages" label="The eight stages reference" />
            <LinkPill href="/examples" label="See worked examples" />
            <LinkPill href="/playground" label="Open the playground" />
          </div>
        </div>
      </section>
    </>
  );
}
