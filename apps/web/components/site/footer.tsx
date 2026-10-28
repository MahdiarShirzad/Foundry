"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LinkItem = { label: string; href: string };

const GROUPS: { title: string; links: LinkItem[] }[] = [
  {
    title: "Product",
    links: [
      { label: "The problem", href: "/#problem" },
      { label: "Eight stages", href: "/#stages" },
      { label: "Workflow", href: "/#workflow" },
      { label: "Architecture", href: "/#architecture" },
    ],
  },
  {
    title: "Documentation",
    links: [
      { label: "Introduction", href: "/docs" },
      { label: "Quick Start", href: "/docs/quick-start" },
      { label: "The Eight Stages", href: "/docs/eight-stages" },
      { label: "Backend API", href: "/docs/backend-api" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "About", href: "/about" },
      { label: "API Reference", href: "/api-reference" },
      { label: "Guides", href: "/guides" },
      { label: "Examples", href: "/examples" },
      { label: "Playground", href: "/playground" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href.startsWith("/#")) return false;
  if (href === "/") return pathname === "/";
  if (href === "/docs") return pathname === "/docs" || pathname.startsWith("/docs/");
  return pathname === href;
}

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer>
      <div className="px-6 py-12 sm:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            {/* self-start: a flex-column parent would otherwise stretch the
                image and distort the lockup's aspect ratio. */}
            <Image
              src="/logo.png"
              alt="Foundry"
              width={932}
              height={297}
              className="h-9 w-auto self-start"
            />
            <p className="font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.18em] text-faint">
              From idea to launch. One connected ecosystem.
            </p>
          </div>

          {GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-faint">
                {group.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={`text-[14px] transition-colors ${
                          active
                            ? "font-medium text-accent"
                            : "text-muted hover:text-accent"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] tracking-[0.14em] text-faint">
            © 2026 Foundry
          </p>
          <Link
            href="/#top"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
          >
            Back to top ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}