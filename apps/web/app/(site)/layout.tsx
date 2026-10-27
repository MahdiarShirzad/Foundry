import type { ReactNode } from "react";
import Nav from "@/components/site/nav";
import Footer from "@/components/site/footer";

/** Shared chrome for every Foundry route: sticky header, the hairline page
 *  frame, and the footer — so the landing page, docs, and future pages all
 *  reuse one navigation system. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <div className="mx-auto w-full max-w-[1240px] border-x border-line">
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}