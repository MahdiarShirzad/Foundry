"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarTree } from "@/lib/docs";

/** The documentation navigation tree. Used for the desktop rail and the
 *  mobile drawer; `onNavigate` lets the drawer close itself on selection. */
export default function SidebarNav({
  tree,
  onNavigate,
}: {
  tree: SidebarTree;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="flex flex-col gap-8">
      {tree.map((group) => (
        <div key={group.category}>
          <h2 className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-faint">
            {group.category}
          </h2>
          <ul className="mt-3 border-l border-line">
            {group.items.map((item) => {
              const active = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`relative -ml-px block border-l py-2 pl-4 text-[14px] leading-snug transition-colors ${
                      active
                        ? "border-accent font-medium text-accent"
                        : "border-transparent text-muted hover:border-line-2 hover:text-fg"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}