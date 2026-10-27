"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const LINKS = [
  { label: "The problem", href: "#problem" },
  { label: "Eight stages", href: "#stages" },
  { label: "Workflow", href: "#workflow" },
  { label: "Architecture", href: "#architecture" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-bg transition-colors duration-300 ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-6 border-x border-line px-6 sm:px-10">
        <a href="#top" className="flex shrink-0 items-center" aria-label="Foundry — back to top">
          <Image
            src="/logo.png"
            alt="Foundry"
            width={932}
            height={297}
            priority
            className="h-7 w-auto sm:h-8"
          />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#stages"
          className="inline-flex h-9 shrink-0 items-center border border-line-2 px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-fg transition-colors hover:border-accent hover:text-accent sm:px-5"
        >
          Explore<span className="hidden sm:inline">&nbsp;the ecosystem</span>
        </a>
      </div>
    </header>
  );
}