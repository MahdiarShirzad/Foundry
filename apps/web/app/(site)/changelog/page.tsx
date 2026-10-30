import type { Metadata } from "next";
import Link from "next/link";

import Eyebrow from "@/components/site/eyebrow";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Release notes for Foundry — what shipped in each version of the eight-module product-building platform, and anything worth knowing before you upgrade.",
};

type Release = {
  version: string;
  date: string;
  status: "current" | "planned";
  title: string;
  summary: string;
  changes: { type: "added" | "changed" | "fixed" | "removed"; text: string }[];
  note?: string;
};

const RELEASES: Release[] = [
  {
    version: "0.1.0",
    date: "2026-10-30",
    status: "current",
    title: "Initial scaffold",
    summary:
      "First public shape of Foundry: the marketing site, documentation, API reference, and the scaffold for Guides, Examples, Playground, and Changelog.",
    changes: [
      { type: "added", text: "Next.js 16 web app with App Router and shared site chrome (header, frame, footer)." },
      { type: "added", text: "Documentation system — Introduction, Quick Start, Project Structure, Eight Stages, Workflow, Architecture, Web Routes, Backend API." },
      { type: "added", text: "NestJS 12 API scaffold — single `GET /` endpoint returning `Hello World!`." },
      { type: "added", text: "Scaffold pages: Guides, Examples, Playground, Changelog." },
      { type: "added", text: "Auth screens scaffold — sign in, register, forgot password, reset password, verify email." },
    ],
    note: "The repository is at 0.1.0 with no tagged releases yet. Everything below this line is planned work, not shipped code.",
  },
  {
    version: "0.2.0",
    date: "Coming soon",
    status: "planned",
    title: "Auth & workspaces",
    summary: "Authentication, user accounts, and workspace containers that the domain modules write into.",
    changes: [
      { type: "added", text: "Auth module — accounts, sessions, and access control." },
      { type: "added", text: "Workspaces module — startup workspaces and collaboration boundaries." },
      { type: "added", text: "Login, register, and password-reset flows backed by the API." },
    ],
  },
  {
    version: "0.3.0",
    date: "Coming soon",
    status: "planned",
    title: "Idea Lab & Market Intelligence",
    summary: "The first two startup modules: capture ideas and research the market.",
    changes: [
      { type: "added", text: "Idea Lab — idea capture, problem definition, and assumption tracking." },
      { type: "added", text: "Market Intelligence — segments, competitors, and opportunity mapping." },
    ],
  },
  {
    version: "0.4.0",
    date: "Coming soon",
    status: "planned",
    title: "Validation Lab & MVP Studio",
    summary: "Test assumptions and scope a minimal product.",
    changes: [
      { type: "added", text: "Validation Lab — hypotheses, experiments, and go / pivot / stop decisions." },
      { type: "added", text: "MVP Studio — MVP scope, must-have separation, and evidence-linked requirements." },
    ],
  },
  {
    version: "0.5.0",
    date: "Coming soon",
    status: "planned",
    title: "Roadmap, Launch, Feedback, Analytics",
    summary: "The remaining four stages close the loop back to Idea Lab.",
    changes: [
      { type: "added", text: "Product Roadmap — milestones, prioritization, and phased releases." },
      { type: "added", text: "Launch Center — launch objectives, tasks, positioning, and post-launch tracking." },
      { type: "added", text: "Feedback Hub — user feedback collection and categorization." },
      { type: "added", text: "Founder Analytics — metrics, objective tracking, and iteration insights." },
    ],
  },
];

function StatusBadge({ status }: { status: Release["status"] }) {
  return (
    <span className="inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
      {status === "current"
        ? (
          <>
            <span className="mr-1.5 size-1.5 rounded-full bg-mint" aria-hidden />
            <span className="text-accent">Current</span>
          </>
        ) : (
          <>
            <span className="mr-1.5 size-1.5 rounded-full border border-line bg-panel" aria-hidden />
            <span className="text-faint">Planned</span>
          </>
        )}
    </span>
  );
}

function ChangeTag({ type }: { type: Release["changes"][number]["type"] }) {
  const map: Record<string, { label: string; color: string }> = {
    added: { label: "Added", color: "text-accent" },
    changed: { label: "Changed", color: "text-fg" },
    fixed: { label: "Fixed", color: "text-fg" },
    removed: { label: "Removed", color: "text-faint" },
  };
  const m = map[type];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] ${m.color}`}>
      {m.label}
    </span>
  );
}

export default function ChangelogPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-28 pt-40 sm:px-10 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--line),transparent)]"
        />

        <div className="mx-auto max-w-3xl">
          <Eyebrow>Sec. C — Changelog</Eyebrow>

          <h1 className="mt-7 text-[clamp(2rem,4.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-fg">
            Changelog
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Release notes for Foundry — what shipped in each version of the
            eight-module platform, what changed across the modules, and anything
            worth knowing before you upgrade. The repository is at 0.1.0 with no
            tagged releases yet; notes appear here as versions land.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/docs"
              className="inline-flex h-11 items-center gap-2 bg-mint px-6 text-[15px] font-medium text-ink transition duration-200 hover:-translate-y-0.5 hover:brightness-95"
            >
              Read the documentation
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/api-reference"
              className="inline-flex h-11 items-center border border-line-2 px-6 text-[15px] text-fg transition-colors hover:border-accent hover:bg-mint-tint hover:text-accent"
            >
              API reference
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-4xl">
          {RELEASES.map((release) => (
            <article
              key={release.version}
              className="scroll-mt-24 border-b border-line pb-12 last:border-b-0 last:pb-0"
            >
              <div className="flex items-baseline justify-between gap-4 mb-3">
                <div>
                  <h2
                    id={`v${release.version.replace(/\./g, "-")}`}
                    className="text-[clamp(1.5rem,3vw,2rem)] font-medium tracking-tight text-fg"
                  >
                    v{release.version}
                  </h2>
                  <StatusBadge status={release.status} />
                </div>
                <time
                  dateTime={release.date}
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-faint"
                >
                  {release.date}
                </time>
              </div>

              <h3 className="mt-2 text-lg font-medium tracking-tight text-accent">
                {release.title}
              </h3>

              <p className="mt-4 text-[14.5px] leading-relaxed text-muted">
                {release.summary}
              </p>

              <div className="mt-6 space-y-3">
                {release.changes.map((change, i) => (
                  <div key={i} className="flex gap-3">
                    <ChangeTag type={change.type} />
                    <p className="text-[14px] leading-relaxed text-muted">
                      {change.text}
                    </p>
                  </div>
                ))}
              </div>

              {release.note && (
                <div className="mt-8 rounded-xl border border-line bg-ink p-6 text-[#e9f5f2]">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#7f9a94] mb-2">
                    Note
                  </p>
                  <p className="font-mono text-[13px] leading-relaxed">{release.note}</p>
                </div>
              )}
            </article>
          ))}

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
            <Link
              href="/docs/backend-api"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              Backend API guide →
            </Link>
            <Link
              href="/docs/web-routes"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
            >
              Web routes
            </Link>
            <Link
              href="/examples"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
            >
              Examples
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
