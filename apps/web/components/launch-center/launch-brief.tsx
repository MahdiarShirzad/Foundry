"use client";

import { Button } from "@/components/ui/button";

import type {
  Channel,
  LaunchProduct,
  LaunchSection,
  LaunchTask,
} from "@/lib/launch-center/types";

import { LaunchPhaseBadge, LaunchStatusBadge } from "./badges";

export function LaunchBrief({
  product,
  tasks,
  channels,
  onOpenSection,
}: {
  product: LaunchProduct;
  tasks: LaunchTask[];
  channels: Channel[];
  onOpenSection: (section: LaunchSection) => void;
}) {
  const upcoming = tasks
    .filter((task) => task.status !== "Completed")
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <section className="border border-line bg-panel">
        <header className="border-b border-line px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            Launch brief
          </p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
            The narrative behind the plan: what is shipping, why now, and how it reaches people.
          </p>
        </header>
        <div className="divide-y divide-line">
          <div className="px-4 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-faint">
              Product positioning
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-fg">{product.summary}</p>
          </div>
          <div className="px-4 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-faint">
              Launch objective
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
              Release {product.name} to early adopters during {product.phase.toLowerCase()}, then
              use their feedback to shape the next release.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-faint">
              Launch shape
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <LaunchPhaseBadge phase={product.phase} />
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg">
                {product.launchDate}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
                {channels.length} channel{channels.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4">
        <section className="border border-line bg-panel">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                What happens next
              </p>
              <p className="mt-1 text-[11.5px] text-muted">Open work, earliest first</p>
            </div>
            <Button variant="ghost" size="xs" onClick={() => onOpenSection("Launch Plan")}>
              Full plan →
            </Button>
          </header>
          {upcoming.length === 0 ? (
            <p className="px-4 py-6 text-center text-[12px] leading-relaxed text-muted">
              No open tasks. Everything planned has been completed.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {upcoming.map((task) => (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => onOpenSection("Launch Plan")}
                    className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-mint-tint/25"
                  >
                    <span className="min-w-0">
                      <span className="block text-[12.5px] font-medium leading-snug text-fg">
                        {task.title}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-2">
                        <LaunchPhaseBadge phase={task.phase} />
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
                          {task.date}
                        </span>
                      </span>
                    </span>
                    <LaunchStatusBadge status={task.status} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-line bg-panel">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                Where we launch
              </p>
              <p className="mt-1 text-[11.5px] text-muted">Planned channels and campaigns</p>
            </div>
            <Button variant="ghost" size="xs" onClick={() => onOpenSection("Channels & Campaigns")}>
              All channels →
            </Button>
          </header>
          {channels.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-[12px] leading-relaxed text-muted">
                No channels planned yet. Add a campaign to define where this launch reaches people.
              </p>
              <Button
                variant="secondary"
                size="xs"
                className="mt-3"
                onClick={() => onOpenSection("Channels & Campaigns")}
              >
                Plan a channel
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {channels.map((channel) => (
                <li
                  key={channel.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="text-[12.5px] font-medium text-fg">{channel.name}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
                      {channel.date}
                    </span>
                  </span>
                  <LaunchStatusBadge status={channel.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
