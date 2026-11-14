"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import LogoutButton from "@/components/auth/logout-button";
import { STAGES } from "@/components/site/data";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/use-session";
import { stageSlug } from "@/lib/dashboard/snapshot";
import { useCreateProduct, useProducts } from "@/lib/product/use-products";
import { useHydrated } from "@/lib/use-hydrated";
import { useWorkspace } from "@/lib/workspace/use-workspace";

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

/** First letters of up to two words, e.g. "Acme Inc" → "AI". */
function initialsFor(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "—";
  const [first, second] = words;
  return second
    ? `${first[0]}${second[0]}`.toUpperCase()
    : first.slice(0, 2).toUpperCase();
}

/** Shape returned by `GET /products`. */
type Product = {
  id: string;
  name: string;
  slug?: string;
};

/* --------------------------------------------------------- product switcher */

function ProductSwitcherFallback() {
  return (
    <div className="border-b border-line px-4 py-4" aria-hidden>
      <span className="block h-2 w-16 animate-pulse bg-line" />
      <div className="mt-3 space-y-1.5">
        {[0, 1, 2].map((row) => (
          <span key={row} className="block h-7 w-full animate-pulse bg-line/80" />
        ))}
      </div>
    </div>
  );
}

function ProductSwitcher({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeId = searchParams.get("product");

  const { data, isPending, isError } = useProducts();
  const createProduct = useCreateProduct();

  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // `getAllProducts` is untyped at the client wrapper, so narrow here.
  const products = (data as Product[] | undefined) ?? [];

  function selectProduct(productId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("product", productId);
    router.push(`${pathname}?${params.toString()}`);
    onNavigate?.();
  }

  function closeCreate() {
    setCreating(false);
    setName("");
    setError(null);
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || createProduct.isPending) return;

    setError(null);
    createProduct.mutate(trimmed, {
      onSuccess: (product) => {
        closeCreate();
        const created = product as Product | undefined;
        if (created?.id) selectProduct(created.id);
      },
      onError: (mutationError) => {
        setError(
          mutationError instanceof Error
            ? mutationError.message
            : "Could not create product",
        );
      },
    });
  }

  return (
    <div className="px-3 pb-3 pt-4">
      <div className="flex items-center justify-between gap-2 px-2 pb-2">
        <h2 className="text-[12px] font-medium text-faint">Products</h2>
        {!creating ? (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-[6px] px-1.5 py-0.5 text-[12px] font-medium text-accent transition-colors hover:bg-mint-tint/25 hover:text-fg"
          >
            + New
          </button>
        ) : null}
      </div>

      {creating ? (
        <form onSubmit={handleCreate} className="mt-1 space-y-2 px-1">
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") closeCreate();
            }}
            placeholder="Product name"
            aria-label="New product name"
            disabled={createProduct.isPending}
            className="h-9 w-full rounded-control border border-line bg-bg/40 px-2.5 text-[13px] text-fg outline-none transition-colors placeholder:text-faint/80 focus:border-accent disabled:opacity-60"
          />
          {error ? (
            <p className="text-[12px] leading-snug text-danger">{error}</p>
          ) : null}
          <div className="flex items-center gap-1.5">
            <Button
              type="submit"
              variant="primary"
              size="xs"
              disabled={!name.trim() || createProduct.isPending}
            >
              {createProduct.isPending ? "Adding…" : "Add"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={closeCreate}
              disabled={createProduct.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : isPending ? (
        <div aria-hidden className="mt-1 space-y-1 px-1">
          {[0, 1, 2].map((row) => (
            <span key={row} className="block h-9 w-full animate-pulse rounded-control bg-line/50" />
          ))}
        </div>
      ) : isError ? (
        <p className="mx-1 mt-1 rounded-control border border-line px-2.5 py-2 text-[12px] leading-snug text-faint">
          Could not load products.
        </p>
      ) : products.length === 0 ? (
        <p className="mx-1 mt-1 rounded-control border border-dashed border-line px-2.5 py-2.5 text-[12px] leading-relaxed text-faint">
          No products yet — create one to get started
        </p>
      ) : (
        <ul className="mt-1 space-y-0.5">
          {products.map((product) => {
            const active = product.id === activeId;
            return (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => selectProduct(product.id)}
                  aria-current={active ? "true" : undefined}
                  className={`group relative flex w-full items-center gap-2.5 rounded-control py-2 pl-2.5 pr-2 text-left text-[13.5px] transition-colors duration-150 ${
                    active
                      ? "bg-white/[0.07] font-medium text-fg"
                      : "text-muted hover:bg-white/[0.04] hover:text-fg"
                  }`}
                >
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute inset-y-1.5 left-0 w-[2px] rounded-pill bg-mint"
                    />
                  ) : null}
                  <span
                    aria-hidden
                    className={`flex size-6 shrink-0 items-center justify-center rounded-[6px] text-[10px] font-semibold uppercase tracking-[0.02em] ${
                      active ? "bg-mint text-ink" : "bg-white/[0.06] text-faint group-hover:text-muted"
                    }`}
                  >
                    {initialsFor(product.name)}
                  </span>
                  <span className="truncate">{product.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { data: workspace, isPending } = useWorkspace();
  const hydrated = useHydrated();
  // Until hydration finishes the server rendered the pending state, so keep
  // showing it even if the client cache already holds a workspace.
  const pending = !hydrated || isPending;
  const workspaceName = workspace?.name ?? null;
  const session = useSession();
  const sessionEmail = session.status === "authenticated" ? session.session.email : null;
  // Session has no name field — fall back to the email address.
  const sessionName = sessionEmail ?? null;
  const sessionInitials = sessionEmail ? sessionEmail.slice(0, 2).toUpperCase() : null;
  // Workspace API exposes no member role yet — hardcode the owner role for now.
  const sessionRole = "Workspace owner";

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-4">
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
          <span className="ml-auto rounded-pill border border-line px-2 py-0.5 text-[11px] font-medium text-faint">
            App
          </span>
        ) : null}
      </div>

      {!collapsed ? (
        <div className="px-3 pb-1">
          <div className="flex items-center gap-2.5 rounded-control bg-white/[0.04] px-2.5 py-2">
            <span
              aria-hidden
              className="flex size-8 shrink-0 items-center justify-center rounded-[7px] bg-gradient-to-br from-mint to-accent text-[11px] font-semibold text-ink"
            >
              {pending ? "…" : workspaceName ? initialsFor(workspaceName) : "—"}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-medium text-fg">
                {pending ? (
                  <span aria-hidden className="inline-block h-3 w-24 animate-pulse rounded bg-line" />
                ) : (
                  workspaceName ?? "No workspace"
                )}
              </span>
              <span className="block text-[12px] leading-tight text-faint">Workspace</span>
            </span>
          </div>
        </div>
      ) : null}

      {!collapsed ? (
        <Suspense fallback={<ProductSwitcherFallback />}>
          <ProductSwitcher onNavigate={onNavigate} />
        </Suspense>
      ) : null}

      <nav aria-label="Dashboard" className="dashboard-scroll flex-1 overflow-y-auto px-3 pb-4 pt-2">
        {GROUPS.map((group) => (
          <div key={group.title} className={collapsed ? "mt-5 first:mt-0" : "mt-5 first:mt-1"}>
            {!collapsed ? (
              <h2 className="px-2.5 pb-1.5 text-[12px] font-medium text-faint">
                {group.title}
              </h2>
            ) : (
              <span aria-hidden className="mx-2 mb-3 block h-px bg-line" />
            )}
            <ul className={collapsed ? "space-y-1" : "space-y-0.5"}>
              {group.items.map((item) => {
                const active = !item.anchored && pathname === item.href;
                return (
                  <li key={`${group.title}-${item.href}`}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      title={collapsed ? item.label : undefined}
                      className={`group relative flex h-10 items-center gap-2.5 rounded-control text-[14px] transition-colors duration-150 ${
                        collapsed ? "justify-center px-0" : "px-2.5"
                      } ${
                        active
                          ? "bg-white/[0.07] font-medium text-fg"
                          : "text-muted hover:bg-white/[0.04] hover:text-fg"
                      }`}
                    >
                      {active ? (
                        <span aria-hidden className="absolute inset-y-2 left-0 w-[2px] rounded-pill bg-mint" />
                      ) : null}
                      {item.glyph}
                      {item.meta ? (
                        <span
                          className={`font-mono text-[10.5px] tracking-[0.02em] ${
                            active ? "text-mint" : "text-faint/70"
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

      <div className="border-t border-line p-3">
        {collapsed ? (
          <Link
            href="/"
            aria-label="Back to site"
            className="mx-auto flex size-8 items-center justify-center rounded-control border border-line-2 text-[13px] text-faint transition-colors hover:border-accent hover:text-accent"
          >
            ↗
          </Link>
        ) : (
          <div className="flex items-center gap-2.5 rounded-control px-1 py-1">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mint-tint text-[11px] font-semibold uppercase text-accent">
              {session.status === "loading" ? "" : (sessionInitials ?? "—")}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-fg">
                {session.status === "loading" ? (
                  <span aria-hidden className="inline-block h-3 w-28 animate-pulse rounded bg-line" />
                ) : (
                  (sessionName ?? "")
                )}
              </p>
              <p className="truncate text-[11.5px] capitalize leading-tight text-faint">
                {session.status === "loading" ? "" : sessionName ? sessionRole : ""}
              </p>
            </div>
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
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Jump to"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
            className="relative w-full max-w-[600px] overflow-hidden rounded-card border border-line bg-panel shadow-[var(--elevation-overlay)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                aria-hidden
                className="shrink-0 fill-none stroke-faint stroke-[1.6]"
              >
                <circle cx="7" cy="7" r="4.5" />
                <path d="m10.5 10.5 4 4" strokeLinecap="round" />
              </svg>
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
                className="shrink-0 rounded-[5px] border border-line px-1.5 py-0.5 font-mono text-[10.5px] text-faint transition-colors hover:border-accent hover:text-accent"
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
                    className="flex items-baseline justify-between gap-4 px-5 py-2.5 text-[13.5px] text-fg transition-colors hover:bg-mint-tint/30"
                  >
                    <span>{item.label}</span>
                    <span className="text-[12px] text-faint">
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
  const session = useSession();
  const sessionEmail = session.status === "authenticated" ? session.session.email : null;
  // Session has no name field — fall back to the email address.
  const sessionInitials = sessionEmail ? sessionEmail.slice(0, 2).toUpperCase() : null;

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
        className="flex size-9 items-center justify-center rounded-pill border border-line bg-panel text-[11px] font-semibold uppercase text-fg transition-colors hover:border-accent hover:text-accent"
      >
        {session.status === "loading" ? "" : (sessionInitials ?? "—")}
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
            className="absolute right-0 top-11 z-40 w-60 overflow-hidden rounded-card border border-line bg-panel shadow-[var(--elevation-popover)]"
          >
            <div className="border-b border-line px-4 py-3">
              <p className="text-[12.5px] text-fg">
                {session.status === "loading" ? (
                  <span aria-hidden className="inline-block h-3 w-32 animate-pulse bg-line" />
                ) : (
                  (sessionEmail ?? "")
                )}
              </p>
              <p className="mt-0.5 text-[12px] text-faint">
                {session.status === "loading"
                  ? ""
                  : session.status === "authenticated"
                    ? "Signed in"
                    : "Not signed in"}
              </p>
            </div>
            {[
              { label: "Documentation", href: "/docs" },
              { label: "Back to site", href: "/" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-[12.5px] text-muted transition-colors hover:bg-mint-tint/40 hover:text-fg"
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
        className={`on-ink sticky top-0 hidden h-screen shrink-0 overflow-hidden border-r border-line bg-bg text-fg transition-[width] duration-300 ease-out lg:block ${
          collapsed ? "w-[5rem]" : "w-[16.5rem]"
        }`}
      >
        <SidebarContent collapsed={collapsed} />
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="absolute bottom-20 left-1/2 hidden size-7 -translate-x-1/2 items-center justify-center rounded-control border border-line bg-bg/80 text-[11px] text-faint transition-colors hover:border-accent hover:text-accent lg:flex"
        >
          {collapsed ? "»" : "«"}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line/80 bg-bg/90 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Open dashboard navigation"
              aria-expanded={drawer}
              className="flex size-9 items-center justify-center border border-line-2 bg-panel text-fg transition-colors hover:border-accent hover:text-accent lg:hidden"
            >
              <span aria-hidden className="font-mono text-[12px] leading-none">
                ≡
              </span>
            </button>

            <nav aria-label="Breadcrumb" className="min-w-0">
              <ol className="flex items-center gap-1.5 text-[13px]">
                <li className="hidden text-faint sm:block">Workspace</li>
                <li aria-hidden className="hidden text-faint/60 sm:block">
                  ›
                </li>
                <li className="truncate font-medium text-fg">{title}</li>
              </ol>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCommand(true)}
                className="hidden h-9 min-w-[13.5rem] items-center gap-2.5 rounded-control border border-line bg-panel px-3 text-left transition-colors hover:border-line-2 md:flex"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  aria-hidden
                  className="fill-none stroke-faint stroke-[1.5]"
                >
                  <circle cx="7" cy="7" r="4.5" />
                  <path d="m10.5 10.5 4 4" strokeLinecap="round" />
                </svg>
                <span className="text-[13px] text-faint">
                  Search workspace
                </span>
                <kbd className="ml-auto rounded-[5px] border border-line bg-surface-sunken/60 px-1.5 py-0.5 font-mono text-[10.5px] text-faint">⌘K</kbd>
              </button>

              <span aria-hidden className="mx-0.5 hidden h-6 w-px bg-line sm:block" />

              <LogoutButton />

              <AccountMenu />
            </div>
          </div>
        </header>

        <main id="content" className="dashboard-canvas min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
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
              className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            />
            <motion.div
              aria-label="Dashboard navigation"
              className="on-ink absolute inset-y-0 left-0 w-[18rem] border-r border-line bg-bg text-fg shadow-[var(--elevation-overlay)]"
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
