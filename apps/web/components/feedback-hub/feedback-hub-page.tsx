"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { DevToolsPopover, StatePreview } from "@/components/ui/primitives";

import { deriveProductAreas } from "@/lib/feedback/api";
import { feedbackStats } from "@/lib/feedback/derive";
import {
  useCreateFeedback,
  useFeatureRequests,
  useFeedback,
  useProductAreas,
  useThemes,
  useUpdateFeatureRequest,
  useUpdateFeedback,
  useUpdateTheme,
} from "@/lib/feedback/hooks";
import { useProducts } from "@/lib/product/use-products";
import { useHydrated } from "@/lib/use-hydrated";
import type {
  FeedbackDraft,
  FeedbackPriority,
  FeedbackProduct,
  FeedbackSection,
  FeedbackStatus,
  FeatureRequestStatus,
  ThemeImportance,
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

/** Shape returned by `GET /products`. */
type Product = {
  id: string;
  name: string;
  slug?: string;
};

/** The products API stores a name only; the rest of the hub profile is unset. */
function toFeedbackProduct(product: Product): FeedbackProduct {
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

export default function FeedbackHubPage({ productId }: { productId?: string }) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  const { data, isPending } = useProducts();

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [section, setSection] = useState<FeedbackSection>("Inbox");
  const [view, setView] = useState<View>("populated");
  const [selection, setSelection] = useState<Selection>(EMPTY_SELECTION);
  const [toast, setToast] = useState<{ key: number; message: string } | null>(null);

  // `getAllProducts` is untyped at the client wrapper, so narrow here.
  const products = useMemo(() => (data as Product[] | undefined) ?? [], [data]);
  const productOptions = useMemo(() => products.map(toFeedbackProduct), [products]);
  // The dashboard stores the active product in `?product=`; fall back to the
  // first product the same way the other module workspaces do.
  const activeId =
    selectedProductId ??
    productId ??
    (hydrated ? products[0]?.id : undefined) ??
    "";
  const selected = products.find((entry) => entry.id === activeId) ?? null;
  const product = selected ? toFeedbackProduct(selected) : null;

  const {
    feedback,
    loading: feedbackLoading,
    error: feedbackError,
    refetch: refetchFeedback,
  } = useFeedback(activeId || undefined);
  const {
    themes,
    loading: themesLoading,
    error: themesError,
    refetch: refetchThemes,
  } = useThemes(activeId || undefined);
  const {
    requests,
    loading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests,
  } = useFeatureRequests(activeId || undefined);
  const {
    areas: areaDefinitions,
    loading: areasLoading,
    error: areasError,
    refetch: refetchAreas,
  } = useProductAreas(activeId || undefined);

  const createFeedback = useCreateFeedback(activeId || undefined);
  const updateFeedback = useUpdateFeedback(activeId || undefined);
  const updateTheme = useUpdateTheme(activeId || undefined);
  const updateFeatureRequest = useUpdateFeatureRequest(activeId || undefined);

  const areas = useMemo(
    () => deriveProductAreas(areaDefinitions, feedback, requests),
    [areaDefinitions, feedback, requests],
  );

  const dataLoading =
    feedbackLoading || themesLoading || requestsLoading || areasLoading;
  const dataError = feedbackError || themesError || requestsError || areasError;

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
    setSelectedProductId(id);
    setSelection(EMPTY_SELECTION);
    const next = products.find((entry) => entry.id === id);
    notify(`Switched feedback workspace · ${next?.name ?? "product"}`);
  }

  function retry() {
    if (feedbackError) void refetchFeedback();
    if (themesError) void refetchThemes();
    if (requestsError) void refetchRequests();
    if (areasError) void refetchAreas();
  }

  /* ---------------------------------------------------- record mutations --- */

  async function handleStatusChange(id: string, status: FeedbackStatus) {
    try {
      await updateFeedback.update(id, { status });
      notify(`Status changed to ${status}`);
    } catch (error) {
      console.error("Failed to update feedback status", error);
    }
  }

  async function handlePriorityChange(id: string, priority: FeedbackPriority) {
    try {
      await updateFeedback.update(id, { priority });
      notify(`Priority changed to ${priority}`);
    } catch (error) {
      console.error("Failed to update feedback priority", error);
    }
  }

  async function handleNotesChange(id: string, notes: string) {
    try {
      await updateFeedback.update(id, { internalNotes: notes });
      notify("Internal note saved");
    } catch (error) {
      console.error("Failed to update feedback notes", error);
    }
  }

  async function handleFollowUpChange(id: string, action: string) {
    try {
      await updateFeedback.update(id, { followUpAction: action });
      notify(`Next action set · ${action}`);
    } catch (error) {
      console.error("Failed to update follow-up action", error);
    }
  }

  async function handleAdd(draft: FeedbackDraft) {
    try {
      const record = await createFeedback.create({
        title: draft.title,
        excerpt:
          draft.description.length > 140
            ? `${draft.description.slice(0, 140).trimEnd()}…`
            : draft.description,
        description: draft.description,
        category: draft.category,
        source: draft.source,
        date: new Date().toISOString().slice(0, 10),
        priority: draft.priority,
        status: "New",
        productArea: draft.productArea || undefined,
        internalNotes: "",
        followUpAction: "No action yet",
      });
      setView("populated");
      setSection("Inbox");
      select("inbox", record.id);
      notify("Feedback added");
    } catch (error) {
      console.error("Failed to create feedback", error);
    }
  }

  /* --------------------------------------------------- theme / request --- */

  async function handleThemeImportance(id: string, importance: ThemeImportance) {
    try {
      await updateTheme.update(id, { importance });
    } catch (error) {
      console.error("Failed to update theme importance", error);
    }
  }

  async function handleThemeReviewStatus(id: string, status: FeedbackStatus) {
    try {
      await updateTheme.update(id, { reviewStatus: status });
    } catch (error) {
      console.error("Failed to update theme review status", error);
    }
  }

  async function handleThemeNotes(id: string, notes: string) {
    try {
      await updateTheme.update(id, { internalNotes: notes });
    } catch (error) {
      console.error("Failed to update theme notes", error);
    }
  }

  async function handleRequestStatus(id: string, status: FeatureRequestStatus) {
    try {
      await updateFeatureRequest.update(id, { status });
    } catch (error) {
      console.error("Failed to update request status", error);
    }
  }

  async function handleRequestPriority(id: string, priority: FeedbackPriority) {
    try {
      await updateFeatureRequest.update(id, { priority });
    } catch (error) {
      console.error("Failed to update request priority", error);
    }
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

  if (!hydrated || isPending || (product && dataLoading)) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <FeedbackHubSkeleton />
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

  const counts: Record<FeedbackSection, number> = {
    Inbox: feedback.length,
    "Feedback Board": feedback.length,
    "Themes & Insights": themes.length,
    "Feature Requests": requests.length,
    "Product Areas": areas.length,
  };

  const header = (
    <FeedbackHubHeader
      product={product}
      products={productOptions}
      onChangeProduct={changeProduct}
      areaNames={areas.map((a) => a.name)}
      total={stats.total}
      awaiting={stats.awaiting}
      lastActivity={stats.lastActivity}
      onAdd={handleAdd}
      onReviewInsights={() => {
        setSection("Themes & Insights");
        notify("Reviewing documented themes");
      }}
    />
  );

  const statePreview = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-[12px] text-faint">Changes are saved to your product workspace</p>
      <DevToolsPopover>
        <p className="text-[12.5px] font-medium text-fg">Interface preview</p>
        <p className="mt-0.5 text-[12px] text-muted">
          Switch the workspace between its ready, loading and error views.
        </p>
        <div className="mt-3">
          <StatePreview
            value={view}
            label="State"
            onChange={setView}
            options={[
              { value: "populated", label: "Ready" },
              { value: "loading", label: "Loading" },
              { value: "error", label: "Error" },
            ]}
          />
        </div>
      </DevToolsPopover>
    </div>
  );

  let body: React.ReactNode;

  if (view === "loading") {
    body = <FeedbackHubSkeleton />;
  } else if (view === "error" || dataError) {
    body = (
      <FeedbackHubErrorState
        onRetry={() => {
          retry();
          setView("populated");
        }}
      />
    );
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
                requests={requests}
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
                themes={themes}
                feedback={feedback}
                selectedId={selection.theme}
                onSelect={(id) => select("theme", id)}
                onImportanceChange={(id, importance: ThemeImportance) => {
                  void handleThemeImportance(id, importance);
                }}
                onReviewStatusChange={(id, status: FeedbackStatus) => {
                  void handleThemeReviewStatus(id, status);
                }}
                onNotesChange={(id, notes) => {
                  void handleThemeNotes(id, notes);
                }}
                onOpenFeedback={openFeedback}
              />
            ) : section === "Feature Requests" ? (
              <FeatureRequestsWorkspace
                requests={requests}
                feedback={feedback}
                selectedId={selection.request}
                onSelect={(id) => select("request", id)}
                onStatusChange={(id, status: FeatureRequestStatus) => {
                  void handleRequestStatus(id, status);
                }}
                onPriorityChange={(id, priority: FeedbackPriority) => {
                  void handleRequestPriority(id, priority);
                }}
                onOpenFeedback={openFeedback}
              />
            ) : (
              <ProductAreasWorkspace
                areas={areas}
                feedback={feedback}
                requests={requests}
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
            className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2 rounded-card border border-accent/40 bg-panel px-4 py-3 text-center shadow-[var(--elevation-toast)] sm:left-auto sm:right-6 sm:w-auto sm:max-w-[26rem] sm:translate-x-0 sm:text-left"
          >
            <p className="text-[12px] leading-snug text-fg">{toast.message}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Route entry for the Feedback Hub workspace. Reads the active product from
 * the URL (`?product=<id>`) and threads it into the page.
 */
export function FeedbackHubRoute() {
  const params = useSearchParams();
  const productId = params.get("product") ?? undefined;
  return <FeedbackHubPage productId={productId} />;
}
