"use client";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import type { Tone } from "@/components/ui/status";

import type {
  Channel,
  ChecklistItem,
  LaunchAsset,
  LaunchProduct,
  LaunchSection,
  LaunchTask,
} from "@/lib/launch-center/types";

/** Fixed "today" so the readiness summary never drifts between renders. */
const TODAY = "2026-10-30";

function daysUntil(date: string) {
  const start = new Date(`${TODAY}T00:00:00Z`).getTime();
  const end = new Date(`${date}T00:00:00Z`).getTime();
  return Math.round((end - start) / 86_400_000);
}

const BAR: Record<Tone, string> = {
  neutral: "bg-line-2",
  muted: "bg-line-2",
  info: "bg-info",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function LaunchOverview({
  product,
  tasks,
  assets,
  channels,
  checklist,
  checklistCompleted,
  onOpenSection,
}: {
  product: LaunchProduct;
  tasks: LaunchTask[];
  assets: LaunchAsset[];
  channels: Channel[];
  checklist: ChecklistItem[];
  checklistCompleted: number;
  onOpenSection: (section: LaunchSection) => void;
}) {
  const total = checklist.length;
  const readiness = total === 0 ? 0 : Math.round((checklistCompleted / total) * 100);
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const blockedTasks = tasks.filter((task) => task.status === "Blocked").length;
  const readyAssets = assets.filter((asset) => asset.status === "Ready").length;

  const status: { label: string; tone: Tone } =
    readiness >= 100
      ? { label: "Checklist complete", tone: "success" }
      : readiness >= 70
        ? { label: "Mostly ready", tone: "accent" }
        : readiness >= 40
          ? { label: "In progress", tone: "info" }
          : readiness > 0
            ? { label: "Early preparation", tone: "warning" }
            : { label: "Not started", tone: "muted" };

  const days = daysUntil(product.launchDate);
  const nextChecklist = checklist.find((item) => !item.completed);
  const nextTask = tasks.find((task) => task.status !== "Completed");
  const nextAction = nextChecklist
    ? { label: nextChecklist.item, section: "Checklist" as LaunchSection }
    : nextTask
      ? { label: nextTask.title, section: "Launch Plan" as LaunchSection }
      : null;

  return (
    <section className="border border-line bg-panel">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3.5">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            Launch readiness
          </p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
            Readiness is driven by the checklist. Tasks, assets and channels show what still needs
            attention.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={status.label} tone={status.tone} size="xs" />
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
            {days >= 0 ? `T−${days} days` : `${Math.abs(days)} days past target`}
          </span>
        </div>
      </header>

      <div className="grid gap-px bg-line lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="bg-panel px-4 py-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-faint">
                Checklist completion
              </p>
              <p className="mt-1.5 text-[2rem] font-medium leading-none tracking-[-0.04em] text-fg tabular-nums">
                {readiness}%
              </p>
            </div>
            <p className="pb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
              {checklistCompleted} / {total} items
            </p>
          </div>
          <div
            role="progressbar"
            aria-label="Launch checklist completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={readiness}
            className="mt-3 h-1.5 w-full overflow-hidden bg-surface-sunken"
          >
            <span
              className={`block h-full transition-[width] duration-300 ${BAR[status.tone]}`}
              style={{ width: `${readiness}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Button variant="secondary" size="sm" onClick={() => onOpenSection("Checklist")}>
              Open checklist
            </Button>
            {nextAction ? (
              <button
                type="button"
                onClick={() => onOpenSection(nextAction.section)}
                className="group inline-flex min-w-0 items-center gap-2 text-left text-[11.5px] leading-snug text-muted transition-colors hover:text-accent"
              >
                <span aria-hidden className="size-1 shrink-0 bg-accent" />
                <span className="truncate">Next: {nextAction.label}</span>
                <span aria-hidden className="shrink-0 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-line">
          {[
            {
              label: "Tasks",
              value: `${completedTasks}/${tasks.length}`,
              hint: blockedTasks > 0 ? `${blockedTasks} blocked` : "No blockers",
              tone: blockedTasks > 0 ? "text-danger" : undefined,
            },
            {
              label: "Assets ready",
              value: `${readyAssets}/${assets.length}`,
              hint: assets.length === 0 ? "None created" : "Prepared for launch",
            },
            {
              label: "Channels",
              value: `${channels.length}`,
              hint: channels.length === 0 ? "None planned" : "Planned campaigns",
            },
            {
              label: "Phase",
              value: product.phase,
              hint: product.launchDate,
              small: true,
            },
          ].map((item) => (
            <article key={item.label} className="min-w-0 bg-panel px-4 py-3.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-faint">
                {item.label}
              </p>
              <p
                className={`mt-1.5 min-w-0 text-fg ${
                  item.small
                    ? "text-[13px] font-medium leading-snug tracking-[-0.01em]"
                    : "text-[1.35rem] font-medium leading-none tracking-[-0.03em] tabular-nums"
                } ${item.tone ?? ""}`}
              >
                {item.value}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-muted">{item.hint}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
