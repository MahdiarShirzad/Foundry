"use client";

import { useState } from "react";

import type { Channel, LaunchAsset } from "@/lib/launch-center/types";

import { LaunchStatusBadge, LaunchPhaseBadge, LaunchCenterEmptyState } from "../badges";
import { AddCampaignDialog } from "../dialogs/add-campaign-dialog";

export function ChannelCampaignWorkspace({
  channels,
  assets,
}: {
  channels: Channel[];
  assets: LaunchAsset[];
}) {
  const [selectedId, setSelectedId] = useState(channels[0]?.id ?? null);
  const [open, setOpen] = useState(false);

  const selected = channels.find((c) => c.id === selectedId) ?? channels[0] ?? null;
  const relatedAssets = selected ? assets.filter((a) => selected.relatedAssetIds.includes(a.id)) : [];
  if (channels.length === 0) {
    return <LaunchCenterEmptyState title="No planned campaigns" description="Add campaigns to plan promotional channels." action={<button type="button" onClick={() => setOpen(true)} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg">Add Campaign</button>} />;
  }

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
      <section className="bg-panel">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Channels &amp; Campaigns</p>
            <p className="mt-1 text-[11px] text-muted">{channels.length} planned</p>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-fg">Add campaign</button>
        </header>
        <div className="max-h-[520px] overflow-auto p-2 space-y-2">
          {channels.map((c) => {
            const active = c.id === selected?.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`w-full border-b border-line px-3 py-2 text-left transition-colors ${active ? "bg-mint-tint/30" : "hover:bg-mint-tint/10"}`}
              >
                <p className="text-[12px] text-fg">{c.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <LaunchStatusBadge status={c.status} />
                  <LaunchPhaseBadge phase={c.phase} />
                </div>
              </button>
            );
          })}
        </div>
      </section>
      <section className="bg-panel">
        {selected ? (
          <div className="space-y-6 px-6 py-5">
            <header>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Campaign Detail</p>
                  <h3 className="mt-2 text-[1.3rem] font-medium tracking-[-0.03em] text-fg">{selected.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <LaunchStatusBadge status={selected.status} />
                  <LaunchPhaseBadge phase={selected.phase} />
                </div>
              </div>
            </header>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Campaign objective</p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.campaignObjective}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Target audience</p>
              <p className="mt-2 text-[12px] text-fg">{selected.targetAudience}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Planned activity</p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.plannedActivity}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Launch phase</p>
                <p className="mt-2 text-[12px] text-fg">{selected.phase}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Planned date</p>
                <p className="mt-2 text-[12px] text-fg">{selected.date}</p>
              </div>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Related assets</p>
              <div className="mt-2 space-y-1">
                {relatedAssets.length === 0 ? <p className="text-[11px] text-faint">None linked</p> : relatedAssets.map((a) => <div key={a.id} className="border border-line px-3 py-2 text-[12px] text-fg">{a.title}</div>)}
              </div>
            </div>
          </div>
        ) : null}
      </section>
      <AddCampaignDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
