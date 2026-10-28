"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { SearchEntry } from "@/lib/docs";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Documentation search: real filtering over an index derived from the page
 *  content. Opens from the toolbar button or ⌘K / Ctrl+K. */
export default function DocsSearch({ entries }: { entries: SearchEntry[] }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Landing state: the pages themselves, as quick jumps.
      return entries.filter((e) => !e.hash).slice(0, 6);
    }
    return entries
      .filter((e) =>
        `${e.title} ${e.context} ${e.snippet}`.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [entries, query]);

  function close() {
    setOpen(false);
    setQuery("");
    setActive(0);
    triggerRef.current?.focus();
  }

  function go(entry: SearchEntry) {
    router.push(entry.hash ? `${entry.path}#${entry.hash}` : entry.path);
    close();
  }

  // ⌘K / Ctrl+K anywhere in the docs.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Escape closes and returns focus to the toolbar button.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
        setActive(0);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus the field on open; lock background scroll while the dialog is up;
  // reset the query whenever it closes (button, Esc, ⌘K, or navigation).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      setQuery("");
      setActive(0);
      triggerRef.current?.focus();
    }
  }, [open]);

  // Keep the keyboard-active result visible.
  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function onInputKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Search the documentation"
        className="flex h-8 w-8 shrink-0 items-center justify-between gap-3 border border-line px-2 text-left transition-colors hover:border-accent/60 hover:text-accent sm:w-[168px] sm:px-3 lg:w-[210px]"
      >
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
          <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden className="shrink-0 fill-none stroke-current stroke-[1.5]">
            <circle cx="7" cy="7" r="4.5" />
            <path d="m10.5 10.5 4 4" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">Search</span>
        </span>
        <kbd className="hidden border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[14vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
          >
            <div
              className="absolute inset-0 bg-ink/50"
              onClick={close}
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Search documentation"
              initial={reduce ? false : { opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: reduce ? 0 : 0.24, ease: EASE }}
              className="relative w-full max-w-[620px] border border-line bg-bg shadow-[0_28px_70px_-24px_rgb(14_27_29/0.45)]"
            >
              <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden className="shrink-0 fill-none stroke-faint stroke-[1.5]">
                  <circle cx="7" cy="7" r="4.5" />
                  <path d="m10.5 10.5 4 4" strokeLinecap="round" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onInputKeyDown}
                  placeholder="Search the documentation…"
                  aria-label="Search the documentation"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="docs-search-results"
                  aria-activedescendant={
                    results[active] ? `docs-search-result-${active}` : undefined
                  }
                  autoComplete="off"
                  className="w-full bg-transparent text-[15px] text-fg outline-none placeholder:text-faint"
                />
                <button
                  type="button"
                  onClick={close}
                  className="shrink-0 border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-faint transition-colors hover:border-accent hover:text-accent"
                >
                  Esc
                </button>
              </div>

              <ul
                id="docs-search-results"
                ref={listRef}
                role="listbox"
                aria-label="Search results"
                className="max-h-[52vh] overflow-y-auto py-2"
              >
                {results.length === 0 && (
                  <li className="px-4 py-6 text-center text-[14px] text-muted">
                    No results for “{query.trim()}”. Try{" "}
                    <span className="text-accent">pnpm</span>,{" "}
                    <span className="text-accent">stages</span>, or{" "}
                    <span className="text-accent">architecture</span>.
                  </li>
                )}
                {results.map((entry, i) => (
                  <li
                    key={`${entry.path}${entry.hash ?? ""}${i}`}
                    id={`docs-search-result-${i}`}
                    role="option"
                    aria-selected={i === active}
                  >
                    <a
                      href={entry.hash ? `${entry.path}#${entry.hash}` : entry.path}
                      onClick={() => go(entry)}
                      onMouseEnter={() => setActive(i)}
                      className={`block px-4 py-2.5 transition-colors ${
                        i === active ? "bg-mint-tint" : ""
                      }`}
                    >
                      <span className="flex items-baseline justify-between gap-4">
                        <span className="text-[14.5px] font-medium text-fg">
                          {entry.title}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-faint">
                          {entry.context}
                        </span>
                      </span>
                      {entry.snippet && (
                        <span className="mt-0.5 block line-clamp-1 text-[12.5px] text-muted">
                          {entry.snippet}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between border-t border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-faint">
                <span>↑ ↓ to navigate · ↵ to open</span>
                <span>{results.length} result{results.length === 1 ? "" : "s"}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}