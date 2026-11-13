"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useSession } from "@/lib/auth/use-session";
import { authClient } from "@/lib/auth/client";
import type { Session } from "@/lib/auth/contract";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const OUTLINE_BTN =
  "inline-flex h-9 items-center border border-line-2 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-fg transition-colors hover:border-accent hover:text-accent";
const SOLID_BTN =
  "inline-flex h-9 items-center bg-mint px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition duration-200 hover:brightness-95";

const PRIMARY: {
  label: string;
  href: string;
  match: (path: string) => boolean;
}[] = [
  {
    label: "Documentation",
    href: "/docs",
    match: (p) => p === "/docs" || p.startsWith("/docs/"),
  },
  {
    label: "API Reference",
    href: "/api-reference",
    match: (p) => p === "/api-reference",
  },
  { label: "Changelog", href: "/changelog", match: (p) => p === "/changelog" },
  { label: "About", href: "/about", match: (p) => p === "/about" },
];

const DASHBOARD_LINKS = [
  { label: "Overview", href: "/dashboard" },
  { label: "Idea Lab", href: "/dashboard/idea-lab" },
  { label: "MVP Studio", href: "/dashboard/mvp-studio" },
  { label: "Product Roadmap", href: "/dashboard/product-roadmap" },
  { label: "Analytics", href: "/dashboard/founder-analytics" },
];

const MOBILE_GROUPS_GUEST = [
  {
    title: "Pages",
    items: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/register" },
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api-reference" },
      { label: "Changelog", href: "/changelog" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Landing sections",
    items: [
      { label: "The problem", href: "/#problem" },
      { label: "Eight stages", href: "/#stages" },
      { label: "Workflow", href: "/#workflow" },
      { label: "Architecture", href: "/#architecture" },
    ],
  },
];

const MOBILE_GROUPS_AUTH = [
  {
    title: "Dashboard",
    items: DASHBOARD_LINKS,
  },
  {
    title: "Pages",
    items: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api-reference" },
      { label: "Changelog", href: "/changelog" },
      { label: "About", href: "/about" },
    ],
  },
];

function truncateEmail(email: string | undefined, max = 22): string {
  if (!email) return "Account";
  if (email.length <= max) return email;
  return email.slice(0, max) + "…";
}

// ─── Desktop auth dropdown ────────────────────────────────────────────────────

type DesktopActionsProps = {
  session: ReturnType<typeof useSession>;
  pathname: string;
  onSignOut: () => void;
};

function DesktopActions({ session, pathname, onSignOut }: DesktopActionsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (session.status === "loading") {
    return (
      <div
        aria-hidden
        className="pointer-events-none flex items-center gap-3 opacity-0"
      >
        <span className={OUTLINE_BTN}>The ecosystem</span>
        <span className={SOLID_BTN}>Sign in</span>
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    return (
      <div className="flex items-center gap-3">
        <Link href="/#stages" className={OUTLINE_BTN}>
          The ecosystem
        </Link>
        <Link href="/login" className={SOLID_BTN}>
          Sign in
        </Link>
      </div>
    );
  }

  // authenticated
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={OUTLINE_BTN}
      >
        {truncateEmail(session.session.email)}
        <span
          aria-hidden
          className="ml-2 inline-block font-mono text-[9px] text-faint transition-transform duration-150"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.15, ease: EASE }}
            className="absolute right-0 top-full z-50 mt-2 w-52 border border-line bg-bg shadow-lg"
          >
            {/* email header */}
            <div className="border-b border-line px-4 py-2.5">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-faint">
                Signed in as
              </p>
              <p className="mt-0.5 truncate text-[12px] text-fg">
                {session.session.email}
              </p>
            </div>

            {/* links */}
            <ul className="py-1">
              {DASHBOARD_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-2 text-[12.5px] transition-colors hover:bg-accent/10 hover:text-accent ${
                      pathname === link.href ? "text-accent" : "text-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* sign out */}
            <div className="border-t border-line py-1">
              <button
                onClick={() => {
                  setOpen(false);
                  onSignOut();
                }}
                className="block w-full px-4 py-2 text-left text-[12.5px] text-danger transition-colors hover:bg-danger/10"
              >
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

export default function Nav({
  initialSession,
}: {
  initialSession?: Session | null;
} = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession(initialSession);
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  useEffect(() => {
    if (!menuOpen) return;
    closeBtnRef.current?.focus();
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const mobileGroups =
    session.status === "authenticated"
      ? MOBILE_GROUPS_AUTH
      : MOBILE_GROUPS_GUEST;

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-bg transition-colors duration-300 ${
        scrolled || menuOpen ? "border-line" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-6 border-x border-line px-6 sm:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Foundry — home"
        >
          <Image
            src="/logo.png"
            alt="Foundry"
            width={932}
            height={297}
            priority
            className="h-7 w-auto self-start sm:h-8"
          />
        </Link>

        {/* Primary nav */}
        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {PRIMARY.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-accent after:transition-transform after:duration-200 after:content-[''] ${
                  active
                    ? "text-accent after:scale-x-100"
                    : "text-faint after:scale-x-0 hover:text-fg"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex">
            <DesktopActions
              session={session}
              pathname={pathname}
              onSignOut={handleSignOut}
            />
          </div>

          {/* Mobile hamburger */}
          <button
            ref={menuBtnRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center border border-line-2 text-fg transition-colors hover:border-accent hover:text-accent lg:hidden"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              aria-hidden
              className="stroke-current stroke-[1.5]"
            >
              <path d="M2 4.5h12M2 8h12M2 11.5h12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
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
              onClick={() => setMenuOpen(false)}
              aria-hidden
            />
            <motion.aside
              id="site-menu"
              className="fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-[340px] flex-col overflow-y-auto border-l border-line bg-bg lg:hidden"
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <Image
                  src="/logo.png"
                  alt="Foundry"
                  width={932}
                  height={297}
                  className="h-6 w-auto self-start"
                />
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    menuBtnRef.current?.focus();
                  }}
                  aria-label="Close menu"
                  className="flex h-8 w-8 items-center justify-center border border-line text-faint transition-colors hover:border-accent hover:text-accent"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-8 px-5 py-7">
                {/* email badge when authenticated */}
                {session.status === "authenticated" && (
                  <div className="border border-line px-4 py-2.5">
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-faint">
                      Signed in as
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-fg">
                      {session.session.email}
                    </p>
                  </div>
                )}

                {mobileGroups.map((group) => (
                  <nav key={group.title} aria-label={group.title}>
                    <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-faint">
                      {group.title}
                    </h2>
                    <ul className="mt-3 border-l border-line">
                      {group.items.map((item) => {
                        const active =
                          item.href === pathname ||
                          (item.href !== "/" &&
                            !item.href.startsWith("/#") &&
                            pathname.startsWith(item.href));
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setMenuOpen(false)}
                              aria-current={active ? "page" : undefined}
                              className={`relative -ml-px block border-l py-2 pl-4 text-[15px] transition-colors ${
                                active
                                  ? "border-accent font-medium text-accent"
                                  : "border-transparent text-muted hover:border-line-2 hover:text-fg"
                              }`}
                            >
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                ))}

                {session.status === "authenticated" ? (
                  <button
                    onClick={async () => {
                      setMenuOpen(false);
                      await handleSignOut();
                    }}
                    className="inline-flex h-12 items-center justify-center border border-danger px-6 text-[15px] font-medium text-danger transition duration-200 hover:bg-danger/10"
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex h-12 items-center justify-center bg-mint px-6 text-[15px] font-medium text-ink transition duration-200 hover:brightness-95"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
