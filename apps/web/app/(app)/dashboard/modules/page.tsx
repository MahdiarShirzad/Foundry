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
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.24em] text-accent">
            <span aria-hidden className="size-1.5 bg-mint" />
            Eight modules
          </p>
          <h1 className="mt-2 text-[26px] font-medium leading-none tracking-[-0.035em] text-fg">
            The cycle
          </h1>
          <p className="mt-2 max-w-[56ch] text-[12.5px] leading-relaxed text-muted">
            Every initiative sits in exactly one stage. Gates move it forward; evidence decides
            whether it returns.
          </p>
        </div>
        <Link
          href="/docs/eight-stages"
          className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          reference ↗
        </Link>
      </header>

      {/* Horizontal cycle rail */}
      <div className="overflow-x-auto border border-line bg-panel">
        <ol className="flex min-w-max items-stretch">
          {STAGES.map((stage, index) => {
            const count = DEMO_INITIATIVES.filter((item) => item.stageId === stage.id).length;
            const flagged = ATTENTION.filter((row) => row.stageId === stage.id).length;
            return (
              <li key={stage.id} className="flex items-stretch">
                <Link
                  href={`#${stageSlug(stage.id)}`}
                  className="group flex w-[8.5rem] flex-col justify-between gap-2 px-3 py-3 transition-colors hover:bg-mint-tint/40"
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-[9.5px] tracking-[0.16em] text-faint">
                      {stage.id}
                    </span>
                    {flagged > 0 ? (
                      <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-danger">
                        {flagged} ⚠
                      </span>
                    ) : null}
                  </span>
                  <span className="text-[11.5px] leading-tight text-fg group-hover:text-accent">
                    {stage.name}
                  </span>
                  <span className="flex items-baseline gap-1">
                    <span className="font-mono text-[15px] leading-none text-fg">{count}</span>
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
      <div className="grid gap-px border border-line bg-line md:grid-cols-2">
        {STAGES.map((stage) => {
          const items = DEMO_INITIATIVES.filter((item) => item.stageId === stage.id);
          const flagged = ATTENTION.filter((row) => row.stageId === stage.id);
          return (
            <section
              key={stage.id}
              id={stageSlug(stage.id)}
              className="scroll-mt-20 bg-panel px-4 py-4 sm:px-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="flex items-baseline gap-2 text-[13.5px] font-medium text-fg">
                  <span className="font-mono text-[9.5px] tracking-[0.16em] text-accent">
                    {stage.id}
                  </span>
                  {stage.name}
                </h2>
                <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                  {stage.verb}
                </span>
              </div>

              <p className="mt-1 text-[11.5px] leading-relaxed text-muted">{stage.tagline}</p>

              {items.length > 0 ? (
                <ul className="mt-3 space-y-px">
                  {items.map((item) => {
                    const row = flagged.find((entry) => entry.id === item.id);
                    return (
                      <li
                        key={item.id}
                        className="flex items-baseline justify-between gap-3 border-t border-line/70 py-1.5"
                      >
                        <span className="min-w-0 truncate text-[11.5px] text-fg">{item.name}</span>
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
                <p className="mt-3 border border-dashed border-line px-3 py-3 text-[11px] text-faint">
                  No initiative in this stage.
                </p>
              )}

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                  {items.length} active · {flagged.length} flagged
                </span>
                <Link
                  href={`/docs/eight-stages#${stageSlug(stage.id)}`}
                  className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint underline decoration-line underline-offset-4 transition-colors hover:text-accent"
                >
                  docs ↗
                </Link>
              </div>
            </section>
          );
        })}
      </div>

      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
        sample workspace · presentation only
      </p>
    </div>
  );
}
