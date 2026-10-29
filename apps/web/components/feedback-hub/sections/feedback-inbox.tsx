"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import type {
  FeedbackDraft,
  FeedbackItem,
  FeedbackPriority,
  FeedbackStatus,
  FeatureRequest,
} from "@/lib/feedback-hub/types";
import { FEEDBACK_CATEGORIES, FEEDBACK_PRIORITIES, FEEDBACK_STATUSES } from "@/lib/feedback-hub/types";

import {
  FeedbackCategoryBadge,
  FeedbackHubEmptyState,
  FeedbackPriorityBadge,
  FeedbackStatusBadge,
} from "../badges";
import { FeedbackDetailPanel } from "../feedback-detail-panel";
import { AddFeedbackDialog } from "../dialogs/add-feedback-dialog";
import { Select, TextInput } from "../primitives";

type Filters = { query: string; category: string; status: string; priority: string };

const EMPTY_FILTERS: Filters = { query: "", category: "all", status: "all", priority: "all" };
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function FeedbackInbox({
  feedback,
  requests,
  areaNames,
  productName,
  selectedId,
  onSelect,
  onStatusChange,
  onPriorityChange,
  onNotesChange,
  onFollowUpChange,
  onOpenArea,
  onOpenRequest,
  onAdd,
}: {
  feedback: FeedbackItem[];
  requests: FeatureRequest[];
  areaNames: string[];
  productName: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onStatusChange: (id: string, status: FeedbackStatus) => void;
  onPriorityChange: (id: string, priority: FeedbackPriority) => void;
  onNotesChange: (id: string, notes: string) => void;
  onFollowUpChange: (id: string, action: string) => void;
  onOpenArea: (name: string) => void;
  onOpenRequest: (id: string) => void;
  onAdd: (draft: FeedbackDraft) => void;
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const reduce = useReducedMotion();

  const filtersActive =
    filters.query !== "" ||
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.priority !== "all";

  const filtered = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return feedback.filter((f) => {
      const matchesQuery = query
        ? `${f.title} ${f.excerpt}`.toLowerCase().includes(query)
        : true;
      const matchesCategory = filters.category === "all" || f.category === filters.category;
      const matchesStatus = filters.status === "all" || f.status === filters.status;
      const matchesPriority = filters.priority === "all" || f.priority === filters.priority;
      return matchesQuery && matchesCategory && matchesStatus && matchesPriority;
    });
  }, [feedback, filters]);

  const selected =
    filtered.find((f) => f.id === selectedId) ?? filtered[0] ?? null;
  const linkedRequest = selected
    ? requests.find((r) => r.relatedFeedbackIds.includes(selected.id)) ?? null
    : null;
  const related = selected
    ? feedback.filter(
        (f) =>
          f.id !== selected.id &&
          (f.productArea === selected.productArea ||
            requests.some(
              (r) =>
                r.relatedFeedbackIds.includes(f.id) && r.relatedFeedbackIds.includes(selected.id),
            )),
      )
    : [];

  useEffect(() => {
    if (!sheetOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  function openRecord(id: string) {
    onSelect(id);
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      setSheetOpen(true);
    }
  }

  if (feedback.length === 0) {
    return (
      <>
        <section className="border border-line bg-panel">
          <FeedbackHubEmptyState
            title="Empty inbox"
            description="No feedback has been recorded for this product yet. Add the first record to start organizing user input — this preview keeps everything in local state."
            action={
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="border border-accent/70 bg-mint-tint/60 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-accent transition-colors hover:bg-mint-tint"
              >
                Add Feedback
              </button>
            }
          />
        </section>
        <AddFeedbackDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onAdd={onAdd}
          productAreas={areaNames}
          productName={productName}
        />
      </>
    );
  }

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      {/* ---------------------------------------------------------- list --- */}
      <section className="min-w-0 bg-panel" aria-label="Feedback inbox list">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">Inbox</p>
            <p className="mt-1 text-[11px] text-muted">
              {filtered.length === feedback.length
                ? `${feedback.length} records`
                : `${filtered.length} of ${feedback.length} records`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Add
          </button>
        </header>

        <div className="space-y-2 border-b border-line px-4 py-3">
          <div>
            <label htmlFor="inbox-search" className="sr-only">
              Search feedback by title or excerpt
            </label>
            <TextInput
              id="inbox-search"
              type="search"
              value={filters.query}
              onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
              placeholder="Search title or excerpt…"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="inbox-category" className="sr-only">
                Filter by category
              </label>
              <Select
                id="inbox-category"
                value={filters.category}
                onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
              >
                <option value="all">All categories</option>
                {FEEDBACK_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="inbox-status" className="sr-only">
                Filter by status
              </label>
              <Select
                id="inbox-status"
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="all">All statuses</option>
                {FEEDBACK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="inbox-priority" className="sr-only">
                Filter by priority
              </label>
              <Select
                id="inbox-priority"
                value={filters.priority}
                onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
              >
                <option value="all">All priorities</option>
                {FEEDBACK_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </div>
            <button
              type="button"
              onClick={() => setFilters(EMPTY_FILTERS)}
              disabled={!filtersActive}
              className="border border-line px-2 font-mono text-[9px] uppercase tracking-[0.14em] text-faint transition-colors hover:border-accent hover:text-accent disabled:opacity-50 disabled:hover:border-line disabled:hover:text-faint"
            >
              Clear filters
            </button>
          </div>
        </div>

        <div className="max-h-[30rem] overflow-y-auto lg:max-h-[38rem]">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
                No matching results
              </p>
              <p className="mx-auto mt-2 max-w-[32ch] text-[12px] leading-relaxed text-muted">
                Nothing in this inbox matches the active search and filters.
              </p>
              <button
                type="button"
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="mt-3 border border-line px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <ul>
              {filtered.map((f) => {
                const active = f.id === selected?.id;
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => openRecord(f.id)}
                      aria-current={active ? "true" : undefined}
                      className={`w-full border-b border-line px-4 py-3 text-left transition-colors ${
                        active ? "bg-mint-tint/30" : "hover:bg-mint-tint/15"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 text-[12.5px] font-medium leading-snug text-fg">
                          {f.title}
                        </p>
                        <FeedbackStatusBadge status={f.status} />
                      </div>
                      <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-muted">
                        {f.excerpt}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <FeedbackCategoryBadge category={f.category} />
                        <FeedbackPriorityBadge priority={f.priority} />
                      </div>
                      <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                        {f.date} · {f.source}
                        {f.productArea ? ` · ${f.productArea}` : ""}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------- detail --- */}
      <motion.section
        key={sheetOpen ? "sheet" : "panel"}
        aria-label="Selected feedback"
        initial={sheetOpen && !reduce ? { opacity: 0, x: "4%" } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: reduce ? 0 : 0.22, ease: EASE }}
        className={`min-w-0 bg-panel ${
          sheetOpen ? "fixed inset-0 z-40 overflow-y-auto" : "hidden lg:block"
        }`}
      >
        {selected ? (
          <FeedbackDetailPanel
            item={selected}
            related={related}
            linkedRequest={linkedRequest}
            areaNames={areaNames}
            onStatusChange={(status) => onStatusChange(selected.id, status)}
            onPriorityChange={(priority) => onPriorityChange(selected.id, priority)}
            onNotesChange={(notes) => onNotesChange(selected.id, notes)}
            onFollowUpChange={(action) => onFollowUpChange(selected.id, action)}
            onOpenArea={(name) => {
              setSheetOpen(false);
              onOpenArea(name);
            }}
            onOpenFeedback={openRecord}
            onOpenRequest={(id) => {
              setSheetOpen(false);
              onOpenRequest(id);
            }}
            onBack={() => setSheetOpen(false)}
          />
        ) : (
          <FeedbackHubEmptyState
            title="Select a feedback record"
            description="Choose an item from the inbox to inspect its full content, internal notes and follow-up actions."
          />
        )}
      </motion.section>

      <AddFeedbackDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={onAdd}
        productAreas={areaNames}
        productName={productName}
      />
    </div>
  );
}
