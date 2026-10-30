"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { IDEA_CATEGORIES } from "@/lib/idea-lab/demo";
import type { IdeaDraft } from "@/lib/idea-lab/types";

import { IdeaStatus } from "./idea-status";

const LABEL = "font-mono text-[10px] uppercase tracking-[0.2em] text-faint";
const INPUT =
  "mt-2 w-full border border-line bg-panel px-3 text-[16px] text-fg outline-none transition-colors placeholder:text-faint/65 hover:border-line-2 focus:border-accent sm:text-[13.5px]";
const TEXTAREA = `${INPUT} resize-none py-2.5 leading-relaxed`;

function CaptureField({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={LABEL}>
          {label}
        </label>
        {hint ? <span className="text-[10.5px] text-faint">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

export function IdeaCaptureModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit?: (draft: IdeaDraft) => void;
}) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [problem, setProblem] = useState("");
  const [audience, setAudience] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [context, setContext] = useState("");
  const [assumption, setAssumption] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() => titleRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes?.length) return;

      const focusable = Array.from(nodes).filter((node) => node.offsetParent !== null);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const draft: IdeaDraft = {
      title: title.trim(),
      summary: summary.trim(),
      problem: problem.trim(),
      audience: audience.trim(),
      category,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      context: context.trim(),
      assumption: assumption.trim(),
    };

    if (onSubmit) {
      onSubmit(draft);
      return;
    }

    setNotice("Preview only — nothing was saved. Connect a capture handler to keep this idea.");
  }

  const previewTags = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.18 }}
      className="fixed inset-0 z-50 flex items-stretch justify-center p-0 sm:items-center sm:p-4"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close new idea form"
        className="absolute inset-0 bg-ink/55"
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="capture-title"
        aria-describedby="capture-description"
        initial={reduce ? false : { opacity: 0, y: 14, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.995 }}
        transition={{ duration: reduce ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-full w-full flex-col border-line bg-bg shadow-[0_28px_80px_-32px_rgb(14_27_29/0.55)] sm:h-auto sm:max-h-[92dvh] sm:max-w-[56rem] sm:border"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              <span aria-hidden className="size-1.5 bg-mint" />
              New capture · Stage 01
            </p>
            <h2
              id="capture-title"
              className="mt-2 text-[clamp(1.45rem,2.4vw,1.9rem)] font-medium leading-[1.05] tracking-[-0.035em] text-fg"
            >
              What are you noticing?
            </h2>
            <p id="capture-description" className="mt-1.5 text-[11.5px] leading-relaxed text-muted">
              Capture the spark now. Detail can come later.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 shrink-0 items-center justify-center border border-line text-faint transition-colors hover:border-accent hover:text-accent"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              aria-hidden
              className="fill-none stroke-current stroke-[1.4]"
            >
              <path d="m2 2 8 8M10 2l-8 8" strokeLinecap="square" />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:var(--line-2)_transparent] [scrollbar-width:thin]">
            <div className="grid gap-6 px-5 py-5 sm:px-6 sm:py-6 lg:grid-cols-[minmax(0,1fr)_14.5rem] lg:gap-8">
              <div className="min-w-0 space-y-4">
                <CaptureField id="capture-name" label="Idea title" hint="Working names are fine">
                  <input
                    ref={titleRef}
                    id="capture-name"
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      setNotice(null);
                    }}
                    placeholder="e.g. A calmer way to ship release notes"
                    className={`${INPUT} h-12 text-[17px] font-medium sm:text-[15px]`}
                  />
                </CaptureField>

                <CaptureField id="capture-summary" label="Short description" hint="One line">
                  <textarea
                    id="capture-summary"
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                    rows={2}
                    placeholder="Say the idea out loud the way you would to a friend."
                    className={`${TEXTAREA} min-h-[5.25rem]`}
                  />
                </CaptureField>

                <div className="grid gap-4 sm:grid-cols-2">
                  <CaptureField id="capture-problem" label="Problem or opportunity">
                    <textarea
                      id="capture-problem"
                      value={problem}
                      onChange={(event) => setProblem(event.target.value)}
                      rows={4}
                      placeholder="What is broken, expensive, or unnecessarily hard today?"
                      className={`${TEXTAREA} min-h-[7rem]`}
                    />
                  </CaptureField>

                  <CaptureField id="capture-audience" label="Target audience">
                    <textarea
                      id="capture-audience"
                      value={audience}
                      onChange={(event) => setAudience(event.target.value)}
                      rows={4}
                      placeholder="Who feels the problem most often?"
                      className={`${TEXTAREA} min-h-[7rem]`}
                    />
                  </CaptureField>
                </div>

                <fieldset>
                  <legend className={LABEL}>Category</legend>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {IDEA_CATEGORIES.map((option) => {
                      const active = category === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setCategory(active ? "" : option)}
                          aria-pressed={active}
                          className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                            active
                              ? "border-accent/50 bg-mint-tint text-accent"
                              : "border-line text-faint hover:border-line-2 hover:text-fg"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <CaptureField id="capture-tags" label="Tags" hint="Comma separated · optional">
                  <input
                    id="capture-tags"
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    placeholder="research, workflow, founder tools"
                    className={`${INPUT} h-11`}
                  />
                </CaptureField>

                <div className="border-t border-line pt-3">
                  <button
                    type="button"
                    onClick={() => setExpanded((value) => !value)}
                    aria-expanded={expanded}
                    aria-controls="capture-more"
                    className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-accent"
                  >
                    <span
                      aria-hidden
                      className="flex size-4 items-center justify-center border border-line text-[11px] leading-none"
                    >
                      {expanded ? "−" : "+"}
                    </span>
                    More context
                    <span className="normal-case tracking-[0.04em] text-faint/80">
                      assumption, source, notes
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.div
                        id="capture-more"
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <CaptureField id="capture-context" label="Supporting context">
                            <textarea
                              id="capture-context"
                              value={context}
                              onChange={(event) => setContext(event.target.value)}
                              rows={3}
                              placeholder="Where did this come from? A conversation, a repeated frustration, a workaround?"
                              className={`${TEXTAREA} min-h-[5.5rem]`}
                            />
                          </CaptureField>
                          <CaptureField id="capture-assumption" label="Key assumption">
                            <textarea
                              id="capture-assumption"
                              value={assumption}
                              onChange={(event) => setAssumption(event.target.value)}
                              rows={3}
                              placeholder="What would have to be true for this to matter?"
                              className={`${TEXTAREA} min-h-[5.5rem]`}
                            />
                          </CaptureField>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>

              <aside className="hidden lg:block">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                  Inbox preview
                </p>
                <div className="mt-2 border border-line bg-panel p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                      New capture
                    </span>
                    <IdeaStatus status="inbox" />
                  </div>
                  <h3 className="mt-3 break-words text-[14.5px] font-medium leading-snug tracking-[-0.01em] text-fg">
                    {title.trim() || "Untitled idea"}
                  </h3>
                  <p className="mt-1 line-clamp-3 break-words text-[11px] leading-relaxed text-muted">
                    {summary.trim() || "A one-line description will land here."}
                  </p>
                  <div className="mt-3 border-t border-line pt-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-faint">
                      {category || "Uncategorised"}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-1">
                      {previewTags.length ? (
                        previewTags.map((tag) => (
                          <span
                            key={tag}
                            className="break-all font-mono text-[10px] uppercase tracking-[0.1em] text-accent"
                          >
                            #{tag.replace(/\s+/g, "-")}
                          </span>
                        ))
                      ) : (
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-faint/70">
                          no tags yet
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-faint">
                  New ideas enter the lab as Inbox. Nothing is filed until you decide it is worth
                  exploring.
                </p>
              </aside>
            </div>
          </div>

          <footer className="shrink-0 border-t border-line bg-bg px-5 py-3.5 sm:px-6">
            <AnimatePresence initial={false}>
              {notice ? (
                <motion.p
                  role="status"
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.18 }}
                  className="mb-3 border-l-2 border-accent bg-mint-tint px-3 py-2 text-[11.5px] leading-relaxed text-fg"
                >
                  {notice}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="order-2 font-mono text-[10px] uppercase tracking-[0.14em] text-faint sm:order-1">
                Preview form · nothing is stored
              </p>

              <div className="order-1 grid grid-cols-2 gap-2 sm:order-2 sm:flex sm:items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 border border-line px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:border-line-2 hover:text-fg sm:h-9"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="group inline-flex h-10 items-center justify-center gap-2 bg-mint px-4 text-[12.5px] font-medium text-ink transition duration-200 hover:brightness-95 active:translate-y-px sm:h-9"
                >
                  Capture idea
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </button>
              </div>
            </div>
          </footer>
        </form>
      </motion.div>
    </motion.div>
  );
}
