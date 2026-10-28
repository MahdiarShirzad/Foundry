import type { Metadata } from "next";
import Link from "next/link";

import Eyebrow from "@/components/site/eyebrow";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Foundry stores today (nothing), what the authentication forms send, and what will change when accounts and the API ship.",
};

export default function PrivacyPage() {
  return (
    <section className="px-6 py-20 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-[68ch]">
        <Eyebrow>Sec. M — Privacy</Eyebrow>

        <h1 className="mt-7 text-[clamp(1.9rem,4vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.03em] text-fg">
          Privacy policy
        </h1>
        <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.24em] text-faint">
          Version 0.1.0 · development preview
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-[1.75] text-muted">
          <p className="border-l-2 border-accent bg-mint-tint px-5 py-4 text-fg">
            Short version: this build has no account backend, so the forms on this site send nothing
            and store nothing. Your email and password stay in the browser tab and disappear when you
            leave the page.
          </p>

          <section>
            <h2 className="text-[1.05rem] font-medium tracking-[-0.01em] text-fg">What is collected today</h2>
            <ul className="mt-3 space-y-2">
              <li className="flex gap-3">
                <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 bg-mint" />
                <span>
                  <span className="text-fg">Account forms.</span> Email and password are held in
                  component state only. There is no API to receive them: with no auth service
                  configured, submission stops in the browser.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 bg-mint" />
                <span>
                  <span className="text-fg">No cookies, no tracking.</span> No analytics, advertising
                  or session cookies are set. Nothing is written to localStorage or sessionStorage.
                </span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 bg-mint" />
                <span>
                  <span className="text-fg">Fonts.</span> Geist is self-hosted through the build, so
                  no font requests go to third parties at runtime.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-medium tracking-[-0.01em] text-fg">When accounts ship</h2>
            <p className="mt-2">
              The planned API stores your email, a salted password hash (never the password itself)
              and the workspace data you create. Sessions will be carried in an HTTP-only cookie
              rather than browser storage, so client scripts cannot read them. This page will be
              updated with the retention period and the controller for any hosted deployment before
              that flow is switched on.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-medium tracking-[-0.01em] text-fg">Passwords and recovery</h2>
            <p className="mt-2">
              Password recovery links will be single-use and time-limited, and the request page always
              answers the same way so it cannot be used to discover which addresses have accounts. No
              token is ever written to browser storage.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-medium tracking-[-0.01em] text-fg">Contact</h2>
            <p className="mt-2">
              This repository is the source of truth for the project. Questions about data handling
              belong with whoever operates the deployment you are using — for a self-hosted install,
              that is you.
            </p>
          </section>

          <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.18em]">
            <Link href="/terms" className="text-accent underline decoration-line underline-offset-4 hover:decoration-accent">
              Terms of service
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
