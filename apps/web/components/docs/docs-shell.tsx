"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { SearchEntry, SidebarTree, TocItem } from "@/lib/docs";
import SidebarNav from "./sidebar";
import TableOfContents from "./toc";
import DocsSearch from "./search";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Documentation chrome: sticky breadcrumb toolbar, desktop sidebar rail,
 *  mobile drawer, and the table-of-contents rail. Content is passed in from
 *  the server as children. */
export default function DocsShell({
  tree,
  toc,
  searchEntries,
  category,
  title,
  children,
}: {
  tree: SidebarTree;
  toc: TocItem[];
  searchEntries: SearchEntry[];
  category: string;
  title: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  function closeMenu(restoreFocus = true) {
    setMenuOpen(false);
    if (restoreFocus) menuBtnRef.current?.focus();
  }

  // Focus the drawer's close button when it opens; Esc closes it.
  useEffect(() => {
    if (!menuOpen) return;
    closeBtnRef.current?.focus();
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div>
      {/* Toolbar: breadcrumbs + search, sticky under the site header */}
      <div className="sticky top-16 z-40 border-b border-line bg-bg">
        <div className="flex h-12 items-center gap-3 px-4 sm:px-6">
          <button
            ref={menuBtnRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="docs-sidebar-drawer"
            aria-label="Open documentation menu"
            className="-ml-1 flex h-8 w-8 shrink-0 items-center justify-center border border-line text-faint transition-colors hover:border-accent hover:text-accent lg:hidden"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden className="stroke-current stroke-[1.5]">
              <path d="M2 4h12M2 8h12M2 12h12" strokeLinecap="round" />
            </svg>
          </button>

          <nav aria-label="Breadcrumb" className="min-w-0 flex-1 overflow-hidden">
            <ol className="flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase">
              <li>
                <Link href="/docs" className="text-faint transition-colors hover:text-accent">
                  Docs
                </Link>
              </li>
              <li aria-hidden className="text-faint/70">
                /
              </li>
              <li className="hidden min-w-0 max-w-[36%] truncate text-faint sm:block">
                {category}
              </li>
              <li aria-hidden className="hidden text-faint/70 sm:block">
                /
              </li>
              <li aria-current="page" className="min-w-0 truncate text-fg">
                {title}
              </li>
            </ol>
          </nav>

          <DocsSearch entries={searchEntries} />
        </div>
      </div>

      <div className="grid lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_216px]">
        {/* Desktop sidebar rail */}
        <aside className="hidden border-r border-line lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto px-6 py-8">
            <SidebarNav tree={tree} />
          </div>
        </aside>

        {children}

        {/* Table of contents rail */}
        {toc.length > 0 && (
          <aside className="hidden border-l border-line xl:block">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto px-5 py-8">
              <TableOfContents items={toc} />
            </div>
          </aside>
        )}
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-ink/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.2 }}
              onClick={() => closeMenu(false)}
              aria-hidden
            />
            <motion.aside
              id="docs-sidebar-drawer"
              key="drawer"
              className="fixed inset-y-0 left-0 z-50 w-[86%] max-w-[320px] overflow-y-auto border-r border-line bg-bg lg:hidden"
              initial={reduce ? { opacity: 0 } : { x: "-100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "-100%" }}
              transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                  Documentation
                </span>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => closeMenu()}
                  aria-label="Close documentation menu"
                  className="flex h-7 w-7 items-center justify-center border border-line text-faint transition-colors hover:border-accent hover:text-accent"
                >
                  ✕
                </button>
              </div>
              <div className="px-5 py-6">
                <SidebarNav tree={tree} onNavigate={() => closeMenu(false)} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}