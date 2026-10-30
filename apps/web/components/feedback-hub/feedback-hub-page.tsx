"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  DEMO_FEEDBACK,
  DEMO_FEEDBACK_PRODUCTS,
  DEMO_FEEDBACK_THEMES,
  DEMO_FEATURE_REQUESTS,
  feedbackStats,
  getFeedbackForProduct,
  getFeedbackProduct,
  getProductAreasForProduct,
  getThemesForProduct,
  getFeatureRequestsForProduct,
} from "@/lib/feedback-hub/demo";
import type {
  FeedbackDraft,
  FeedbackItem,
  FeedbackPriority,
  FeedbackSection,
  FeedbackStatus,
  FeatureRequest,
  FeatureRequestStatus,
  Theme,
  ThemeImportance,
  FeedbackProductId,
} from "@/lib/feedback-hub/types";

import { FeedbackHubHeader } from "./feedback-hub-header";
import { FeedbackOverview } from "./feedback-overview";
import { FeedbackWorkspaceNavigation } from "./feedback-workspace-navigation";
import { FeedbackInbox } from "./sections/feedback-inbox";
import { FeedbackBoard } from "./sections/feedback-board";
import { FeedbackThemesWorkspace } from "./sections/feedback-themes-workspace";
import { FeatureRequestsWorkspace } from "./sections/feature-requests-workspace";
import { ProductAreasWorkspace } from "./sections/product-areas-workspace";
import {
  FeedbackHubErrorState,
  FeedbackHubSkeleton,
} from "./badges";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const TODAY = "2026-10-29";

type Selection = {
  inbox: string | null;
  board: string | null;
  theme: string | null;
  request: string | null;
  area: string | null;
};

const EMPTY_SELECTION: Selection = {
  inbox: null,
  board: null,
  theme: null,
  request: null,
  area: null,
};

type View = "populated" | "loading" | "error";

