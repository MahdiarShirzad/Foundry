"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  ANALYTICS_PRODUCTS,
  ANALYTICS_RANGES,
  type AnalyticsSection,
  type Observation,
  type ObservationDraft,
  type RangeKey,
  type SeriesKey,
} from "@/lib/founder-analytics/types";
import {
  getAnalyticsDataset,
  getAnalyticsProduct,
} from "@/lib/founder-analytics/demo";

import { AnalyticsWorkspaceNavigation } from "./analytics-workspace-navigation";
import { ExportDialog } from "./dialogs/export-dialog";
import { FounderAnalyticsHeader, type HeaderView } from "./founder-analytics-header";
import { formatWindow } from "./format";
import { OverviewSection } from "./sections/overview-section";
import { ProductMetricsSection } from "./sections/product-metrics-section";
import { ReportsSection } from "./sections/reports-section";
import { RetentionSection } from "./sections/retention-section";
import { UserBehaviorSection } from "./sections/user-behavior-section";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Two hand-written notes so the observation list starts with sample content. */
const SEED_OBSERVATIONS: Observation[] = [
  {
    id: "obs-seed-1",
    productId: "helio-notes",
    title: "Check whether shorter sessions are healthy",
    description:
      "Sample note: average session length in the demo data grows slowly while sessions per user grows faster. That can mean a smoother flow or more repeated work — the demo data cannot tell.",
    metricId: "avg-duration",
    type: "Question",
    nextStep: "Pair duration with feature usage before drawing a conclusion.",
    sample: true,
  },
  {
    id: "obs-seed-2",
    productId: "helio-notes",
    title: "Onboarding interactions deserve a closer look",
    description:
      "Sample note: Onboarding carries the second-largest interaction count in the demo data, which is expected for a new-account heavy window but worth confirming against real setup completion.",
    metricId: "feature-usage",
    type: "Pattern",
    nextStep: "Compare with the onboarding feedback collected in Feedback Hub.",
    sample: true,
  },
  {
    id: "obs-seed-3",
    productId: "atlas-scout",
    title: "Sessions per user drifts down while reach grows",
    description:
      "Sample note: the demo data shows a larger weekly audience completing fewer sessions each. Two opposite explanations fit and the sample cannot separate them.",
    metricId: "sessions-per-user",
    type: "Question",
    nextStep: "Look at feature usage by segment before treating this as a problem.",
    sample: true,
  },
];

export default function FounderAnalyticsPage() {
  const reduce = useReducedMotion();
  const nextId = useRef(1);

  const [productId, setProductId] = useState<string>(ANALYTICS_PRODUCTS[0].id);
  const [range, setRange] = useState<RangeKey>(ANALYTICS_RANGES[1]);
  const [section, setSection] = useState<AnalyticsSection>("Overview");
  const [metricId, setMetricId] = useState("active-users");
  const [segmentId, setSegmentId] = useState("all");
  const [areaId, setAreaId] = useState<string | null>(null);
  const [engagementKey, setEngagementKey] = useState<SeriesKey>("perUser");
  const [reportId, setReportId] = useState<string | null>(null);
  const [observations, setObservations] = useState<Observation[]>(SEED_OBSERVATIONS);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState<{ key: number; message: string } | null>(null);

  const product = getAnalyticsProduct(productId);
  const dataset = getAnalyticsDataset(productId);
  const productObservations = observations.filter((entry) => entry.productId === productId);
  const windowLabel = dataset ? formatWindow(dataset, range) : "no sample weeks";

  const notify = useCallback((message: string) => {
    setToast({ key: Date.now(), message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function changeProduct(id: string) {
    setProductId(id);
    setSegmentId("all");
    setAreaId(null);
    setReportId(null);
    setMetricId("active-users");
    notify(`Analytics view switched to ${getAnalyticsProduct(id).name} · demo data only`);
  }

  const view: HeaderView = section === "Overview" ? "overview" : "analysis";
  function changeView(next: HeaderView) {
    setSection(next === "overview" ? "Overview" : "Product Metrics");
  }

  function createObservation(draft: ObservationDraft) {
    const id = `obs-${nextId.current++}`;
    setObservations((current) => [
      ...current,
      { id, productId, ...draft },
    ]);
    notify("Observation added to this session · not saved anywhere");
  }

  function updateObservation(id: string, draft: ObservationDraft) {
    setObservations((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, ...draft } : entry)),
    );
    notify("Observation updated in this session");
  }

  function deleteObservation(id: string) {
    setObservations((current) => current.filter((entry) => entry.id !== id));
    notify("Observation removed from this session");
  }

  let body: React.ReactNode;
  if (section === "Overview") {
    body = <OverviewSection dataset={dataset} product={product} range={range} />;
  } else if (section === "Product Metrics") {
    body = (
      <ProductMetricsSection
        dataset={dataset}
        product={product}
        range={range}
        metricId={metricId}
        onMetricChange={setMetricId}
      />
    );
  } else if (section === "User Behavior") {
    body = (
      <UserBehaviorSection
        dataset={dataset}
        product={product}
        range={range}
        segmentId={segmentId}
        onSegmentChange={(id) => {
          setSegmentId(id);
          setAreaId(null);
        }}
        areaId={areaId}
        onAreaChange={setAreaId}
      />
    );
  } else if (section === "Retention & Engagement") {
    body = (
      <RetentionSection
        dataset={dataset}
        product={product}
        range={range}
        engagementKey={engagementKey}
        onEngagementChange={setEngagementKey}
      />
    );
  } else {
    body = (
      <ReportsSection
        dataset={dataset}
        product={product}
        range={range}
        observations={productObservations}
        reportId={reportId}
        onReportChange={setReportId}
        onCreate={createObservation}
        onUpdate={updateObservation}
        onDelete={deleteObservation}
        onExport={() => setExportOpen(true)}
      />
    );
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
      className="flex flex-col gap-4"
    >
      <FounderAnalyticsHeader
        product={product}
        onChangeProduct={changeProduct}
        range={range}
        onChangeRange={setRange}
        view={view}
        onChangeView={changeView}
        windowLabel={windowLabel}
        onExport={() => setExportOpen(true)}
      />

      <AnalyticsWorkspaceNavigation section={section} onChange={setSection} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${section}-${productId}`}
          role="tabpanel"
          id={`analytics-panel-${section}`}
          aria-labelledby={`analytics-tab-${section}`}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
        >
          {body}
        </motion.div>
      </AnimatePresence>

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
        <span aria-hidden className="size-1.5 bg-accent" />
        Frontend UI only · Static demo data · No tracking, no ingestion, no metric computation
      </p>

      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        context={`${product.name} · ${section} · ${windowLabel}`}
      />

      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.key}
            role="status"
            aria-live="polite"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
            className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2 border border-accent/60 bg-bg px-4 py-3 text-center shadow-[0_18px_44px_-24px_rgb(14_27_29/0.5)] sm:left-auto sm:right-6 sm:w-auto sm:max-w-[26rem] sm:translate-x-0 sm:text-left"
          >
            <p className="text-[12px] leading-snug text-fg">{toast.message}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
