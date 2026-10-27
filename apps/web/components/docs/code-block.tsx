"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Pre-highlighted HTML from shiki (produced on the server). */
  html: string;
  /** Raw source, handed to the clipboard. */
  code: string;
  lang: string;
  label?: string;
};

/** Dark, hairline-framed code block with a working copy control. */
export default function CodeBlock({ html, code, lang, label }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (permissions) — fail quietly, code stays selectable.
    }
  }

  return (
    <figure className="on-ink my-7 border border-line">
      <figcaption className="flex items-center justify-between gap-4 border-b border-line bg-bg px-4 py-2">
        <span className="min-w-0 truncate font-mono text-[10.5px] uppercase tracking-[0.22em] text-faint">
          {label ?? lang}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Code copied" : "Copy code to clipboard"}
          className="shrink-0 border border-line px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-faint transition-colors hover:border-accent hover:text-accent"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </figcaption>
      <div
        className="overflow-x-auto bg-panel px-4 py-3.5 text-[13px] leading-[1.7] font-mono [&_.shiki]:bg-transparent!"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <span aria-live="polite" className="sr-only">
        {copied ? "Code copied to clipboard" : ""}
      </span>
    </figure>
  );
}