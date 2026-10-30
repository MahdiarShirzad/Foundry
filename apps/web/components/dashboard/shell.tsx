"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { STAGES } from "@/components/site/data";
import { stageSlug } from "@/lib/dashboard/snapshot";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type NavItem = {
  label: string;
  href: string;
  glyph?: ReactNode;
  meta?: string;
  /** Anchor-only entries never take an active state. */
  anchored?: boolean;
};

type NavGroup = { title: string; items: NavItem[] };

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/idea-lab": "Idea Lab",
  "/dashboard/market-intelligence": "Market Intelligence",
  "/dashboard/validation-lab": "Validation Lab",
  "/dashboard/mvp-studio": "MVP Studio",
  "/dashboard/product-roadmap": "Product Roadmap",
  "/dashboard/launch-center": "Launch Center",
  "/dashboard/feedback-hub": "Feedback Hub",
  "/dashboard/founder-analytics": "Founder Analytics",
  "/dashboard/modules": "Modules",
};

function Glyph({ name }: { name: "overview" | "modules" | "docs" | "api" | "log" }) {
  const paths: Record<string, ReactNode> = {
    overview: (
      <>
        <rect x="2" y="2" width="5" height="5" />
        <rect x="9" y="2" width="5" height="5" />
        <rect x="2" y="9" width="5" height="5" />
        <rect x="9" y="9" width="5" height="5" />
      </>
    ),
    modules: (
      <>
        <path d="M8 2 14 5.5 8 9 2 5.5 8 2Z" />
        <path d="m2 8.5 6 3.5 6-3.5" />
        <path d="m2 11.5 6 3.5 6-3.5" />
      </>
    ),
    docs: (
      <>
        <path d="M4 2h5l3 3v9H4z" />
        <path d="M9 2v3h3" />
      </>
    ),
    api: (
      <>
        <path d="M6 3c-1.5 0-2 1-2 2.5S3.5 8 2 8c1.5 0 2 1 2 2.5S4.5 13 6 13" />
        <path d="M10 3c1.5 0 2 1 2 2.5S12.5 8 14 8c-1.5 0-2 1-2 2.5S11.5 13 10 13" />
      </>
    ),
    log: (
      <>
        <path d="M3 4h10M3 8h10M3 12h6" />
      </>
    ),
  };
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      aria-hidden
      className="shrink-0 fill-none stroke-current stroke-[1.4]"
      strokeLinecap="square"
    >
      {paths[name]}
    </svg>
  );
}

const GROUPS: NavGroup[] = [
  {
    title: "Workspace",
    items: [
      { label: "Overview", href: "/dashboard", glyph: <Glyph name="overview" /> },
      { label: "Modules", href: "/dashboard/modules", glyph: <Glyph name="modules" /> },
    ],
  },
  {
    title: "Cycle",
    items: STAGES.map((stage) => {
      // Stages with a dedicated workspace link straight to it; later stages
      // still deep-link into the cycle reference until their routes exist.
      const route =
        stage.id === "01"
          ? "/dashboard/idea-lab"
          : stage.id === "02"
            ? "/dashboard/market-intelligence"
            : stage.id === "03"
              ? "/dashboard/validation-lab"
              : stage.id === "04"
                ? "/dashboard/mvp-studio"
                  : stage.id === "05"
                    ? "/dashboard/product-roadmap"
                  : stage.id === "06"
                    ? "/dashboard/launch-center"
                    : stage.id === "07"
                      ? "/dashboard/feedback-hub"
                      : stage.id === "08"
                        ? "/dashboard/founder-analytics"
                        : null;
      return {
        label: stage.name,
        href: route ?? `/dashboard/modules#${stageSlug(stage.id)}`,
        meta: stage.id,
        anchored: !route,
      };
    }),
  },
  {
    title: "Reference",
    items: [
      { label: "Documentation", href: "/docs", glyph: <Glyph name="docs" /> },
      { label: "API reference", href: "/api-reference", glyph: <Glyph name="api" /> },
      { label: "Changelog", href: "/changelog", glyph: <Glyph name="log" /> },
    ],
  },
];

