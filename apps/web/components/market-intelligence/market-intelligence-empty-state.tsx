"use client";

export function MarketEmptyWorkspace({
  onAddResearch,
  onAddCompetitor,
}: {
  onAddResearch: () => void;
  onAddCompetitor: () => void;
}) {
  const steps = [
    ["01", "Name the market question", "What do you need to understand before the product takes shape?"],
    ["02", "Write down what you already know", "Capture observations before interpretation pulls them apart."],
    ["03", "Map the alternatives", "Include the spreadsheet, the habit and the workaround."],
  ];

  return (
    <div className="grid gap-px bg-line lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <section className="bg-panel px-6 py-10 sm:px-9 sm:py-12">
        <p className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
          <span aria-hidden className="size-1.5 bg-mint" />
          Empty research workspace · sample state
        </p>
        <h2 className="mt-3 max-w-[24ch] text-[clamp(1.7rem,3vw,2.2rem)] font-medium leading-[1.06] tracking-[-0.04em] text-fg">
          Market understanding starts with a question you can write down.
        </h2>
        <p className="mt-3 max-w-[48ch] text-[13px] leading-relaxed text-muted">
          Add a research note or document a competitor. Segments and opportunities can follow
          once there is something concrete to connect them to.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAddResearch}
            className="inline-flex h-10 items-center gap-2 bg-mint px-4 text-[13px] font-medium text-ink transition duration-200 hover:brightness-95 active:translate-y-px"
          >
            <span aria-hidden className="text-[14px] leading-none">+</span>
            Add Research
          </button>
          <button
            type="button"
            onClick={onAddCompetitor}
            className="inline-flex h-10 items-center gap-2 border border-line-2 px-3.5 font-mono text-[9px] uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            <span aria-hidden className="text-[12px] leading-none">+</span>
            Add Competitor
          </button>
        </div>

        <p className="mt-6 border-t border-line pt-3 font-mono text-[8px] uppercase leading-relaxed tracking-[0.13em] text-faint">
          Preview state · no data is missing or lost
        </p>
      </section>

      <section className="bg-panel px-6 py-10 sm:px-8 sm:py-12">
        <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-faint">
          How this workspace fills up
        </p>
        <ol className="mt-3 border-t border-line">
          {steps.map(([number, title, body]) => (
            <li
              key={number}
              className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3 border-b border-line py-3.5"
            >
              <span className="font-mono text-[9px] tracking-[0.12em] text-accent">
                {number}
              </span>
              <div>
                <p className="text-[12px] font-medium text-fg">{title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-4 text-[11px] leading-relaxed text-faint">
          Nothing is inferred automatically. Every competitor, segment and opportunity in this
          module is entered by hand.
        </p>
      </section>
    </div>
  );
}
