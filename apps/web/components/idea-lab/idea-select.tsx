"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

export type IdeaSelectOption = { value: string; label: string; shortLabel?: string };

/**
 * A compact, keyboard-operable select for the workspace controls. It changes
 * the selected value for presentation only; the caller owns what that means.
 */
export function IdeaSelect({
  label,
  value,
  options,
  onChange,
  align = "left",
  className = "",
}: {
  label: string;
  value: string;
  options: readonly IdeaSelectOption[];
  onChange: (value: string) => void;
  align?: "left" | "right";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selected = options[selectedIndex] ?? options[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const node = menuRef.current?.querySelector<HTMLElement>(
      `[data-option-index="${activeIndex}"]`,
    );
    node?.focus({ preventScroll: true });
  }, [open, activeIndex]);

  function choose(next: string) {
    onChange(next);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function toggle() {
    if (!open) setActiveIndex(selectedIndex);
    setOpen((current) => !current);
  }

  function onMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const last = options.length - 1;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index >= last ? 0 : index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? last : index - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(last);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={toggle}
        className={`flex h-8 w-full min-w-0 max-w-full items-center gap-2 border bg-panel px-2.5 transition-colors ${
          open ? "border-accent text-accent" : "border-line hover:border-line-2"
        }`}
      >
        <span className="shrink-0 font-mono text-[8.5px] uppercase tracking-[0.16em] text-faint">
          {label}
        </span>
        <span aria-hidden className="h-3 w-px shrink-0 bg-line" />
        <span className="min-w-0 truncate font-mono text-[9.5px] uppercase tracking-[0.1em] text-fg">
          {selected?.shortLabel ?? selected?.label}
        </span>
        <svg
          width="9"
          height="9"
          viewBox="0 0 10 10"
          aria-hidden
          className={`ml-auto shrink-0 fill-none stroke-current stroke-[1.4] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="m2 3.5 3 3 3-3" strokeLinecap="square" />
        </svg>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={menuRef}
            id={listboxId}
            role="listbox"
            aria-label={label}
            onKeyDown={onMenuKeyDown}
            initial={reduce ? false : { opacity: 0, y: -4, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -3, scale: 0.99 }}
            transition={{ duration: reduce ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-[calc(100%+4px)] z-30 w-max min-w-full max-w-[17rem] border border-line bg-bg py-1 shadow-[0_18px_44px_-28px_rgb(14_27_29/0.45)] ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {options.map((option, index) => {
              const active = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  data-option-index={index}
                  tabIndex={-1}
                  onClick={() => choose(option.value)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex w-full items-center justify-between gap-4 px-3 py-2 text-left text-[12px] transition-colors focus:bg-mint-tint/60 focus:outline-none ${
                    active ? "text-accent" : "text-muted hover:text-fg"
                  } ${index === activeIndex ? "bg-mint-tint/45" : ""}`}
                >
                  <span className="truncate">{option.label}</span>
                  {active ? <span aria-hidden className="size-1.5 shrink-0 bg-accent" /> : null}
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
