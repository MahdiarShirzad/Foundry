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
      className="space-y-6"
    >
      <header className="relative isolate">
        <span
          aria-hidden
          className="blueprint pointer-events-none absolute -inset-x-4 -top-5 -z-10 h-40 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_85%)] sm:-inset-x-6"
        />
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between xl:gap-10">
          <div className="min-w-0 max-w-[74ch]">
            <p className="text-[12px] text-faint">
              Workspace overview
            </p>
            <h1 className="mt-3 text-[clamp(1.75rem,2.6vw,2rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-fg">
              Cycle overview
            </h1>
            <p className="mt-2.5 max-w-[68ch] text-[14px] leading-relaxed text-muted">
              {hydrated && workspace ? workspace.name : "Your workspace"} ·{" "}
              {ATTENTION.length} initiatives need a decision across the eight stages.
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 text-[13px] text-muted">
              <span>{ATTENTION.length} need attention</span>
              <span aria-hidden className="size-1 rounded-full bg-line-2" />
              <span>As of {formatShortDate(WORKSPACE.asOf)}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:pt-1">
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
              className={`flex h-9 items-center gap-2 rounded-control border px-3 text-[12.5px] font-medium transition-colors duration-150 ${
                compare
                  ? "border-accent/50 bg-mint-tint/60 text-accent"
                  : "border-line bg-panel text-muted hover:text-fg"
              } disabled:cursor-not-allowed disabled:border-line disabled:text-faint/60 disabled:hover:text-faint/60`}
            >
              <span aria-hidden className="block h-px w-4 border-t border-dashed border-current" />
              Compare
            </button>
          </div>
        </div>
      </header>

      {ATTENTION.length > 0 ? (
        <a
          href="#needs-attention"
          className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-card border border-warning/25 bg-warning-tint/40 px-5 py-3.5 transition-colors hover:border-warning/40"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-warning" />
          <span className="text-[13.5px] font-medium text-fg">
            {ATTENTION.length} initiatives need a decision
          </span>
          <span className="text-[13px] text-muted">
            Blocked, unresolved feedback, or past the stage window.
          </span>
          <span className="ml-auto text-[13px] font-medium text-warning">Review below ↓</span>
        </a>
      ) : null}

      <KpiStrip kpis={kpis} />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold tracking-[-0.015em] text-fg">
            Cycle performance
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            Throughput, evidence mix, stage load and decisions for {dataset.label}.
          </p>
        </div>
        <span className="font-mono text-[12px] text-faint">{dataset.label}</span>
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
              className="text-[12.5px] font-medium text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              Workflow
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
              className="text-[12.5px] font-medium text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              All modules
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
                className="flex items-center gap-1.5 rounded-pill border border-accent/40 bg-mint-tint px-2.5 py-1 text-[12px] font-medium text-accent"
              >
                {stage}
                <span aria-hidden>×</span>
                <span className="sr-only">Clear stage filter</span>
              </button>
            ) : null
          }
        >
          <div id="needs-attention" className="scroll-mt-24">
            <AttentionTable
              rows={ATTENTION}
              stageFilter={stage}
              stageName={stageName}
              onClear={() => setStage(null)}
            />
          </div>
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
