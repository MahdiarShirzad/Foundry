"use client";

import { useMemo, useState } from "react";

import type { LaunchAsset } from "@/lib/launch-center/types";
import { LAUNCH_ASSET_STATUSES } from "@/lib/launch-center/types";

import { LaunchStatusBadge, LaunchCenterEmptyState } from "../badges";
import { AddLaunchAssetDialog } from "../dialogs/add-launch-asset-dialog";

export function LaunchAssetWorkspace({
  assets,
  channels,
}: {
  assets: LaunchAsset[];
  channels: { id: string; name: string }[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [selectedId, setSelectedId] = useState(assets[0]?.id ?? null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchesQuery = query ? a.title.toLowerCase().includes(query.toLowerCase()) : true;
      const matchesStatus = status === "all" ? true : a.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [assets, query, status]);

  const selected = assets.find((a) => a.id === selectedId) ?? filtered[0] ?? assets[0] ?? null;
  const channel = selected ? channels.find((c) => c.id === selected.relatedChannelId) : null;

  if (assets.length === 0) {
    return <LaunchCenterEmptyState title="Empty asset library" description="Add launch assets to organize launch content." action={<button type="button" onClick={() => setOpen(true)} className="border border-line px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg">Add Launch Asset</button>} />;
  }

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      <section className="bg-panel">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Launch Assets</p>
            <p className="mt-1 text-[11px] text-muted">{filtered.length} shown</p>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-fg">Add</button>
        </header>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search assets" className="h-7 flex-1 border border-line bg-panel px-2 text-[12px] text-fg outline-none focus:border-accent" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-7 border border-line bg-panel px-2 text-[11px] text-fg">
            <option value="all">All statuses</option>
            {LAUNCH_ASSET_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="max-h-[520px] overflow-auto">
          {filtered.map((a) => {
            const active = a.id === selected?.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedId(a.id)}
                className={`w-full border-b border-line px-4 py-3 text-left transition-colors ${active ? "bg-mint-tint/30" : "hover:bg-mint-tint/20"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12.5px] font-medium text-fg">{a.title}</p>
                  <LaunchStatusBadge status={a.status} />
                </div>
                <p className="mt-1 text-[11px] text-faint">{a.type}</p>
                <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">{a.lastUpdated}</div>
              </button>
            );
          })}
        </div>
      </section>
      <section className="bg-panel">
        {selected ? (
          <div className="space-y-6 px-6 py-5">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Asset Detail</p>
                <h3 className="mt-2 text-[1.3rem] font-medium tracking-[-0.03em] text-fg">{selected.title}</h3>
              </div>
              <LaunchStatusBadge status={selected.status} />
            </header>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Type</p>
              <p className="mt-2 text-[12px] text-fg">{selected.type}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Preview</p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">{selected.preview}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Status</p>
              <p className="mt-2 text-[12px] text-fg">{selected.status}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Last updated</p>
              <p className="mt-2 text-[12px] text-fg">{selected.lastUpdated}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Related channel</p>
              <p className="mt-2 text-[12px] text-fg">{channel?.name ?? selected.relatedChannelId ?? "None"}</p>
            </div>
          </div>
        ) : (
          <LaunchCenterEmptyState title="Select an asset" description="Choose an asset from the library to inspect details." />
        )}
      </section>
      <AddLaunchAssetDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
