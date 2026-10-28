"use client";

import { useState } from "react";

import { LAUNCH_PHASES } from "@/lib/launch-center/types";

export function LaunchTimelineVisualization() {
  return (
    <section className="border border-line bg-panel">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Launch Timeline</p>
        <p className="mt-1 text-[11.5px] text-muted">Preparation → Pre-launch → Launch Day → Post-launch</p>
      </header>
      <div className="grid gap-px bg-line md:grid-cols-4 p-2">
        {LAUNCH_PHASES.map((phase) => (
          <article key={phase} className="bg-panel px-4 py-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-fg">{phase}</p>
            <div className="mt-3 space-y-2">
              {phase === "Preparation" ? (
                <>
                  <div className="border border-line px-3 py-2 text-[12px] text-fg">Finalize landing page copy</div>
                  <div className="border border-line px-3 py-2 text-[12px] text-fg">Confirm beta shortlist</div>
                </>
              ) : phase === "Pre-launch" ? (
                <>
                  <div className="border border-line px-3 py-2 text-[12px] text-fg">Draft launch announcement</div>
                  <div className="border border-line px-3 py-2 text-[12px] text-fg">Prepare demo script</div>
                </>
              ) : phase === "Launch Day" ? (
                <>
                  <div className="border border-line px-3 py-2 text-[12px] text-fg">Launch day push</div>
                  <div className="border border-line px-3 py-2 text-[12px] text-fg">Launch outreach emails</div>
                </>
              ) : (
                <p className="text-[11px] text-faint">No tasks scheduled</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
