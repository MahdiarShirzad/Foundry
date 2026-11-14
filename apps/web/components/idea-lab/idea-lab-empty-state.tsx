import { EmptyState } from "@/components/ui/primitives";

export function IdeaLabEmptyCollection({ onNewIdea }: { onNewIdea: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-3">
        <span className="text-[13px] font-medium text-fg">The collection</span>
        <span className="text-[12px] text-faint">0 ideas</span>
      </div>

      <EmptyState
        title="Start with the thought you keep returning to."
        description="An idea does not need to be complete. Name the problem and the lab will give you room to shape the rest."
        primary={{ label: "Capture the first idea", onClick: onNewIdea }}
        icon="plus"
      />
    </div>
  );
}

export function IdeaLabNoResults({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-3">
        <span className="text-[13px] font-medium text-fg">No matches</span>
        <span className="text-[12px] text-faint">0 results</span>
      </div>

      <EmptyState
        icon="search"
        title={query ? `Nothing matches “${query}”.` : "Nothing matches these filters."}
        description="Try a different term or return to the full collection."
        secondary={{ label: "Clear search & filters", onClick: onClear }}
      />
    </div>
  );
}

export function IdeaLabDetailEmpty() {
  const prompts = [
    ["01", "The problem", "What is broken, expensive, or unnecessarily hard?"],
    ["02", "The person", "Who feels it most often, and what do they do today?"],
    ["03", "The first assumption", "What would have to be true for this to matter?"],
  ];

  return (
    <div className="flex min-h-full items-center justify-center bg-panel px-6 py-14 sm:px-10">
      <div className="w-full max-w-[34rem]">
        <p className="text-[12px] font-medium text-accent">Stage 01 · Capture</p>
        <h2 className="mt-2 text-[clamp(1.4rem,2.4vw,1.75rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-fg">
          A clear idea begins with a problem you can name.
        </h2>
        <p className="mt-2.5 max-w-[46ch] text-[13.5px] leading-relaxed text-muted">
          Ideas can arrive messy. The lab gives them a place to become specific — one problem,
          one audience, and one assumption at a time.
        </p>

        <ol className="mt-6 divide-y divide-line border-y border-line">
          {prompts.map(([number, title, description]) => (
            <li
              key={number}
              className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3 py-3"
            >
              <span className="font-mono text-[11px] text-accent">{number}</span>
              <div>
                <p className="text-[13px] font-medium text-fg">{title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
