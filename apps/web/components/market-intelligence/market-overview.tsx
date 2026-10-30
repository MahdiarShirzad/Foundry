"use client";

import {
  EVIDENCE_META,
  EVIDENCE_TYPES,
  formatMarketShortDate,
  type MarketIdea,
  type MarketSection,
} from "@/lib/market-intelligence/types";

import {
  EvidenceBadge,
  OpportunityStatusBadge,
  ResearchStatusBadge,
  SectionLabel,
} from "./primitives";

export function MarketOverview({
  idea,
  onOpenSection,
  onOpenNote,
  onOpenOpportunity,
  onAddResearch,
}: {
  idea: MarketIdea;
  onOpenSection: (section: MarketSection) => void;
  onOpenNote: (noteId: string) => void;
  onOpenOpportunity: (opportunityId: string) => void;
  onAddResearch: () => void;
}) {
  const evidenceItems = [
    ...idea.competitors.map((item) => item.evidence),
    ...idea.segments.map((item) => item.evidence),
    ...idea.opportunities.map((item) => item.evidence),
    ...idea.notes.map((item) => item.evidence),
  ];
  const totalEvidence = evidenceItems.length;
  const mix = EVIDENCE_TYPES.map((type) => ({
    type,
    count: evidenceItems.filter((item) => item === type).length,
  })).filter((entry) => entry.count > 0);

  const recentNotes = [...idea.notes]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const activeOpportunities = idea.opportunities
    .filter((item) => item.status !== "parked")
    .slice(0, 3);
  const shownOpportunities =
    activeOpportunities.length > 0 ? activeOpportunities : idea.opportunities.slice(0, 3);

  return (
    <div className="divide-y divide-line">
      <div className="grid gap-px bg-line lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <section className="flex flex-col bg-panel px-5 py-6 sm:px-7 sm:py-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              <span aria-hidden className="size-1.5 bg-mint" />
              Market brief · {idea.ref}
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
              Sample hypothesis
            </span>
          </div>

          <h2 className="mt-4 max-w-[34ch] text-[clamp(1.35rem,2.4vw,1.85rem)] font-medium leading-[1.14] tracking-[-0.035em] text-fg">
            {idea.hypothesis}
          </h2>

          <div className="mt-6 grid gap-5 border-t border-line pt-5 sm:grid-cols-2 sm:gap-8">
            <div>
              <SectionLabel>Primary audience</SectionLabel>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                {idea.targetAudience}
              </p>
            </div>
            <div>
              <SectionLabel>The problem under investigation</SectionLabel>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{idea.problem}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 lg:mt-auto">
            <p className="text-[10.5px] leading-relaxed text-faint">
              A working belief to test — not a market forecast.
            </p>
            <EvidenceBadge type="hypothesis" />
          </div>
        </section>

        <section className="bg-panel px-5 py-6 sm:px-6 sm:py-7">
          <div className="flex items-baseline justify-between gap-3">
            <SectionLabel>Evidence mix</SectionLabel>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
              {totalEvidence} items
            </span>
          </div>

          <div
            role="img"
            aria-label={`Evidence mix: ${mix
              .map((entry) => `${entry.count} ${EVIDENCE_META[entry.type].label}`)
              .join(", ")}`}
            className="mt-3 flex h-2.5 w-full gap-px overflow-hidden bg-line"
          >
            {mix.map((entry) => (
              <span
                key={entry.type}
                className={EVIDENCE_META[entry.type].bar}
                style={{ width: `${(entry.count / totalEvidence) * 100}%` }}
              />
            ))}
          </div>

          <ul className="mt-4 space-y-0">
            {mix.map((entry) => {
              const meta = EVIDENCE_META[entry.type];
              return (
                <li
                  key={entry.type}
                  className="flex items-center justify-between gap-3 border-b border-line/70 py-2 last:border-b-0"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span aria-hidden className={`size-1.5 shrink-0 ${meta.bar}`} />
                    <span className="truncate text-[11.5px] text-muted">{meta.label}</span>
                  </span>
                  <span className="font-mono text-[10px] tabular-nums tracking-[0.08em] text-fg">
                    {String(entry.count).padStart(2, "0")}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 border-t border-line pt-3 text-[10.5px] leading-relaxed text-faint">
            Labels describe the maturity of this sample work, not external verification.
          </p>
        </section>
      </div>

      <section className="bg-panel px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <SectionLabel>Competitive landscape</SectionLabel>
          <button
            type="button"
            onClick={() => onOpenSection("competitors")}
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent underline-offset-4 hover:underline"
          >
            Open competitor workspace →
          </button>
        </div>

        <div className="mt-3 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10">
          <p className="max-w-[68ch] text-[13px] leading-relaxed text-muted">
            {idea.competitiveSummary}
          </p>

          <ul className="flex flex-wrap gap-1.5">
            {idea.competitors.map((competitor) => (
              <li key={competitor.id}>
                <button
                  type="button"
                  onClick={() => onOpenSection("competitors")}
                  className="inline-flex items-center gap-2 border border-line bg-bg/40 px-2.5 py-1.5 text-left transition-colors hover:border-line-2 hover:bg-panel"
                >
                  <span className="text-[11px] font-medium text-fg">{competitor.name}</span>
                  <ResearchStatusBadge status={competitor.status} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="grid gap-px bg-line lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <section className="bg-panel px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <SectionLabel>Recently added findings</SectionLabel>
            <button
              type="button"
              onClick={() => onOpenSection("notes")}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent underline-offset-4 hover:underline"
            >
              All {idea.notes.length} notes →
            </button>
          </div>

          <ul className="mt-3 border-t border-line">
            {recentNotes.map((note) => (
              <li key={note.id} className="border-b border-line/70 last:border-b-0">
                <button
                  type="button"
                  onClick={() => onOpenNote(note.id)}
                  className="group grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-3 py-3 text-left"
                >
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                        {formatMarketShortDate(note.date)}
                      </span>
                      <EvidenceBadge type={note.evidence} />
                    </span>
                    <span className="mt-1.5 block text-[12.5px] font-medium leading-snug text-fg transition-colors group-hover:text-accent">
                      {note.title}
                    </span>
                    <span className="mt-1 block line-clamp-2 text-[11px] leading-relaxed text-muted">
                      {note.excerpt}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="pt-1 font-mono text-[10px] text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                  >
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-panel px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <SectionLabel>Opportunities in view</SectionLabel>
            <button
              type="button"
              onClick={() => onOpenSection("opportunities")}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent underline-offset-4 hover:underline"
            >
              All {idea.opportunities.length} →
            </button>
          </div>

          <ol className="mt-3 border-t border-line">
            {shownOpportunities.map((opportunity, index) => {
              const segment = idea.segments.find((item) => item.id === opportunity.segmentId);
              return (
                <li key={opportunity.id} className="border-b border-line/70 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => onOpenOpportunity(opportunity.id)}
                    className="group grid w-full grid-cols-[1.5rem_minmax(0,1fr)] gap-2 py-3 text-left"
                  >
                    <span className="pt-0.5 font-mono text-[10px] tracking-[0.1em] text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[12.5px] font-medium leading-snug text-fg transition-colors group-hover:text-accent">
                        {opportunity.title}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5">
                        <EvidenceBadge type={opportunity.evidence} />
                        <OpportunityStatusBadge status={opportunity.status} />
                      </span>
                      <span className="mt-1.5 block text-[10.5px] leading-relaxed text-faint">
                        {segment?.name ?? "Segment not assigned"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <section className="bg-panel px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <SectionLabel>Unanswered research questions</SectionLabel>
          <button
            type="button"
            onClick={onAddResearch}
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent underline-offset-4 hover:underline"
          >
            Add a research note →
          </button>
        </div>

        <div className="mt-3 grid gap-x-10 sm:grid-cols-2">
          <ol className="border-t border-line">
            {idea.openQuestions.slice(0, Math.ceil(idea.openQuestions.length / 2)).map((question, index) => (
              <li
                key={question}
                className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 border-b border-line/70 py-2.5"
              >
                <span className="font-mono text-[10px] tracking-[0.1em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-[12px] leading-relaxed text-muted">{question}</p>
              </li>
            ))}
          </ol>
          <ol className="border-t border-line">
            {idea.openQuestions.slice(Math.ceil(idea.openQuestions.length / 2)).map((question, index) => (
              <li
                key={question}
                className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 border-b border-line/70 py-2.5"
              >
                <span className="font-mono text-[10px] tracking-[0.1em] text-accent">
                  {String(index + 1 + Math.ceil(idea.openQuestions.length / 2)).padStart(2, "0")}
                </span>
                <p className="text-[12px] leading-relaxed text-muted">{question}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-bg/45 px-5 py-3 sm:px-7">
        <p className="text-[10.5px] leading-relaxed text-faint">
          Every claim on this page belongs to the sample set. Treat it as a structure for
          research, not a conclusion.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-faint">
          Updated {formatMarketShortDate(idea.updatedAt)}
        </p>
      </div>
    </div>
  );
}