export default function FeedbackHubPage() {
  const reduce = useReducedMotion();
  const nextId = useRef(1);

  const [productId, setProductId] = useState<FeedbackProductId>(DEMO_FEEDBACK_PRODUCTS[0].id);
  const [section, setSection] = useState<FeedbackSection>("Inbox");
  const [view, setView] = useState<View>("populated");
  const [selection, setSelection] = useState<Selection>(EMPTY_SELECTION);
  const [toast, setToast] = useState<{ key: number; message: string } | null>(null);

  const [items, setItems] = useState<FeedbackItem[]>(DEMO_FEEDBACK);
  const [themes, setThemes] = useState<Theme[]>(DEMO_FEEDBACK_THEMES);
  const [requests, setRequests] = useState<FeatureRequest[]>(DEMO_FEATURE_REQUESTS);

  const product = getFeedbackProduct(productId);
  const feedback = useMemo(() => getFeedbackForProduct(items, productId), [items, productId]);
  const productThemes = useMemo(() => getThemesForProduct(themes, productId), [themes, productId]);
  const productRequests = useMemo(
    () => getFeatureRequestsForProduct(requests, productId),
    [requests, productId],
  );
  const areas = useMemo(
    () => getProductAreasForProduct(productId, items, requests),
    [productId, items, requests],
  );

  const stats = feedbackStats(feedback);

  const notify = useCallback((message: string) => {
    setToast({ key: Date.now(), message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function select(part: keyof Selection, id: string | null) {
    setSelection((current) => ({ ...current, [part]: id }));
  }

  function changeProduct(id: string) {
    setProductId(id as FeedbackProductId);
    setSelection(EMPTY_SELECTION);
    notify(`Switched feedback workspace · ${getFeedbackProduct(id).name} (local view)`);
  }

  /* ---------------------------------------------------- record mutations --- */

  function patchItem(id: string, patch: Partial<FeedbackItem>) {
    setItems((current) => current.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  function handleStatusChange(id: string, status: FeedbackStatus) {
    patchItem(id, { status });
    notify(`Status changed to ${status} · local state only`);
  }

  function handlePriorityChange(id: string, priority: FeedbackPriority) {
    patchItem(id, { priority });
    notify(`Priority changed to ${priority} · local state only`);
  }

  function handleNotesChange(id: string, notes: string) {
    patchItem(id, { internalNotes: notes });
    notify("Internal note saved to this preview");
  }

  function handleFollowUpChange(id: string, action: string) {
    patchItem(id, { followUpAction: action });
    notify(`Next action set · ${action}`);
  }

  function handleAdd(draft: FeedbackDraft) {
    const id = `fb-local-${nextId.current++}`;
    const record: FeedbackItem = {
      id,
      productId,
      title: draft.title,
      excerpt:
        draft.description.length > 140
          ? `${draft.description.slice(0, 140).trimEnd()}…`
          : draft.description,
      description: draft.description,
      category: draft.category,
      source: draft.source,
      date: TODAY,
      priority: draft.priority,
      status: "New",
      productArea: draft.productArea || undefined,
      internalNotes: "",
      followUpAction: "No action yet",
    };
    setItems((current) => [record, ...current]);
    setView("populated");
    setSection("Inbox");
    select("inbox", id);
    notify("Feedback added to this preview · nothing was submitted anywhere");
  }

  /* --------------------------------------------------- theme / request --- */

  function patchTheme(id: string, patch: Partial<Theme>) {
    setThemes((current) => current.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function patchRequest(id: string, patch: Partial<FeatureRequest>) {
    setRequests((current) => current.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  /* -------------------------------------------------------- cross-links --- */

  function openAreaByName(name: string) {
    const area = areas.find((a) => a.name === name);
    setSection("Product Areas");
    select("area", area?.id ?? null);
  }

  function openFeedback(id: string) {
    setSection("Inbox");
    select("inbox", id);
  }

  function openRequest(id: string) {
    setSection("Feature Requests");
    select("request", id);
  }

  const counts: Record<FeedbackSection, number> = {
    Inbox: feedback.length,
    "Feedback Board": feedback.length,
    "Themes & Insights": productThemes.length,
    "Feature Requests": productRequests.length,
    "Product Areas": areas.length,
  };

  const header = (
    <FeedbackHubHeader
      product={product}
      onChangeProduct={changeProduct}
      areaNames={areas.map((a) => a.name)}
      total={stats.total}
      awaiting={stats.awaiting}
      lastActivity={stats.lastActivity}
      onAdd={handleAdd}
      onReviewInsights={() => {
        setSection("Themes & Insights");
        notify("Reviewing documented themes · sample insights");
      }}
    />
  );

  const statePreview = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-3">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
        <span aria-hidden className="size-1.5 bg-accent" />
        Frontend UI only · Static mock data · Local state for presentational interactions
      </p>
      <div className="ml-auto flex items-center gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          UI state preview
        </span>
        {(
          [
            ["Ready", "populated"],
            ["Loading", "loading"],
            ["Error", "error"],
          ] as const
        ).map(([label, value]) => (
          <button
            key={value}
            type="button"
            onClick={() => setView(value)}
            aria-pressed={view === value}
            className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
              view === value
                ? "border-accent/60 bg-mint-tint/50 text-accent"
                : "border-line text-faint hover:border-accent/60 hover:text-accent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  let body: React.ReactNode;

  if (view === "loading") {
    body = <FeedbackHubSkeleton />;
  } else if (view === "error") {
    body = <FeedbackHubErrorState onRetry={() => setView("populated")} />;
  } else {
    body = (
      <>
        <FeedbackOverview product={product} feedback={feedback} />
        <FeedbackWorkspaceNavigation
          section={section}
          onChange={setSection}
          counts={counts}
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={section}
            role="tabpanel"
            id={`feedback-panel-${section}`}
            aria-labelledby={`feedback-tab-${section}`}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
          >
            {section === "Inbox" ? (
              <FeedbackInbox
                feedback={feedback}
                requests={productRequests}
                areaNames={areas.map((a) => a.name)}
                productName={product.name}
                selectedId={selection.inbox}
                onSelect={(id) => select("inbox", id)}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
                onNotesChange={handleNotesChange}
                onFollowUpChange={handleFollowUpChange}
                onOpenArea={openAreaByName}
                onOpenRequest={openRequest}
                onAdd={handleAdd}
              />
            ) : section === "Feedback Board" ? (
              <FeedbackBoard
                feedback={feedback}
                selectedId={selection.board}
                onSelect={(id) => select("board", id)}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
              />
            ) : section === "Themes & Insights" ? (
              <FeedbackThemesWorkspace
                themes={productThemes}
                feedback={feedback}
                selectedId={selection.theme}
                onSelect={(id) => select("theme", id)}
                onImportanceChange={(id, importance: ThemeImportance) => {
                  patchTheme(id, { importance });
                  notify(`Importance set to ${importance} · local state only`);
                }}
                onReviewStatusChange={(id, status: FeedbackStatus) => {
                  patchTheme(id, { reviewStatus: status });
                  notify(`Theme research status · ${status}`);
                }}
                onNotesChange={(id, notes) => {
                  patchTheme(id, { internalNotes: notes });
                  notify("Theme notes saved to this preview");
                }}
                onOpenFeedback={openFeedback}
              />
            ) : section === "Feature Requests" ? (
              <FeatureRequestsWorkspace
                requests={productRequests}
                feedback={feedback}
                selectedId={selection.request}
                onSelect={(id) => select("request", id)}
                onStatusChange={(id, status: FeatureRequestStatus) => {
                  patchRequest(id, { status });
                  notify(`Request status changed to ${status} · local state only`);
                }}
                onPriorityChange={(id, priority: FeedbackPriority) => {
                  patchRequest(id, { priority });
                  notify(`Request priority changed to ${priority} · local state only`);
                }}
                onOpenFeedback={openFeedback}
              />
            ) : (
              <ProductAreasWorkspace
                areas={areas}
                feedback={feedback}
                requests={productRequests}
                selectedId={selection.area}
                onSelect={(id) => select("area", id)}
                onOpenFeedback={openFeedback}
                onOpenRequest={openRequest}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </>
    );
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
      className="flex flex-col gap-4"
    >
      {header}
      {body}
      {statePreview}

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
