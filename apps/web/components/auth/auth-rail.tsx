import Image from "next/image";
import Link from "next/link";

import { STAGES } from "@/components/site/data";

/**
 * The brand half of every auth screen: the Foundry lockup, the eight-module
 * spine that the product runs on, and a way back to the site. It is deliberately
 * quiet — ink field, hairline rules, one accent current — so it frames the form
 * rather than competing with it.
 */
export default function AuthRail() {
  return (
    <aside className="on-ink relative hidden overflow-hidden border-r border-line bg-bg text-fg lg:flex lg:flex-col">
      <div
        aria-hidden
        className="blueprint pointer-events-none absolute inset-0 opacity-70"
        style={{
          maskImage: "radial-gradient(120% 70% at 20% 0%, rgb(0 0 0 / 0.9), transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(120% 70% at 20% 0%, rgb(0 0 0 / 0.9), transparent 72%)",
        }}
      />

      <div className="relative flex flex-1 flex-col px-9 py-9">
        <Link href="/" className="inline-flex w-fit items-center" aria-label="Foundry — home">
          <Image src="/logo.png" alt="Foundry" width={932} height={297} className="h-8 w-auto self-start" />
        </Link>

        <p className="mt-14 max-w-[19rem] text-[1.35rem] font-medium leading-[1.28] tracking-[-0.02em]">
          One idea. Eight stages.
          <br />
          <span className="text-accent">One ecosystem.</span>
        </p>
        <p className="mt-3 max-w-[18rem] text-[13.5px] leading-relaxed text-muted">
          Your account keeps the cycle intact — research, validation, launch and what you learned
          along the way.
        </p>

        <ol className="mt-10 border-l border-line">
          {STAGES.map((stage, i) => (
            <li key={stage.id} className="relative -ml-px border-l border-transparent py-[7px] pl-4">
              <span
                aria-hidden
                className={`absolute -left-px top-1/2 h-px w-2.5 -translate-y-1/2 ${
                  i === 0 || i === STAGES.length - 1 ? "bg-accent" : "bg-line-2"
                }`}
              />
              <span className="font-mono text-[10px] tracking-[0.18em] text-faint">{stage.id}</span>
              <span className="ml-2.5 text-[12.5px] text-muted">{stage.name}</span>
            </li>
          ))}
        </ol>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          <span>Foundry · 0.1.0</span>
          <Link href="/" className="transition-colors hover:text-accent">
            Back to site ↗
          </Link>
        </div>
      </div>
    </aside>
  );
}

/** Compact stand-in for the rail on small screens. */
export function AuthTopBar() {
  return (
    <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-bg px-5 lg:hidden">
      <Link href="/" aria-label="Foundry — home" className="inline-flex items-center">
        <Image src="/logo.png" alt="Foundry" width={932} height={297} className="h-6 w-auto self-start" />
      </Link>
      <Link
        href="/"
        className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-faint transition-colors hover:text-accent"
      >
        Back to site ↗
      </Link>
    </div>
  );
}
