"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/docs";

/** On-page table of contents with a scroll-spy active state. */
export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost heading currently intersecting the reading band.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-140px 0px -65% 0px", threshold: 0 },
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page" className="flex flex-col gap-3">
      <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-faint">
        On this page
      </h2>
      <ul className="border-l border-line">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`relative -ml-px block border-l py-1.5 pl-4 text-[13px] leading-snug transition-colors ${
                  isActive
                    ? "border-accent text-accent"
                    : "border-transparent text-faint hover:border-line-2 hover:text-fg"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}