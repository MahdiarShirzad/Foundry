"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  EVIDENCE_META,
  EVIDENCE_TYPES,
  formatMarketDate,
  MARKET_TODAY,
  type EvidenceType,
  type MarketIdea,
} from "@/lib/market-intelligence/types";

const LABEL = "font-mono text-[10px] uppercase tracking-[0.18em] text-faint";
const INPUT =
  "mt-1.5 w-full border border-line bg-panel px-3 text-[16px] text-fg outline-none transition-colors placeholder:text-faint/60 hover:border-line-2 focus:border-accent sm:text-[13px]";
const TEXTAREA = `${INPUT} resize-none py-2.5 leading-relaxed`;

type Errors = Record<string, string>;

function DialogShell({
  eyebrow,
  title,
  description,
  onClose,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;

    const frame = requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(
        'input, textarea, select, button[data-autofocus]',
      );
      first?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.18 }}
      className="fixed inset-0 z-50 flex justify-end"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={`Close ${title}`}
        className="absolute inset-0 bg-ink/55"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        initial={reduce ? false : { x: 26, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={reduce ? { opacity: 0 } : { x: 20, opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-full w-full flex-col border-l border-line bg-bg shadow-[-24px_0_70px_-40px_rgb(14_27_29/0.55)] sm:max-w-[38rem]"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              <span aria-hidden className="size-1.5 bg-mint" />
              {eyebrow}
            </p>
            <h2
              id={titleId}
              className="mt-2 text-[clamp(1.4rem,2.4vw,1.85rem)] font-medium leading-[1.05] tracking-[-0.035em] text-fg"
            >
              {title}
            </h2>
            <p id={descriptionId} className="mt-1.5 max-w-[46ch] text-[11.5px] leading-relaxed text-muted">
              {description}
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

        {children}
      </motion.div>
    </motion.div>
  );
}

function FormField({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={LABEL}>
          {label}
          <span aria-hidden className="ml-1 text-accent">*</span>
        </label>
        {hint ? <span className="text-[10px] text-faint">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-danger"
        >
          <span aria-hidden className="size-1 bg-danger" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function OptionalField({
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
        {hint ? <span className="text-[10px] text-faint">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function PreviewNotice({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      <motion.p
        role="status"
        initial={reduce ? false : { opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.16 }}
        className="mb-3 border-l-2 border-accent bg-mint-tint px-3 py-2 text-[11px] leading-relaxed text-fg"
      >
        {children}
      </motion.p>
    </AnimatePresence>
  );
}

function DialogFooter({
  onClose,
  submitLabel,
  notice,
}: {
  onClose: () => void;
  submitLabel: string;
  notice: string | null;
}) {
  return (
    <footer className="shrink-0 border-t border-line bg-bg px-5 py-3.5 sm:px-6">
      {notice ? <PreviewNotice>{notice}</PreviewNotice> : null}
      <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.13em] text-faint">
          Preview form · nothing is stored
        </p>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
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
            {submitLabel}
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
  );
}

/* ------------------------------------------------------------ add research */

export function AddResearchDialog({
  idea,
  onClose,
}: {
  idea: MarketIdea;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [related, setRelated] = useState(`idea:${idea.id}`);
  const [evidence, setEvidence] = useState<EvidenceType>("observation");
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState<string | null>(null);

  const relatedOptions = [
    { value: `idea:${idea.id}`, label: `${idea.name} · idea` },
    ...idea.competitors.map((item) => ({
      value: `competitor:${item.id}`,
      label: `${item.name} · competitor`,
    })),
    ...idea.segments.map((item) => ({
      value: `segment:${item.id}`,
      label: `${item.name} · segment`,
    })),
    ...idea.opportunities.map((item) => ({
      value: `opportunity:${item.id}`,
      label: `${item.title} · opportunity`,
    })),
  ];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Errors = {};
    if (!title.trim()) next.title = "A note title is required";
    if (!content.trim()) next.content = "Write at least one observation";
    setErrors(next);
    if (Object.keys(next).length) {
      setNotice(null);
      return;
    }

    setNotice(
      `Preview only — “${title.trim()}” was not saved. Connect a data layer to keep this research note.`,
    );
  }

  return (
    <DialogShell
      eyebrow="New research · Stage 02"
      title="Add research"
      description="Capture the observation first. Interpretation can be added while the note is still fresh."
      onClose={onClose}
    >
      <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 [scrollbar-color:var(--line-2)_transparent] [scrollbar-width:thin] sm:px-6">
          <FormField
            id="mi-research-title"
            label="Note title"
            hint="Required"
            error={errors.title}
          >
            <input
              id="mi-research-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setErrors((current) => ({ ...current, title: "" }));
              }}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "mi-research-title-error" : undefined}
              placeholder="e.g. Support rewrites every release note"
              className={`${INPUT} h-11 ${errors.title ? "border-danger" : ""}`}
            />
          </FormField>

          <FormField
            id="mi-research-content"
            label="Observation / note"
            hint="Required"
            error={errors.content}
          >
            <textarea
              id="mi-research-content"
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                setErrors((current) => ({ ...current, content: "" }));
              }}
              aria-invalid={Boolean(errors.content)}
              aria-describedby={errors.content ? "mi-research-content-error" : undefined}
              rows={6}
              placeholder="What did you see or hear? Keep the observation separate from what you think it means."
              className={`${TEXTAREA} min-h-[8.5rem] ${errors.content ? "border-danger" : ""}`}
            />
          </FormField>

          <OptionalField id="mi-research-source" label="Source label" hint="Illustrative only">
            <input
              id="mi-research-source"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              placeholder="e.g. Support workflow walkthrough · sample notes"
              className={`${INPUT} h-11`}
            />
          </OptionalField>

          <div className="grid gap-4 sm:grid-cols-2">
            <OptionalField id="mi-research-related" label="Related entity">
              <select
                id="mi-research-related"
                value={related}
                onChange={(event) => setRelated(event.target.value)}
                className={`${INPUT} h-11`}
              >
                {relatedOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </OptionalField>

            <div>
              <p className={LABEL}>Date</p>
              <p className="mt-1.5 flex h-11 items-center border border-line bg-bg/50 px-3 font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
                {formatMarketDate(MARKET_TODAY)} · fixed sample date
              </p>
            </div>
          </div>

          <fieldset>
            <legend className={LABEL}>Evidence type</legend>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {EVIDENCE_TYPES.map((type) => {
                const active = evidence === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEvidence(type)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.11em] transition-colors ${
                      active
                        ? "border-accent bg-mint-tint/50 text-accent"
                        : "border-line text-faint hover:border-line-2 hover:text-fg"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`size-1 ${EVIDENCE_META[type].marker}`}
                    />
                    {EVIDENCE_META[type].label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[10.5px] leading-relaxed text-faint">
              {EVIDENCE_META[evidence].description}
            </p>
          </fieldset>

          <p className="border-t border-line pt-3 text-[10.5px] leading-relaxed text-faint">
            No source is fetched and no search is performed. Source labels are stored as sample
            text only.
          </p>
        </div>

        <DialogFooter onClose={onClose} submitLabel="Add note" notice={notice} />
      </form>
    </DialogShell>
  );
}

/* ---------------------------------------------------------- add competitor */

export function AddCompetitorDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [pricing, setPricing] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = "A competitor name is required";
    if (!description.trim()) next.description = "Add a short product description";
    setErrors(next);
    if (Object.keys(next).length) {
      setNotice(null);
      return;
    }

    setNotice(
      `Preview only — “${name.trim()}” was not saved. Nothing was fetched from the website or added to the competitor set.`,
    );
  }

  return (
    <DialogShell
      eyebrow="Competitor research · Stage 02"
      title="Add competitor"
      description="Record what you already know. The sample form never opens or analyses the website."
      onClose={onClose}
    >
      <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 [scrollbar-color:var(--line-2)_transparent] [scrollbar-width:thin] sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="mi-comp-name" label="Competitor name" hint="Required" error={errors.name}>
              <input
                id="mi-comp-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setErrors((current) => ({ ...current, name: "" }));
                }}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "mi-comp-name-error" : undefined}
                placeholder="e.g. ReleaseNote"
                className={`${INPUT} h-11 ${errors.name ? "border-danger" : ""}`}
              />
            </FormField>

            <OptionalField id="mi-comp-site" label="Website" hint="Sample only">
              <input
                id="mi-comp-site"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="competitor.example"
                className={`${INPUT} h-11`}
              />
            </OptionalField>
          </div>

          <FormField
            id="mi-comp-description"
            label="Product description"
            hint="Required"
            error={errors.description}
          >
            <textarea
              id="mi-comp-description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setErrors((current) => ({ ...current, description: "" }));
              }}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "mi-comp-description-error" : undefined}
              rows={3}
              placeholder="What does the product do, in plain language?"
              className={`${TEXTAREA} min-h-[5rem] ${errors.description ? "border-danger" : ""}`}
            />
          </FormField>

          <OptionalField id="mi-comp-audience" label="Target audience">
            <input
              id="mi-comp-audience"
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
              placeholder="e.g. Product teams at 10–100 people"
              className={`${INPUT} h-11`}
            />
          </OptionalField>

          <OptionalField id="mi-comp-pricing" label="Pricing model" hint="If known">
            <input
              id="mi-comp-pricing"
              value={pricing}
              onChange={(event) => setPricing(event.target.value)}
              placeholder="e.g. $29 / month per workspace · sample pricing"
              className={`${INPUT} h-11`}
            />
          </OptionalField>

          <OptionalField id="mi-comp-notes" label="Observation notes">
            <textarea
              id="mi-comp-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              placeholder="What did you notice about the positioning, product or pricing?"
              className={`${TEXTAREA} min-h-[6rem]`}
            />
          </OptionalField>

          <div className="border border-line bg-bg/40 px-3 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-faint">
              Manual entry only
            </p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-faint">
              No website is opened, scraped or analysed. The name and details are captured as
              text by you.
            </p>
          </div>
        </div>

        <DialogFooter onClose={onClose} submitLabel="Add competitor" notice={notice} />
      </form>
    </DialogShell>
  );
}

