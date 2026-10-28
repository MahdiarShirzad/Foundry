import type { Metadata } from "next";
import Link from "next/link";

import Eyebrow from "@/components/site/eyebrow";

export const metadata: Metadata = {
  title: "API Reference",
  description:
    "Reference for the Foundry REST API in apps/api: the single endpoint it exposes today, its runtime configuration, and the domain modules the README plans behind it.",
};

type Row = [string, string, string];

const ENDPOINTS: Row[] = [
  ["GET", "/", "text/plain — Hello World!"],
];

const CONFIG: Row[] = [
  ["PORT", "3000", "HTTP port the Nest server listens on (main.ts)"],
  ["OBSERVE_APP_KEY", "YOUR_APP_KEY", "NestJS Observe telemetry key (app.module.ts)"],
  ["OBSERVE_APP_SECRET", "YOUR_APP_SECRET", "NestJS Observe telemetry secret"],
  ["serviceId", "api", "Service name reported to Observe — set in code, not env"],
];

const SCRIPTS: Row[] = [
  ["pnpm start:dev", "nest start --watch", "Watch-mode development server"],
  ["pnpm build", "nest build", "Compile to dist/"],
  ["pnpm start:prod", "node dist/main", "Run the compiled server"],
  ["pnpm test", "jest", "Unit tests (src/*.spec.ts)"],
  ["pnpm lint", "oxlint --type-aware", "Type-aware linting"],
];

const ROADMAP = [
  "Auth & users — accounts and sessions",
  "Workspaces & products — the containers modules write into",
  "The eight startup modules — Idea Lab through Founder Analytics",
  "Notifications & files — shared infrastructure for every module",
];

function Table({ head, rows }: { head: string[]; rows: Row[] }) {
  return (
    <div className="mt-6 overflow-x-auto border border-line">
      <table className="w-full min-w-[520px] border-collapse text-left">
        <thead>
          <tr className="bg-panel">
            {head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="border-b border-line px-4 py-2.5 font-mono text-[10.5px] font-normal uppercase tracking-[0.18em] text-faint"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={`border-b border-line px-4 py-3 align-top text-[14px] ${
                    i === 0 ? "whitespace-nowrap font-mono text-accent" : "text-muted"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ApiReferencePage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-16 pt-40 sm:px-10 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--line),transparent)]"
        />

        <div className="mx-auto max-w-4xl">
          <Eyebrow>Sec. B — API Reference</Eyebrow>

          <h1 className="mt-7 text-[clamp(2rem,4.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-fg">
            The Foundry REST API.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            A NestJS application in <code className="bg-mint-tint px-1.5 py-0.5 font-mono text-[0.85em] text-accent">apps/api</code>.
            This page documents the surface exactly as it is implemented today — one health-style
            root endpoint and the environment it reads. Endpoints are added here only once the code
            behind them exists.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/docs/backend-api"
              className="inline-flex h-11 items-center gap-2 bg-mint px-6 text-[15px] font-medium text-ink transition duration-200 hover:-translate-y-0.5 hover:brightness-95"
            >
              Backend guide
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/docs/architecture"
              className="inline-flex h-11 items-center border border-line-2 px-6 text-[15px] text-fg transition-colors hover:border-accent hover:text-accent"
            >
              Planned architecture
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            Base URL
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            The server binds to <code className="bg-mint-tint px-1.5 py-0.5 font-mono text-[0.85em] text-accent">process.env.PORT</code>,
            defaulting to <code className="bg-mint-tint px-1.5 py-0.5 font-mono text-[0.85em] text-accent">3000</code>.
            Routes are mounted at the root — no global prefix is configured — and both apps default
            to port 3000, so run the API somewhere else while the web app is up.
          </p>

          <pre className="mt-6 overflow-x-auto border border-line bg-ink px-5 py-4 font-mono text-[13px] leading-relaxed text-[#e9f5f2]">
            <code>
              <span className="text-[#7f9a94]"># apps/api — watch mode on port 3001</span>
              {"\n"}
              PORT=3001 pnpm start:dev
              {"\n\n"}
              <span className="text-[#7f9a94]"># base URL</span>
              {"\n"}
              http://localhost:3001
            </code>
          </pre>
        </div>
      </section>

      <section className="border-t border-line px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            Endpoints
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            Every endpoint currently implemented, generated from{" "}
            <code className="bg-mint-tint px-1.5 py-0.5 font-mono text-[0.85em] text-accent">AppController</code> in{" "}
            <code className="bg-mint-tint px-1.5 py-0.5 font-mono text-[0.85em] text-accent">apps/api/src</code>.
          </p>

          <Table head={["Method", "Path", "Returns"]} rows={ENDPOINTS} />

          <div className="mt-8 grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-2">
            <div className="bg-ink p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#7f9a94]">
                Request
              </p>
              <pre className="mt-3 overflow-x-auto font-mono text-[12.5px] leading-relaxed text-[#e9f5f2]">
                <code>curl http://localhost:3001/</code>
              </pre>
            </div>
            <div className="bg-panel p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-faint">
                Response · 200
              </p>
              <pre className="mt-3 overflow-x-auto font-mono text-[12.5px] leading-relaxed text-fg">
                <code>Hello World!</code>
              </pre>
              <p className="mt-3 font-mono text-[11px] text-faint">
                content-type: text/html; charset=utf-8
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-2xl border-l-2 border-accent bg-mint-tint px-5 py-4 text-[14px] leading-relaxed text-muted">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
              No auth yet ·{" "}
            </span>
            no guards, CORS policy, validation pipe or throttling are configured in the bootstrap, so
            every request is anonymous. Treat this API as local-only until the auth module lands.
          </p>
        </div>
      </section>

      <section className="border-t border-line px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            Configuration
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            Read directly from the environment at boot. The Observe keys carry placeholder defaults —
            replace them or telemetry reports under the scaffold credentials.
          </p>
          <Table head={["Variable", "Default", "Purpose"]} rows={CONFIG} />
        </div>
      </section>

      <section className="border-t border-line px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">Scripts</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            Run from <code className="bg-mint-tint px-1.5 py-0.5 font-mono text-[0.85em] text-accent">apps/api</code>.
          </p>
          <Table head={["Command", "Runs", "Purpose"]} rows={SCRIPTS} />
        </div>
      </section>

      <section className="border-t border-line px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            What will land here
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            The README defines the domain modules the API is meant to grow into. They are not
            implemented in this repository, so no paths or payloads for them are documented here —
            only the order they are planned in.
          </p>

          <ol className="mt-7 space-y-3 border-l border-line">
            {ROADMAP.map((item, i) => (
              <li key={item} className="relative pl-6 text-[14.5px] leading-relaxed">
                <span className="absolute -left-px top-1.5 h-px w-3 bg-accent" aria-hidden />
                <span className="mr-2 font-mono text-[11px] tracking-[0.18em] text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-muted">{item}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
            <Link
              href="/docs/backend-api"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              Backend API guide →
            </Link>
            <Link
              href="/changelog"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
            >
              Changelog
            </Link>
            <Link
              href="/docs/web-routes"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
            >
              Web routes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