/* ------------------------------------------------------------------ sidebar */

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2.5 border-b border-line px-4">
        <Link
          href="/"
          aria-label="Foundry — home"
          className="inline-flex shrink-0 items-center"
        >
          <Image
            src={collapsed ? "/icon-white.png" : "/logo-white.png"}
            alt="Foundry"
            width={1300}
            height={400}
            className={
              collapsed ? "size-7 self-start object-contain" : "h-6 w-auto self-start"
            }
          />
        </Link>
        {!collapsed ? (
          <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
            app
          </span>
        ) : null}
      </div>

      {!collapsed ? (
        <div className="border-b border-line px-4 py-4">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="flex size-7 shrink-0 items-center justify-center border border-line-2 font-mono text-[10px] tracking-[0.08em] text-accent"
            >
              HL
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium text-fg">Helio Labs</span>
              <span className="block font-mono text-[9.5px] uppercase tracking-[0.18em] text-faint">
                demo workspace
              </span>
            </span>
          </div>
        </div>
      ) : null}

      <nav aria-label="Dashboard" className="flex-1 overflow-y-auto py-4">
        {GROUPS.map((group) => (
          <div key={group.title} className={collapsed ? "mt-3 first:mt-0" : "mt-5 first:mt-0"}>
            {!collapsed ? (
              <h2 className="px-4 font-mono text-[9.5px] uppercase tracking-[0.24em] text-faint">
                {group.title}
              </h2>
            ) : (
              <span aria-hidden className="mx-4 mb-2 block h-px bg-line" />
            )}
            <ul className={collapsed ? "mt-1" : "mt-2"}>
              {group.items.map((item) => {
                const active = !item.anchored && pathname === item.href;
                return (
                  <li key={`${group.title}-${item.href}`}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      title={collapsed ? item.label : undefined}
                      className={`group relative flex items-center gap-2.5 py-[7px] text-[12.5px] transition-colors ${
                        collapsed ? "justify-center px-2" : "px-4"
                      } ${
                        active
                          ? "text-accent"
                          : "text-muted hover:bg-mint-tint/40 hover:text-fg"
                      }`}
                    >
                      {active ? (
                        <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-accent" />
                      ) : null}
                      {item.glyph}
                      {item.meta ? (
                        <span
                          className={`font-mono text-[9.5px] tracking-[0.16em] ${
                            active ? "text-accent" : "text-faint"
                          }`}
                        >
                          {item.meta}
                        </span>
                      ) : null}
                      {!collapsed ? <span className="truncate">{item.label}</span> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line px-4 py-3">
        {collapsed ? (
          <Link
            href="/"
            aria-label="Back to site"
            className="mx-auto flex size-7 items-center justify-center border border-line-2 font-mono text-[10px] text-faint transition-colors hover:border-accent hover:text-accent"
          >
            ↗
          </Link>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[12px] text-fg">Mahdyar</p>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-faint">
                not signed in
              </p>
            </div>
            <Link
              href="/login"
              className="shrink-0 border border-line-2 px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- topbar */

function CommandDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const destinations = useMemo(
    () => [
      { label: "Overview", href: "/dashboard", hint: "Workspace" },
      { label: "Idea Lab", href: "/dashboard/idea-lab", hint: "Cycle" },
      {
        label: "Market Intelligence",
        href: "/dashboard/market-intelligence",
        hint: "Cycle",
      },
      { label: "Modules", href: "/dashboard/modules", hint: "Workspace" },
      { label: "Documentation", href: "/docs", hint: "Reference" },
      { label: "The Eight Stages", href: "/docs/eight-stages", hint: "Documentation" },
      { label: "API reference", href: "/api-reference", hint: "Reference" },
      { label: "Changelog", href: "/changelog", hint: "Reference" },
      { label: "Back to site", href: "/", hint: "Foundry" },
    ],
    [],
  );

  const results = destinations.filter((item) =>
    `${item.label} ${item.hint}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.16 }}
        >
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="absolute inset-0 bg-ink/50"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Jump to"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
            className="relative w-full max-w-[560px] border border-line bg-bg shadow-[0_24px_60px_-28px_rgb(14_27_29/0.5)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <span aria-hidden className="font-mono text-[11px] text-faint">
                ⌘
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Jump to a page…"
                aria-label="Jump to a page"
                className="w-full bg-transparent text-[14px] text-fg outline-none placeholder:text-faint"
              />
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 border border-line px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent hover:text-accent"
              >
                esc
              </button>
            </div>
            <ul className="max-h-[46vh] overflow-y-auto py-1.5">
              {results.length === 0 ? (
                <li className="px-4 py-6 text-center text-[13px] text-muted">
                  Nothing matches “{query}”.
                </li>
              ) : null}
              {results.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-baseline justify-between gap-4 px-4 py-2 text-[13.5px] text-fg transition-colors hover:bg-mint-tint/50"
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint">
                      {item.hint}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function AccountMenu() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className="flex size-8 items-center justify-center border border-line-2 font-mono text-[10px] tracking-[0.06em] text-fg transition-colors hover:border-accent hover:text-accent"
      >
        MH
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            aria-label="Account"
            initial={reduce ? false : { opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.16, ease: EASE }}
            className="absolute right-0 top-10 z-40 w-56 border border-line bg-bg py-1"
          >
            <div className="border-b border-line px-3 py-2.5">
              <p className="text-[12.5px] text-fg">Mahdyar</p>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint">
                demo workspace
              </p>
            </div>
            {[
              { label: "Sign in", href: "/login" },
              { label: "Documentation", href: "/docs" },
              { label: "Back to site", href: "/" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-[12.5px] text-muted transition-colors hover:bg-mint-tint/50 hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [command, setCommand] = useState(false);

  const title = PAGE_TITLES[pathname] ?? "Overview";

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommand((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!drawer) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  return (
    <div className="flex min-h-screen bg-bg">
      <aside
        className={`on-ink sticky top-0 hidden h-screen shrink-0 overflow-hidden border-r border-line bg-bg text-fg transition-[width] duration-200 ease-out lg:block ${
          collapsed ? "w-[4.5rem]" : "w-[15.5rem]"
        }`}
      >
        <SidebarContent collapsed={collapsed} />
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="absolute bottom-16 left-1/2 hidden h-7 w-7 -translate-x-1/2 items-center justify-center border border-line-2 font-mono text-[10px] text-faint transition-colors hover:border-accent hover:text-accent lg:flex"
        >
          {collapsed ? "»" : "«"}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-bg">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Open dashboard navigation"
              aria-expanded={drawer}
              className="flex size-8 items-center justify-center border border-line-2 text-fg transition-colors hover:border-accent hover:text-accent lg:hidden"
            >
              <span aria-hidden className="font-mono text-[12px] leading-none">
                ≡
              </span>
            </button>

            <nav aria-label="Breadcrumb" className="min-w-0">
              <ol className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em]">
                <li className="hidden text-faint sm:block">Workspace</li>
                <li aria-hidden className="hidden text-faint/60 sm:block">
                  /
                </li>
                <li className="truncate text-fg">{title}</li>
              </ol>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCommand(true)}
                className="hidden h-8 items-center gap-2 border border-line px-2.5 text-left transition-colors hover:border-accent/60 md:flex"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  aria-hidden
                  className="fill-none stroke-faint stroke-[1.5]"
                >
                  <circle cx="7" cy="7" r="4.5" />
                  <path d="m10.5 10.5 4 4" strokeLinecap="round" />
                </svg>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                  Jump to
                </span>
                <kbd className="border border-line px-1 font-mono text-[9px] text-faint">⌘K</kbd>
              </button>

              <Link
                href="/docs/backend-api"
                className="hidden h-8 items-center gap-2 border border-line px-2.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-faint transition-colors hover:border-accent/60 hover:text-accent sm:flex"
              >
                <span aria-hidden className="size-1.5 bg-accent" />
                Demo data
              </Link>

              <AccountMenu />
            </div>
          </div>
        </header>

        <main id="content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-7">
          {children}
        </main>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer ? (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
          >
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setDrawer(false)}
              className="absolute inset-0 bg-ink/50"
            />
            <motion.div
              aria-label="Dashboard navigation"
              className="on-ink absolute inset-y-0 left-0 w-[16rem] border-r border-line bg-bg text-fg"
              initial={reduce ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "-100%" }}
              transition={{ duration: reduce ? 0 : 0.26, ease: EASE }}
            >
              <SidebarContent collapsed={false} onNavigate={() => setDrawer(false)} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <CommandDialog open={command} onClose={() => setCommand(false)} />
    </div>
  );
}
