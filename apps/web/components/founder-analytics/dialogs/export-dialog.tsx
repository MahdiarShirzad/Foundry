"use client";

import { AnalyticsDialog } from "../primitives";

/**
 * Simulated export interaction: explains that exporting is not connected in
 * this UI prototype. It never claims a file was produced.
 */
export function ExportDialog({
  open,
  onClose,
  context,
}: {
  open: boolean;
  onClose: () => void;
  context: string;
}) {
  if (!open) return null;

  return (
    <AnalyticsDialog
      open
      onClose={onClose}
      eyebrow="Stage 08 / Learn"
      title="Export is not connected"
      description="This prototype does not generate or download files."
      footer={
        <button
          type="button"
          onClick={onClose}
          className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          Got it
        </button>
      }
    >
      <div className="space-y-4">
        <p className="text-[12.5px] leading-relaxed text-fg">
          In a connected build, this action would render the current view — {context} — as a file.
          Here it only opens this explanation: no report was generated, no file was downloaded, and
          nothing was sent anywhere.
        </p>

        <ul className="space-y-1.5 border border-line px-3 py-3">
          {[
            "No PDF or CSV generation in this prototype",
            "No scheduled or remote report jobs",
            "All figures remain the static demo dataset",
          ].map((line) => (
            <li key={line} className="flex items-baseline gap-2">
              <span aria-hidden className="mt-[5px] size-1.5 shrink-0 bg-line-2" />
              <span className="text-[12px] leading-relaxed text-muted">{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </AnalyticsDialog>
  );
}