/* ------------------------------------------------------------- add segment */

export function AddSegmentDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [painPoints, setPainPoints] = useState("");
  const [alternatives, setAlternatives] = useState("");
  const [needs, setNeeds] = useState("");
  const [questions, setQuestions] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = "A segment name is required";
    if (!description.trim()) next.description = "Describe the customer situation";
    setErrors(next);
    if (Object.keys(next).length) {
      setNotice(null);
      return;
    }

    setNotice(
      `Preview only — “${name.trim()}” was not saved. No audience is generated or sized by the interface.`,
    );
  }

  return (
    <DialogShell
      eyebrow="Segment research · Stage 02"
      title="Add market segment"
      description="Describe a customer situation you can recognise in your sample research."
      onClose={onClose}
    >
      <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 [scrollbar-color:var(--line-2)_transparent] [scrollbar-width:thin] sm:px-6">
          <FormField id="mi-seg-name" label="Segment name" hint="Required" error={errors.name}>
            <input
              id="mi-seg-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setErrors((current) => ({ ...current, name: "" }));
              }}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "mi-seg-name-error" : undefined}
              placeholder="e.g. Product leads at small SaaS teams"
              className={`${INPUT} h-11 ${errors.name ? "border-danger" : ""}`}
            />
          </FormField>

          <FormField
            id="mi-seg-description"
            label="Description"
            hint="Required"
            error={errors.description}
          >
            <textarea
              id="mi-seg-description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setErrors((current) => ({ ...current, description: "" }));
              }}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "mi-seg-description-error" : undefined}
              rows={3}
              placeholder="Who are they, and what situation brings them here?"
              className={`${TEXTAREA} min-h-[5rem] ${errors.description ? "border-danger" : ""}`}
            />
          </FormField>

          <OptionalField id="mi-seg-type" label="Customer type" hint="Role in the research">
            <input
              id="mi-seg-type"
              value={customerType}
              onChange={(event) => setCustomerType(event.target.value)}
              placeholder="e.g. Buyer · editor"
              className={`${INPUT} h-11`}
            />
          </OptionalField>

          <OptionalField id="mi-seg-pain" label="Main pain points" hint="One per line">
            <textarea
              id="mi-seg-pain"
              value={painPoints}
              onChange={(event) => setPainPoints(event.target.value)}
              rows={3}
              placeholder={"Release notes are written late.\nThe output is too technical for customers."}
              className={`${TEXTAREA} min-h-[5rem]`}
            />
          </OptionalField>

          <OptionalField id="mi-seg-alternatives" label="Current alternatives" hint="One per line">
            <textarea
              id="mi-seg-alternatives"
              value={alternatives}
              onChange={(event) => setAlternatives(event.target.value)}
              rows={2}
              placeholder={"A shared document.\nA public changelog tool."}
              className={`${TEXTAREA} min-h-[4rem]`}
            />
          </OptionalField>

          <OptionalField id="mi-seg-needs" label="Needs & motivations" hint="One per line">
            <textarea
              id="mi-seg-needs"
              value={needs}
              onChange={(event) => setNeeds(event.target.value)}
              rows={2}
              placeholder={"A draft that preserves meaning.\nConfidence that the note is accurate."}
              className={`${TEXTAREA} min-h-[4rem]`}
            />
          </OptionalField>

          <OptionalField id="mi-seg-questions" label="Unanswered questions" hint="One per line">
            <textarea
              id="mi-seg-questions"
              value={questions}
              onChange={(event) => setQuestions(event.target.value)}
              rows={2}
              placeholder={"How much editing is acceptable?\nDoes this person control the budget?"}
              className={`${TEXTAREA} min-h-[4rem]`}
            />
          </OptionalField>

          <p className="border-t border-line pt-3 text-[10.5px] leading-relaxed text-faint">
            The form does not calculate market size or generate personas. Every line is sample
            text entered by hand.
          </p>
        </div>

        <DialogFooter onClose={onClose} submitLabel="Add segment" notice={notice} />
      </form>
    </DialogShell>
  );
}
