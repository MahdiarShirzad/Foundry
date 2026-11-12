"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  ATTENTION,
  DECISIONS,
  HEATMAP,
  KPI_BY_RANGE,
  RANGE_DATA,
  RANGES,
  STAGE_LOAD,
  WORKSPACE,
  evidenceMix,
  type RangeKey,
} from "@/lib/dashboard/snapshot";
import { formatShortDate } from "@/lib/dashboard/types";
import { useHydrated } from "@/lib/use-hydrated";
import { useWorkspace } from "@/lib/workspace/use-workspace";

import ActivityHeatmap from "./activity-heatmap";
import AttentionTable from "./attention-table";
import EvidenceDonut from "./evidence-donut";
import GateLog from "./gate-log";
import KpiStrip from "./kpi-strip";
import { Panel, RangeTabs } from "./panel";
import StageBars from "./stage-bars";
import ThroughputChart from "./throughput-chart";

export default function DashboardOverview() {
  const reduce = useReducedMotion();
  const [range, setRange] = useState<RangeKey>(12);
  const [compare, setCompare] = useState(false);
  const [stage, setStage] = useState<string | null>(null);
  const { data: workspace } = useWorkspace();
  const hydrated = useHydrated();

  const dataset = RANGE_DATA[range];
  const kpis = KPI_BY_RANGE[range];
  const mix = evidenceMix(range);
  const canCompare = dataset.previous !== null;
  const stageName = STAGE_LOAD.find((entry) => entry.id === stage)?.name;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      <header className="relative overflow-hidden border border-line bg-panel shadow-[var(--elevation-lift)]">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-28 size-[20rem] rounded-full bg-mint-tint/70 blur-3xl"
        />
        <div className="relative flex flex-wrap items-end justify-between gap-5 px-5 py-5 sm:px-7 sm:py-6">
          <div className="min-w-0 max-w-[58ch]">
            <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
              <span aria-hidden className="size-1.5 bg-mint" />
              Workspace overview
            </p>
            <h1 className="mt-2.5 text-[clamp(1.9rem,3vw,2.45rem)] font-medium leading-[1.02] tracking-[-0.045em] text-fg">
              Cycle overview
            </h1>
            <p className="mt-3 max-w-[56ch] text-[13px] leading-relaxed text-muted">
              {hydrated && workspace ? workspace.name : "Your workspace"} · {ATTENTION.length}{" "}
              initiatives need a decision across the eight stages.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="border border-line bg-bg/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                {ATTENTION.length} need attention
              </span>
              <span className="border border-line bg-bg/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                as of {formatShortDate(WORKSPACE.asOf)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <RangeTabs options={RANGES} value={range} onChange={setRange} label="Time range" />

            <button
              type="button"
              onClick={() => setCompare((value) => !value)}
              aria-pressed={compare}
              disabled={!canCompare}
              title={
                canCompare
                  ? "Overlay the previous period as dashed lines"
                  : "A 26-week comparison needs 52 weeks of history"
              }
              className={`flex h-[30px] items-center gap-2 border px-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] transition-colors ${
                compare
                  ? "border-accent/40 bg-mint-tint text-accent"
                  : "border-line bg-panel text-faint hover:text-fg"
              } disabled:cursor-not-allowed disabled:border-line disabled:text-faint/60 disabled:hover:text-faint/60`}
            >
              <span aria-hidden className="block h-px w-4 border-t border-dashed border-current" />
              compare
            </button>
          </div>
        </div>
      </header>

      <KpiStrip kpis={kpis} />

      <div className="flex flex-wrap items-end justify-between gap-3 pt-1">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
            Cycle performance
          </p>
          <p className="mt-1 text-[11.5px] text-faint">
            Throughput, evidence mix, stage load and decisions for {dataset.label}.
          </p>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
          {dataset.label}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Panel
          title="Cycle throughput"
          description="Initiatives captured, validated and launched per week"
          className="lg:col-span-8"
          bodyClassName="px-0 pb-1 pt-0"
          action={
            <Link
              href="/docs/workflow"
              className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint underline decoration-line underline-offset-4 transition-colors hover:text-accent"
            >
              workflow ↗
            </Link>
          }
        >
          <ThroughputChart dataset={dataset} compare={compare} />
        </Panel>

        <Panel
          title="Evidence mix"
          description={`${dataset.label} · entries by kind`}
          className="lg:col-span-4"
        >
          <EvidenceDonut slices={mix} />
        </Panel>

        <Panel
          title="Stage load"
          description="Active initiatives per module"
          className="lg:col-span-7"
          action={
            <Link
              href="/dashboard/modules"
              className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint underline decoration-line underline-offset-4 transition-colors hover:text-accent"
            >
              all modules ↗
            </Link>
          }
        >
          <StageBars rows={STAGE_LOAD} selected={stage} onSelect={setStage} />
        </Panel>

        <Panel
          title="Workspace activity"
          description="Evidence logged per day · last 12 weeks"
          className="lg:col-span-5"
        >
          <ActivityHeatmap data={HEATMAP} />
        </Panel>

        <Panel
          title="Needs attention"
          description={
            stageName
              ? `Filtered to ${stageName}`
              : "Blocked, unresolved feedback, or past the stage window"
          }
          className="lg:col-span-8"
          action={
            stage ? (
              <button
                type="button"
                onClick={() => setStage(null)}
                className="flex items-center gap-1.5 border border-accent/40 bg-mint-tint px-1.5 py-[2px] font-mono text-[9px] uppercase tracking-[0.12em] text-accent"
              >
                {stage}
                <span aria-hidden>×</span>
                <span className="sr-only">Clear stage filter</span>
              </button>
            ) : null
          }
        >
          <AttentionTable
            rows={ATTENTION}
            stageFilter={stage}
            stageName={stageName}
            onClear={() => setStage(null)}
          />
        </Panel>

        <Panel
          title="Gate decisions"
          description="Latest eight-stage reviews"
          className="lg:col-span-4"
        >
          <GateLog rows={DECISIONS} />
        </Panel>
      </div>

    </motion.div>
  );
}
