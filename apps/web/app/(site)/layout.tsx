import type { ReactNode } from "react";
import Nav from "@/components/site/nav";
import FooterShell from "@/components/site/footer-shell";

/** Shared chrome for every Foundry route: sticky header, the hairline page
 *  frame, and the footer — so the landing page, docs, and future pages all
 *  reuse one navigation system. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <div className="relative flex-1">
        {/* Page field: one atmosphere behind the framed content, so consecutive
         *  sections open onto the same light instead of each painting its own. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[880px] bg-[radial-gradient(115%_85%_at_50%_-18%,var(--mint-tint),transparent_66%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[680px] bg-[radial-gradient(85%_80%_at_12%_112%,var(--accent-tint),transparent_72%)]" />
        </div>
        {/* overflow-x-clip keeps decorative overlaps from creating a horizontal
         *  scrollbar without trapping the atmosphere vertically. */}
        <div className="relative mx-auto w-full max-w-[1240px] overflow-x-clip border-x border-line">
          <main>{children}</main>
          <FooterShell />
        </div>
      </div>
    </>
  );
}