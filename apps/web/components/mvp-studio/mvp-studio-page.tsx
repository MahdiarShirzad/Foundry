"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { DevToolsPopover, StatePreview } from "@/components/ui/primitives";
import { useProducts } from "@/lib/product/use-products";
import { useHydrated } from "@/lib/use-hydrated";
import {
  useCreateFeature,
  useFeatures,
  useProjects,
  useScopeItems,
  useUpdateFeature,
  useUpdateProject,
  useUpdateScopeItem,
} from "@/lib/mvp/hooks";
import {
  MVP_VIEWS,
  SCOPE_CATEGORIES,
  scopeCategoryOf,
  SCOPE_TO_FEATURE_SCOPE,
  type Feature,
  type FeatureDraft,
  type FeatureStatus,
  type MVPProjectPatch,
  type MVPSection,
  type MVPView,
  type ScopeCategory,
  type ScopeItem,
} from "@/lib/mvp-studio/types";

import { MVPStudioHeader } from "./mvp-studio-header";
import { MVPProjectOverview } from "./mvp-project-overview";
import { MVPWorkspaceNavigation } from "./mvp-workspace-navigation";
import { MVPStudioErrorState, MVPStudioSkeleton } from "./badges";
import { AddFeatureDialog } from "./dialogs/add-feature-dialog";
import { DefineMVPScopeDialog } from "./dialogs/define-mvp-scope-dialog";
import { MVPOverview } from "./sections/mvp-overview";
import { FeatureBacklog } from "./sections/feature-backlog";
import { MVPScopeWorkspace } from "./sections/mvp-scope-workspace";
import { FeatureSpecification } from "./sections/feature-specification";
import { BuildProgressBoard } from "./sections/build-progress-board";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Shape returned by `GET /products`. */
type Product = {
  id: string;
  name: string;
  slug?: string;
};

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function NoProjects() {
  return (
    <div className="border border-dashed border-line bg-panel px-5 py-10 text-center">
      <p className="text-[13px] leading-relaxed text-muted">
        No MVP projects yet — create one to start scoping your first version.
      </p>
    </div>
  );
}

