import type { Metadata } from "next";
import Link from "next/link";

import Eyebrow from "@/components/site/eyebrow";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "Plain-language terms for using Foundry: an open, self-hosted product-building workspace that is still in development.",
};

export default function TermsPage() {
  return (
    <section className="px-6 py-20 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-[68ch]">
        <Eyebrow>Sec. L — Terms</Eyebrow>

        <h1 className="mt-7 text-[clamp(1.9rem,4vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.03em] text-fg">
          Terms of service
        </h1>
        <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.24em] text-faint">
          Version 0.1.0 · development preview
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-[1.75] text-muted">
          <p className="border-l-2 border-accent bg-mint-tint px-5 py-4 text-fg">
            Foundry is under active development. This page states, in plain language, the terms the
            project runs on today — it is not a lawyer-drafted agreement and no paid service is being
            offered.
          </p>

          <section>
            <h2 className="text-[1.05rem] font-medium tracking-[-0.01em] text-fg">What Foundry is</h2>
            <p className="mt-2">
              Foundry is an open product-building workspace: eight connected modules that carry an
              idea through market research, validation, an MVP, a roadmap, launch, feedback and
              analytics. The repository contains a Next.js front end and a NestJS API.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-medium tracking-[-0.01em] text-fg">Use it as it is</h2>
            <p className="mt-2">
              The software is provided without warranty of any kind. Features described as planned —
              including accounts and authentication — are not implemented yet, and interfaces may
              change without notice. Do not rely on the development preview to store work you cannot
              reproduce.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-medium tracking-[-0.01em] text-fg">Your account</h2>
            <p className="mt-2">
              Accounts are not yet stored anywhere: the API in this repository has no authentication
              module, so the sign-up and sign-in forms validate locally and send nothing. When
              accounts ship, you will be responsible for the credentials you set and for the content
              you put into your workspace.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-medium tracking-[-0.01em] text-fg">Acceptable use</h2>
            <p className="mt-2">
              Do not use Foundry to break the law, to attack the service or other people, or to store
              material you have no right to hold. Self-hosted deployments are operated by whoever
              runs them, not by this repository.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-medium tracking-[-0.01em] text-fg">Changes</h2>
            <p className="mt-2">
              These terms will be revised as the product gains accounts, billing and hosted
              deployments. The version above tracks the repository and is the only notice of change.
            </p>
          </section>

          <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.18em]">
            <Link href="/privacy" className="text-accent underline decoration-line underline-offset-4 hover:decoration-accent">
              Privacy policy
            </Link>
            <Link href="/docs" className="text-faint transition-colors hover:text-accent">
              Documentation
            </Link>
            <Link href="/login" className="text-faint transition-colors hover:text-accent">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
