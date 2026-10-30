"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  DEMO_FEATURES,
  DEMO_MVP_PROJECTS,
  DEMO_SCOPE_EXTRAS,
} from "@/lib/mvp-studio/demo";
import {
  MVP_VIEWS,
  SCOPE_CATEGORIES,
  scopeCategoryOf,
  SCOPE_TO_FEATURE_SCOPE,
  type Feature,
  type FeatureDraft,
  type FeatureStatus,
  type MVPProject,
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

/**
 * MVP Studio — Stage 04. Frontend UI only: static mock data plus lightweight
 * React local state for presentational interactions. Nothing is persisted,
 * generated, or sent anywhere.
 */
export default function MVPStudioPage() {
  const reduce = useReducedMotion();

  const [projectId, setProjectId] = useState<string>(DEMO_MVP_PROJECTS[0].id);
  const [section, setSection] = useState<MVPSection>("Overview");
  const [view, setView] = useState<MVPView>("ready");
  const [addOpen, setAddOpen] = useState(false);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [toast, setToast] = useState<{ key: number; message: string } | null>(null);

  /* Local stores — the only place any of this data lives. */
  const [projects, setProjects] = useState<MVPProject[]>(DEMO_MVP_PROJECTS);
  const [features, setFeatures] = useState<Feature[]>(DEMO_FEATURES);
  const [scopeExtras, setScopeExtras] = useState<ScopeItem[]>(DEMO_SCOPE_EXTRAS);

  const project = projects.find((item) => item.id === projectId) ?? projects[0];
  const isEmptyPreview = view === "empty";

  const projectFeatures = useMemo(
    () => (isEmptyPreview ? [] : features.filter((f) => f.projectId === projectId)),
    [features, projectId, isEmptyPreview],
  );

  const scopeItems = useMemo<ScopeItem[]>(() => {
    if (isEmptyPreview) return [];
    const fromFeatures: ScopeItem[] = projectFeatures.map((f) => ({
      id: `scope-${f.id}`,
      projectId: f.projectId,
      name: f.name,
      explanation: f.description,
      category: scopeCategoryOf(f.scope),
      status: f.status,
      featureId: f.id,
    }));
    const extras = scopeExtras.filter((item) => item.projectId === projectId);
    return [...fromFeatures, ...extras];
  }, [projectFeatures, scopeExtras, projectId, isEmptyPreview]);

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
    Overview: project.openDecisions.length,
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

  function patchFeature(id: string, patch: Partial<Feature>, message?: string) {
    setFeatures((current) =>
      current.map((feature) => (feature.id === id ? { ...feature, ...patch } : feature)),
    );
    if (message) notify(message);
  }

  function changeStatus(id: string, status: FeatureStatus) {
    patchFeature(id, { status }, describePatch(id, { status }));
  }

  function addFeature(draft: FeatureDraft) {
    const id = `f-local-${Date.now()}`;
    const record: Feature = {
      id,
      projectId: project.id,
      area: project.structure.areas[0]?.name ?? "Core",
      status: "Proposed",
      behavior: "",
      edgeCases: [],
      dependencies: [],
      openQuestions: [],
      designNotes: "",
      ...draft,
    };
    setFeatures((current) => [record, ...current]);
    setAddOpen(false);
    setView("ready");
    setSection("Feature Backlog");
    notify(`“${record.name}” added to the backlog · preview only, nothing was saved`);
  }

  function moveScopeItem(item: ScopeItem, category: ScopeCategory) {
    if (item.featureId) {
      patchFeature(
        item.featureId,
        { scope: SCOPE_TO_FEATURE_SCOPE[category] },
        `“${item.name}” → ${labelFor(category)} · local state only`,
      );
      return;
    }
    setScopeExtras((current) =>
      current.map((extra) => (extra.id === item.id ? { ...extra, category } : extra)),
    );
    notify(`“${item.name}” → ${labelFor(category)} · local state only`);
  }

  function saveScopeDefinition(patch: MVPProjectPatch) {
    setProjects((current) =>
      current.map((item) => (item.id === project.id ? { ...item, ...patch } : item)),
    );
    setScopeOpen(false);
    notify("MVP scope definition updated in this preview · not persisted");
  }

  function changeProject(id: string) {
    setProjectId(id);
    const next = projects.find((item) => item.id === id);
    notify(`Switched to ${next?.name ?? "idea"} · local preview`);
  }

  function jump(next: MVPSection) {
    setSection(next);
  }

  /* -------------------------------------------------------------- render --- */

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
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-3">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
        <span aria-hidden className="size-1.5 bg-accent" />
        Frontend UI only · Static mock data · Local state for presentational interactions
      </p>
      <div className="ml-auto flex items-center gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          UI state preview
        </span>
        {MVP_VIEWS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setView(option.value)}
            aria-pressed={view === option.value}
            className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
              view === option.value
                ? "border-accent/60 bg-mint-tint/50 text-accent"
                : "border-line text-faint hover:border-accent/60 hover:text-accent"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
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
            key={`${projectId}-${view}-${section}`}
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
      return `“${feature?.name ?? "Feature"}” → ${patch.status} · local state only`;
    }
    if (patch.scope) {
      const feature = features.find((item) => item.id === id);
      return `“${feature?.name ?? "Feature"}” → ${patch.scope} · local state only`;
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

      <div className="flex flex-col gap-3">{statePreview}</div>

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

function labelFor(category: ScopeCategory) {
  return SCOPE_CATEGORIES.find((item) => item.value === category)?.label ?? "Moved";
}
