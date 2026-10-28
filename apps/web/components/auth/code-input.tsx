"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

/**
 * Six separated code slots behaving as one field: auto-advance, backspace to
 * the previous slot, arrow navigation, paste-anywhere distribution and numeric
 * keypads on mobile. The group is labelled for screen readers and every slot
 * announces its position.
 */
export default function CodeInput({
  id,
  label,
  value,
  onChange,
  length = 6,
  disabled,
  invalid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  length?: number;
  disabled?: boolean;
  invalid?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  function focusSlot(index: number) {
    const target = refs.current[Math.max(0, Math.min(index, length - 1))];
    target?.focus();
    target?.select();
  }

  /** Writes `chars` starting at `start`, trimming to the field length. */
  function write(start: number, chars: string) {
    const clean = chars.replace(/\D/g, "");
    if (!clean) return;
    const next = (value.slice(0, start) + clean).slice(0, length);
    onChange(next);
    focusSlot(next.length >= length ? length - 1 : next.length);
  }

  function handleChange(index: number, raw: string) {
    const clean = raw.replace(/\D/g, "");
    if (!clean) {
      onChange(value.slice(0, index));
      return;
    }
    write(index, clean);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    const { key } = event;
    if (key === "Backspace") {
      event.preventDefault();
      if (digits[index]) {
        onChange(value.slice(0, index));
        return;
      }
      const prev = Math.max(0, index - 1);
      onChange(value.slice(0, prev));
      focusSlot(prev);
      return;
    }
    if (key === "Delete") {
      event.preventDefault();
      onChange(value.slice(0, index));
      return;
    }
    if (key === "ArrowLeft") {
      event.preventDefault();
      focusSlot(index - 1);
      return;
    }
    if (key === "ArrowRight") {
      event.preventDefault();
      focusSlot(index + 1);
      return;
    }
    if (key === "Home") {
      event.preventDefault();
      focusSlot(0);
      return;
    }
    if (key === "End") {
      event.preventDefault();
      focusSlot(length - 1);
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const text = event.clipboardData.getData("text");
    if (!/\d/.test(text)) return;
    event.preventDefault();
    write(0, text);
  }

  return (
    <div onPaste={handlePaste}>
      <span id={`${id}-label`} className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-faint">
        {label}
      </span>
      <div
        id={id}
        role="group"
        aria-labelledby={`${id}-label`}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className="mt-2 flex gap-2 sm:gap-2.5"
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={(e) => e.currentTarget.select()}
            disabled={disabled}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={invalid ? true : undefined}
            className={`h-13 w-full min-w-0 border bg-panel pt-1 text-center font-mono text-[19px] text-fg outline-none transition-colors disabled:cursor-not-allowed disabled:bg-bg ${
              invalid
                ? "border-danger"
                : digit
                  ? "border-line-2 focus:border-accent"
                  : "border-line hover:border-line-2 focus:border-accent"
            }`}
            style={{ height: "3.25rem" }}
          />
        ))}
      </div>
      {invalid ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-[12.5px] text-danger">
          <span aria-hidden className="mt-[2px] font-mono">
            !
          </span>
          That code isn&apos;t right. Check the six digits and try again.
        </p>
      ) : null}
    </div>
  );
}
