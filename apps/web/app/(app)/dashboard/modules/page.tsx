import type { Metadata } from "next";
import Link from "next/link";

import { STAGES } from "@/components/site/data";
import { DEMO_INITIATIVES } from "@/lib/dashboard/demo";
import { ATTENTION, stageSlug } from "@/lib/dashboard/snapshot";

export const metadata: Metadata = {
  title: "Modules",
  description:
    "The eight Foundry modules — Idea Lab through Founder Analytics — with the initiatives currently sitting inside each stage.",
  robots: { index: false, follow: false },
};

export default function ModulesPage() {
  return (
    <div className="space-y-5">
      <header className="relative overflow-hidden border border-line bg-panel shadow-[var(--elevation-lift)]">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-28 size-[20rem] rounded-full bg-mint-tint/70 blur-3xl"
        />
        <div className="relative flex flex-wrap items-end justify-between gap-5 px-5 py-5 sm:px-7 sm:py-6">
          <div className="min-w-0 max-w-[58ch]">
            <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
              <span aria-hidden className="size-1.5 bg-mint" />
              Eight modules
            </p>
            <h1 className="mt-2.5 text-[clamp(1.9rem,3vw,2.45rem)] font-medium leading-[1.02] tracking-[-0.045em] text-fg">
              The cycle
            </h1>
            <p className="mt-3 max-w-[56ch] text-[13px] leading-relaxed text-muted">
              Every initiative sits in exactly one stage. Gates move it forward; evidence decides
              whether it returns.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="border border-line bg-bg/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                {DEMO_INITIATIVES.length} initiatives
              </span>
              <span className="border border-line bg-bg/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                {ATTENTION.length} need attention
              </span>
            </div>
          </div>
          <Link
            href="/docs/eight-stages"
            className="border border-line-2 bg-panel px-3 py-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            reference ↗
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap items-end justify-between gap-3 pt-1">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
            Stage rail
          </p>
          <p className="mt-1 text-[11.5px] text-faint">
            Every initiative sits in exactly one stage. Select a stage to jump to its module.
          </p>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
          {STAGES.length} stages
        </span>
      </div>

      {/* Horizontal cycle rail */}
      <div className="overflow-x-auto border border-line bg-panel shadow-[var(--elevation-lift)]">
        <ol className="flex min-w-max items-stretch">
          {STAGES.map((stage, index) => {
            const count = DEMO_INITIATIVES.filter((item) => item.stageId === stage.id).length;
            const flagged = ATTENTION.filter((row) => row.stageId === stage.id).length;
            return (
              <li key={stage.id} className="flex items-stretch">
                <Link
                  href={`#${stageSlug(stage.id)}`}
                  className="group flex w-[9.5rem] flex-col justify-between gap-3 px-4 py-4 transition-colors hover:bg-mint-tint/25"
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-[9px] tracking-[0.16em] text-accent">
                      {stage.id}
                    </span>
                    {flagged > 0 ? (
                      <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-danger">
                        {flagged} ⚠
                      </span>
                    ) : null}
                  </span>
                  <span className="text-[12px] font-medium leading-snug text-fg transition-colors group-hover:text-accent">
                    {stage.name}
                  </span>
                  <span className="flex items-baseline gap-1.5 border-t border-line/70 pt-2.5">
                    <span className="font-mono text-[1.5rem] font-medium leading-none tracking-[-0.03em] text-fg">
                      {count}
                    </span>
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint">
                      active
                    </span>
                  </span>
                </Link>
                {index < STAGES.length - 1 ? (
                  <span aria-hidden className="my-3 w-px shrink-0 bg-line" />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Stage detail grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {STAGES.map((stage) => {
          const items = DEMO_INITIATIVES.filter((item) => item.stageId === stage.id);
          const flagged = ATTENTION.filter((row) => row.stageId === stage.id);
          return (
            <section
              key={stage.id}
              id={stageSlug(stage.id)}
              className="scroll-mt-24 border border-line bg-panel shadow-[var(--elevation-lift)] transition-colors hover:border-line-2"
            >
              <header className="flex items-start justify-between gap-4 border-b border-line/80 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
                    {stage.id} / {stage.verb}
                  </p>
                  <h2 className="mt-1 text-[15px] font-medium tracking-[-0.015em] text-fg">
                    {stage.name}
                  </h2>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                    {stage.tagline}
                  </p>
                </div>
                <span className="shrink-0 border border-line bg-bg/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                  {items.length} active
                </span>
              </header>

              {items.length > 0 ? (
                <ul className="divide-y divide-line/70">
                  {items.map((item) => {
                    const row = flagged.find((entry) => entry.id === item.id);
                    return (
                      <li
                        key={item.id}
                        className="flex items-baseline justify-between gap-3 px-5 py-2.5 transition-colors hover:bg-mint-tint/15"
                      >
                        <span className="min-w-0 truncate text-[12px] text-fg">{item.name}</span>
                        <span className="flex shrink-0 items-baseline gap-2">
                          {row ? (
                            <span className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-danger">
                              {row.signal.kind === "blocked" ? "blocked" : `${row.days}d`}
                            </span>
                          ) : null}
                          <span className="font-mono text-[9px] text-faint">{item.owner}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mx-5 my-4 border border-dashed border-line px-3 py-4 text-center text-[11px] text-faint">
                  No initiative in this stage.
                </p>
              )}

              <footer className="flex items-center justify-between gap-3 border-t border-line/80 bg-bg/30 px-5 py-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                  {items.length} active · {flagged.length} flagged
                </span>
                <Link
                  href={`/docs/eight-stages#${stageSlug(stage.id)}`}
                  className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint underline decoration-line underline-offset-4 transition-colors hover:text-accent"
                >
                  docs ↗
                </Link>
              </footer>
            </section>
          );
        })}
      </div>
    </div>
  );
}
