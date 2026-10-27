import Link from "next/link";
import type { Pagination } from "@/lib/docs";

/** Previous / next page navigation between documentation pages. */
export default function PrevNext({ prev, next }: Pagination) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Documentation pagination"
      className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
    >
      {prev && (
        <Link
          href={prev.path}
          className="group border border-line p-4 transition-colors hover:border-accent"
        >
          <span className="block font-mono text-[10.5px] uppercase tracking-[0.2em] text-faint">
            ← Previous
          </span>
          <span className="mt-1.5 block text-[15px] font-medium text-fg transition-colors group-hover:text-accent">
            {prev.title}
          </span>
        </Link>
      )}
      {next && (
        <Link
          href={next.path}
          className="group border border-line p-4 text-right transition-colors hover:border-accent sm:col-start-2"
        >
          <span className="block font-mono text-[10.5px] uppercase tracking-[0.2em] text-faint">
            Next →
          </span>
          <span className="mt-1.5 block text-[15px] font-medium text-fg transition-colors group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}