export default function MVPStudioPage({ productId }: { productId?: string }) {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();

  const { data: productsData, isPending: productsPending } = useProducts();
  const products = (productsData as Product[] | undefined) ?? [];

  // The dashboard stores the active product in `?product=`; fall back to the
  // first product the same way the other module workspaces do.
  const activeProductId =
    productId ?? (hydrated ? products[0]?.id : undefined);

  const [projectId, setProjectId] = useState<string | null>(null);
  const [section, setSection] = useState<MVPSection>("Overview");
  const [view, setView] = useState<MVPView>("ready");
  const [addOpen, setAddOpen] = useState(false);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [toast, setToast] = useState<{ key: number; message: string } | null>(null);

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useProjects(activeProductId);

  const project =
    projects.find((item) => item.id === projectId) ?? projects[0] ?? null;
  const activeProjectId = project?.id;

  const {
    features,
    loading: featuresLoading,
    error: featuresError,
    refetch: refetchFeatures,
  } = useFeatures(activeProductId, activeProjectId);

  const {
    scopeItems: storedScope,
    loading: scopeLoading,
    error: scopeError,
    refetch: refetchScope,
  } = useScopeItems(activeProductId, activeProjectId);

  const createFeature = useCreateFeature(activeProductId, activeProjectId);
  const updateFeature = useUpdateFeature(activeProductId, activeProjectId);
  const updateScopeItem = useUpdateScopeItem(activeProductId, activeProjectId);
  const updateProject = useUpdateProject(activeProductId);

  const isEmptyPreview = view === "empty";

  const projectFeatures = useMemo(
    () => (isEmptyPreview ? [] : features),
    [features, isEmptyPreview],
  );

  const scopeItems = useMemo<ScopeItem[]>(() => {
    if (isEmptyPreview) return [];

    // Persisted scope rows win over the feature-derived rows they mirror.
    const persistedByFeature = new Map(
      storedScope
        .filter((item) => item.featureId)
        .map((item) => [item.featureId as string, item]),
    );

    const fromFeatures: ScopeItem[] = projectFeatures
      .filter((feature) => !persistedByFeature.has(feature.id))
      .map((feature) => ({
        id: `scope-${feature.id}`,
        projectId: feature.projectId,
        name: feature.name,
        explanation: feature.description,
        category: scopeCategoryOf(feature.scope),
        status: feature.status,
        featureId: feature.id,
      }));

    const extras = storedScope.filter((item) => !item.featureId);
    return [...fromFeatures, ...extras];
  }, [projectFeatures, storedScope, isEmptyPreview]);

  const counts = useMemo(
    () => ({
      total: projectFeatures.length,
      inMvp: projectFeatures.filter((f) => f.scope === "Must Have").length,
      inProgress: projectFeatures.filter((f) => f.status === "In Progress").length,
      completed: projectFeatures.filter((f) => f.status === "Completed").length,
    }),
    [projectFeatures],
  );

  const tabCounts: Record<MVPSection, number> = {
    Overview: project?.openDecisions.length ?? 0,
    "Feature Backlog": projectFeatures.length,
    "MVP Scope": scopeItems.length,
    Specifications: projectFeatures.length,
    "Build Progress": projectFeatures.filter((f) => f.status !== "Completed").length,
  };

  /* ------------------------------------------------------------- feedback --- */

  const notify = useCallback((message: string) => {
    setToast({ key: Date.now(), message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  /* ----------------------------------------------------------- mutations --- */

  async function patchFeature(
    id: string,
    patch: Partial<Feature>,
    message?: string,
  ) {
    try {
      await updateFeature.update(id, patch);
      if (message) notify(message);
    } catch (error) {
      console.error("Failed to update feature", error);
      notify(errorMessage(error, "Could not update the feature"));
    }
  }

  function changeStatus(id: string, status: FeatureStatus) {
    void patchFeature(id, { status }, describePatch(id, { status }));
  }

  async function addFeature(draft: FeatureDraft) {
    if (!project) return;
    try {
      await createFeature.create({
        ...draft,
        area: project.structure.areas[0]?.name || "Core",
        status: "Proposed",
      });
      setAddOpen(false);
      setView("ready");
      setSection("Feature Backlog");
      notify(`“${draft.name}” added to the backlog`);
    } catch (error) {
      console.error("Failed to create feature", error);
      notify(errorMessage(error, "Could not add the feature"));
    }
  }

  async function moveScopeItem(item: ScopeItem, category: ScopeCategory) {
    try {
      if (item.featureId) {
        await updateFeature.update(item.featureId, {
          scope: SCOPE_TO_FEATURE_SCOPE[category],
        });
      } else {
        await updateScopeItem.update(item.id, { category });
      }
      notify(`“${item.name}” → ${labelFor(category)}`);
    } catch (error) {
      console.error("Failed to move scope item", error);
      notify(errorMessage(error, "Could not move the scope item"));
    }
  }

  async function saveScopeDefinition(patch: MVPProjectPatch) {
    if (!project) return;
    try {
      await updateProject.update(project.id, patch);
      setScopeOpen(false);
      notify("MVP scope definition updated");
    } catch (error) {
      console.error("Failed to update MVP scope", error);
      notify(errorMessage(error, "Could not update the MVP scope"));
    }
  }

  function changeProject(id: string) {
    setProjectId(id);
    setSection("Overview");
    const next = projects.find((item) => item.id === id);
    notify(`Switched to ${next?.name ?? "project"}`);
  }

  function jump(next: MVPSection) {
    setSection(next);
  }

  function retry() {
    if (projectsError) void refetchProjects();
    if (featuresError) void refetchFeatures();
    if (scopeError) void refetchScope();
  }

  /* -------------------------------------------------------------- render --- */

  if (!hydrated || productsPending || projectsLoading || featuresLoading || scopeLoading) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <MVPStudioSkeleton />
      </motion.div>
    );
  }

  const error = projectsError || featuresError || scopeError;

  if (error) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <MVPStudioErrorState onRetry={retry} />
      </motion.div>
    );
  }

  if (!project) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <NoProjects />
      </motion.div>
    );
  }

  const header = (
    <MVPStudioHeader
      project={project}
      projects={projects}
      onChangeProject={changeProject}
      counts={counts}
      onAddFeature={() => setAddOpen(true)}
      onDefineScope={() => setScopeOpen(true)}
    />
  );

  const statePreview = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-[12px] text-faint">Changes are saved to your product workspace</p>
      <DevToolsPopover>
        <StatePreview value={view} options={MVP_VIEWS} onChange={setView} label="State" />
      </DevToolsPopover>
    </div>
  );

  function renderWorkspace(): ReactNode {
    if (view === "loading") return <MVPStudioSkeleton />;
    if (view === "error") return <MVPStudioErrorState onRetry={() => setView("ready")} />;

    return (
      <>
        <MVPProjectOverview project={project} features={projectFeatures} />
        <MVPWorkspaceNavigation section={section} onChange={setSection} counts={tabCounts} />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${project?.id}-${view}-${section}`}
            role="tabpanel"
            id={`mvp-panel-${section}`}
            aria-labelledby={`mvp-tab-${section}`}
            tabIndex={0}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
            className="scroll-mt-14 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
          >
            {section === "Overview" ? (
              <MVPOverview
                project={project}
                features={projectFeatures}
                onJump={jump}
              />
            ) : section === "Feature Backlog" ? (
              <FeatureBacklog
                features={projectFeatures}
                onPatch={(id, patch) => patchFeature(id, patch, describePatch(id, patch))}
                onAddFeature={() => setAddOpen(true)}
              />
            ) : section === "MVP Scope" ? (
              <MVPScopeWorkspace
                project={project}
                items={scopeItems}
                onMove={moveScopeItem}
                onOpenDefinition={() => setScopeOpen(true)}
              />
            ) : section === "Specifications" ? (
              <FeatureSpecification
                features={projectFeatures}
                onPatch={(id, patch) => patchFeature(id, patch)}
                onAddFeature={() => setAddOpen(true)}
              />
            ) : (
              <BuildProgressBoard
                features={projectFeatures}
                onMoveStatus={changeStatus}
                onAddFeature={() => setAddOpen(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </>
    );
  }

  function describePatch(id: string, patch: Partial<Feature>): string | undefined {
    if (patch.status) {
      const feature = features.find((item) => item.id === id);
      return `“${feature?.name ?? "Feature"}” → ${patch.status}`;
    }
    if (patch.scope) {
      const feature = features.find((item) => item.id === id);
      return `“${feature?.name ?? "Feature"}” → ${patch.scope}`;
    }
    return undefined;
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: EASE }}
      className="flex flex-col gap-4"
    >
      {header}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view === "ready" || view === "empty" ? "workspace" : view}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.16 }}
          className="flex flex-col gap-4"
        >
          {renderWorkspace()}
        </motion.div>
      </AnimatePresence>

      {statePreview}

      <AnimatePresence>
        {addOpen ? (
          <AddFeatureDialog
            key="add-feature"
            open
            onClose={() => setAddOpen(false)}
            onAdd={addFeature}
            targetUserPlaceholder={project.targetAudience}
          />
        ) : null}
        {scopeOpen ? (
          <DefineMVPScopeDialog
            key="define-scope"
            open
            onClose={() => setScopeOpen(false)}
            project={project}
            onSave={saveScopeDefinition}
          />
        ) : null}
      </AnimatePresence>

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
 * Route entry for the MVP Studio workspace. Reads the active product from the
 * URL (`?product=<id>`) and threads it into the page. `useSearchParams`
 * suspends during prerendering, so the route renders this behind Suspense.
 */
export function MVPStudioRoute() {
  const params = useSearchParams();
  const productId = params.get("product") ?? undefined;
  return <MVPStudioPage productId={productId} />;
}

function labelFor(category: ScopeCategory) {
  return SCOPE_CATEGORIES.find((item) => item.value === category)?.label ?? "Moved";
}
