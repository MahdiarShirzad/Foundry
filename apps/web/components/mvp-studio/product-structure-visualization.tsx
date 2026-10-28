"use client";

export function ProductStructureVisualization() {
  return (
    <section className="border border-line bg-panel">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Product Structure Visualization</p>
        <p className="mt-1 text-[11.5px] text-muted">High-level structure of the MVP</p>
      </header>
      <div className="grid gap-px bg-line lg:grid-cols-2">
        <article className="bg-panel px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Core areas</p>
          <div className="mt-3 space-y-2">
            {["Capture", "Recall/Timeline", "Shortlist Management"].map((area) => (
              <div key={area} className="border border-line px-3 py-2 text-[12px] text-fg">{area}</div>
            ))}
          </div>
        </article>
        <article className="bg-panel px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">User journey (entry → primary value)</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-fg">
            <span className="border border-line px-2 py-1">Entry point</span>
            <span className="text-faint">→</span>
            <span className="border border-line px-2 py-1">Define/use core flow</span>
            <span className="text-faint">→</span>
            <span className="border border-line px-2 py-1">Primary value achieved</span>
          </div>
          <p className="mt-2 text-[11px] text-muted">Keep the first version focused on this path.</p>
        </article>
      </div>
    </section>
  );
}
