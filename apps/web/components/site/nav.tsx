"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Primary destinations — pages that exist (or are scaffolded) as real routes. */
const PRIMARY: { label: string; href: string; match: (path: string) => boolean }[] = [
  { label: "Documentation", href: "/docs", match: (p) => p === "/docs" || p.startsWith("/docs/") },
  { label: "API Reference", href: "/api-reference", match: (p) => p === "/api-reference" },
  { label: "Changelog", href: "/changelog", match: (p) => p === "/changelog" },
  { label: "About", href: "/about", match: (p) => p === "/about" },
];

/** Mobile menu groups: pages plus landing-page section jumps. */
const MOBILE_GROUPS: { title: string; items: { label: string; href: string }[] }[] = [
  {
    title: "Pages",
    items: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api-reference" },
      { label: "Changelog", href: "/changelog" },
      { label: "About", href: "/about" },
      { label: "Landing page", href: "/" },
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

export default function Nav() {
  const pathname = usePathname();
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

  // Drawer focus + scroll lock; Esc closes and returns focus to the trigger.
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

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-bg transition-colors duration-300 ${
        scrolled || menuOpen ? "border-line" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-6 border-x border-line px-6 sm:px-10">
        <Link href="/#top" className="flex shrink-0 items-center" aria-label="Foundry — home">
          <Image
            src="/logo.png"
            alt="Foundry"
            width={932}
            height={297}
            priority
            className="h-7 w-auto self-start sm:h-8"
          />
        </Link>

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

        <div className="flex items-center gap-3">
          <Link
            href="/#stages"
            className="hidden h-9 items-center border border-line-2 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-fg transition-colors hover:border-accent hover:text-accent sm:inline-flex"
          >
            Explore<span className="hidden lg:inline">&nbsp;the ecosystem</span>
          </Link>

          <button
            ref={menuBtnRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center border border-line-2 text-fg transition-colors hover:border-accent hover:text-accent lg:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="stroke-current stroke-[1.5]">
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
                {MOBILE_GROUPS.map((group) => (
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

                <Link
                  href="/#stages"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-12 items-center justify-center bg-mint px-6 text-[15px] font-medium text-ink transition duration-200 hover:brightness-95"
                >
                  Explore the eight stages
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}