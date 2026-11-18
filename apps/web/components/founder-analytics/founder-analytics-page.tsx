"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { buildAnalyticsDataset } from "@/lib/analytics/api";
import {
  useCreateObservation,
  useDeleteObservation,
  useMetrics,
  useObservations,
  useReports,
  useUpdateObservation,
  useWeekSamples,
} from "@/lib/analytics/hooks";
import {
  ANALYTICS_RANGES,
  type AnalyticsProduct,
  type AnalyticsSection,
  type ObservationDraft,
  type RangeKey,
  type SeriesKey,
} from "@/lib/founder-analytics/types";
import { useProducts } from "@/lib/product/use-products";
import { useHydrated } from "@/lib/use-hydrated";

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

/** Shape returned by `GET /products`. */
type Product = {
  id: string;
  name: string;
  slug?: string;
};

/** The products API stores a name only; the rest of the profile is unset. */
function toAnalyticsProduct(product: Product): AnalyticsProduct {
  return {
    id: product.id,
    name: product.name,
    ref: product.slug ?? product.id.slice(0, 8),
    summary: "No product summary yet.",
  };
}

function NoProducts() {
  return (
    <div className="border border-dashed border-line bg-panel px-5 py-10 text-center">
      <p className="text-[13px] leading-relaxed text-muted">
        No products yet — create one to get started
      </p>
    </div>
  );
}

export default function FounderAnalyticsPage({ productId }: { productId?: string }) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const { data, isPending } = useProducts();

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [range, setRange] = useState<RangeKey>(ANALYTICS_RANGES[1]);
  const [section, setSection] = useState<AnalyticsSection>("Overview");
  const [metricId, setMetricId] = useState("active-users");
  const [segmentId, setSegmentId] = useState("all");
  const [areaId, setAreaId] = useState<string | null>(null);
  const [engagementKey, setEngagementKey] = useState<SeriesKey>("perUser");
  const [reportId, setReportId] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState<{ key: number; message: string } | null>(null);

  // `getAllProducts` is untyped at the client wrapper, so narrow here.
  const products = useMemo(() => (data as Product[] | undefined) ?? [], [data]);
  const productOptions = useMemo(() => products.map(toAnalyticsProduct), [products]);
  // The dashboard stores the active product in `?product=`; fall back to the
  // first product the same way the other module workspaces do.
  const activeId =
    selectedProductId ??
    productId ??
    (hydrated ? products[0]?.id : undefined) ??
    "";
  const selected = products.find((entry) => entry.id === activeId) ?? null;
  const product = selected ? toAnalyticsProduct(selected) : null;

  const {
    weeks,
    loading: weeksLoading,
    error: weeksError,
    refetch: refetchWeeks,
  } = useWeekSamples(activeId || undefined);
  const {
    metrics,
    loading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = useMetrics(activeId || undefined);
  const {
    observations,
    loading: observationsLoading,
    error: observationsError,
    refetch: refetchObservations,
  } = useObservations(activeId || undefined);
  const {
    reports,
    loading: reportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useReports(activeId || undefined);

  const createObservation = useCreateObservation(activeId || undefined);
  const updateObservation = useUpdateObservation(activeId || undefined);
  const deleteObservation = useDeleteObservation(activeId || undefined);

  const dataLoading =
    weeksLoading || metricsLoading || observationsLoading || reportsLoading;
  const dataError = weeksError || metricsError || observationsError || reportsError;

  const dataset = useMemo(
    () =>
      buildAnalyticsDataset({
        weeks,
        metrics,
        observations,
        reports,
      }),
    [weeks, metrics, observations, reports],
  );

  const windowLabel = dataset ? formatWindow(dataset, range) : "no data";

  const notify = useCallback((message: string) => {
    setToast({ key: Date.now(), message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!dataError) return;
    console.error("Failed to load analytics data", dataError);
  }, [dataError]);

  function changeProduct(id: string) {
    setSelectedProductId(id);
    setSegmentId("all");
    setAreaId(null);
    setReportId(null);
    setMetricId("active-users");
    const next = products.find((entry) => entry.id === id);
    notify(`Analytics view switched to ${next?.name ?? "product"}`);
  }

  function retry() {
    if (weeksError) void refetchWeeks();
    if (metricsError) void refetchMetrics();
    if (observationsError) void refetchObservations();
    if (reportsError) void refetchReports();
  }

  if (!hydrated || isPending || (product && dataLoading)) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        aria-busy="true"
        className="flex flex-col gap-4"
      >
        <div className="h-[7rem] animate-pulse border border-line bg-panel" />
        <div className="h-12 animate-pulse border border-line bg-panel" />
        <div className="h-72 animate-pulse border border-line bg-panel" />
      </motion.div>
    );
  }

  if (!product) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <NoProducts />
      </motion.div>
    );
  }

  const view: HeaderView = section === "Overview" ? "overview" : "analysis";
  function changeView(next: HeaderView) {
    setSection(next === "overview" ? "Overview" : "Product Metrics");
  }

  async function handleCreateObservation(draft: ObservationDraft) {
    try {
      await createObservation.create({
        ...draft,
        metricId: draft.metricId || undefined,
      });
      notify("Observation added");
    } catch (error) {
      console.error("Failed to create observation", error);
    }
  }

  async function handleUpdateObservation(id: string, draft: ObservationDraft) {
    try {
      await updateObservation.update(id, {
        ...draft,
        metricId: draft.metricId || undefined,
      });
      notify("Observation updated");
    } catch (error) {
      console.error("Failed to update observation", error);
    }
  }

  async function handleDeleteObservation(id: string) {
    try {
      await deleteObservation.remove(id);
      notify("Observation removed");
    } catch (error) {
      console.error("Failed to delete observation", error);
    }
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
        observations={observations}
        reportId={reportId}
        onReportChange={setReportId}
        onCreate={handleCreateObservation}
        onUpdate={handleUpdateObservation}
        onDelete={handleDeleteObservation}
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
        products={productOptions}
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
          key={`${section}-${activeId}`}
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

      {dataError ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={retry}
            className="border border-line px-3 py-1.5 text-[12px] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Retry
          </button>
        </div>
      ) : null}

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

/**
 * Route entry for the Founder Analytics workspace. Reads the active product
 * from the URL (`?product=<id>`) and threads it into the page.
 */
export function FounderAnalyticsRoute() {
  const params = useSearchParams();
  const productId = params.get("product") ?? undefined;
  return <FounderAnalyticsPage productId={productId} />;
}
