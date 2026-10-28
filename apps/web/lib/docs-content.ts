/** Documentation content. Every claim here is grounded in this repository:
 *  the README (product), the two app package.json files (scripts/versions),
 *  and the actual source in apps/api and apps/web. Nothing is invented. */

import { STAGES } from "@/components/site/data";
import type { Doc } from "@/lib/docs";

const stageTable = {
  type: "table" as const,
  head: ["Stage", "Verb", "Purpose"],
  rows: STAGES.map((s) => [`${s.id} · ${s.name}`, s.verb, s.tagline]),
};

export const DOCS: Doc[] = [
  /* ---------------------------------------------------------------- index */
  {
    slug: "index",
    title: "Introduction",
    category: "Getting Started",
    description:
      "What Foundry is, the problem it solves, and how this documentation is organized.",
    blocks: [
      {
        type: "p",
        text: "Foundry is a **startup builder ecosystem** — a single connected workflow for taking a raw idea all the way to a launched, evidence-backed product. Instead of stitching together disconnected tools, Foundry brings the eight stages of building a startup into one environment where **every stage informs the next**.",
      },
      {
        type: "p",
        text: "This documentation covers what the project is, how to run it locally, how it is structured, and what the backend currently exposes. It is written for two audiences: founders using the product, and developers working on the monorepo.",
      },
      { type: "h2", text: "What Foundry solves" },
      {
        type: "p",
        text: "Most tools solve one problem exceptionally well. Foundry targets a different problem: the **fragmentation between** the many problems a founder must solve. A startup isn't just an idea, a roadmap, or a launch campaign — it's a sequence of interconnected decisions made under uncertainty, and losing context between them is expensive.",
      },
      {
        type: "ul",
        items: [
          "Market research should influence validation.",
          "Validation should shape the MVP.",
          "The MVP should guide the roadmap.",
          "Launch feedback should drive product improvements.",
          "Analytics should help founders make better decisions.",
        ],
      },
      { type: "h2", text: "The ecosystem at a glance" },
      { type: "p", text: "Eight stages, one continuous cycle:" },
      stageTable,
      {
        type: "note",
        text: "The cycle is iterative, not linear. A failed experiment sends a founder back to the Idea Lab; analytics feed the next iteration.",
      },
      { type: "h2", text: "How this documentation is organized" },
      {
        type: "ul",
        items: [
          "**Getting Started** — introduction, local setup, and the repository layout.",
          "**Core Concepts** — the eight stages, the workflow, and the architecture.",
          "**Reference** — the routes served by the web app and the current state of the backend API.",
        ],
      },
      {
        type: "p",
        text: "New here? Start with the [Quick Start](/docs/quick-start) and run the web app in a couple of commands.",
      },
    ],
  },

  /* ----------------------------------------------------------- quick-start */
  {
    slug: "quick-start",
    title: "Quick Start",
    category: "Getting Started",
    description:
      "Install dependencies and run the Foundry web app and API locally with pnpm.",
    blocks: [
      {
        type: "p",
        text: "Foundry is a pnpm workspace monorepo. From a clean checkout you only need three commands to see the landing page and documentation running locally.",
      },
      { type: "h2", text: "Prerequisites" },
      {
        type: "ul",
        items: [
          "**Node.js** — 20 or newer (the web app types against Node 20; Next.js 16 requires 20.9+).",
          "**pnpm** — the workspace package manager, pinned to `pnpm@12.5.1` in `apps/web/package.json`.",
          "**Git** — for version control.",
          "**PostgreSQL** — only needed once you work on the API's persistence layer; nothing requires a database to run the current apps.",
        ],
      },
      { type: "h2", text: "Install dependencies" },
      {
        type: "p",
        text: "From the repository root, install the whole workspace:",
      },
      {
        type: "code",
        lang: "bash",
        code: "# from the repository root\npnpm install",
      },
      {
        type: "note",
        text: "pnpm installs both apps from the root lockfile — there is no need to install inside `apps/web` or `apps/api` separately.",
      },
      { type: "h2", text: "Run the web app" },
      {
        type: "p",
        text: "The marketing site and documentation live in `apps/web`:",
      },
      {
        type: "code",
        lang: "bash",
        code: "cd apps/web\npnpm dev",
        filename: "terminal",
      },
      {
        type: "p",
        text: "Open [http://localhost:3000](http://localhost:3000) — the landing page is served at `/` and the documentation at `/docs`.",
      },
      { type: "h2", text: "Run the API" },
      {
        type: "p",
        text: "The backend lives in `apps/api` (NestJS). It reads `PORT` from the environment and defaults to `3000`, which is the same port the web app uses — start it on a different port:",
      },
      {
        type: "code",
        lang: "bash",
        code: "cd apps/api\nPORT=3001 pnpm start:dev",
      },
      {
        type: "p",
        text: "The API answers `GET /` with `Hello World!` — see the [Backend API](/docs/backend-api) reference for the full current surface.",
      },
      { type: "h2", text: "Available scripts" },
      {
        type: "table",
        head: ["App", "Command", "What it does"],
        rows: [
          ["web", "pnpm dev", "Start the Next.js dev server"],
          ["web", "pnpm build", "Production build (runs type checking)"],
          ["web", "pnpm lint", "ESLint over the app"],
          ["api", "pnpm start:dev", "NestJS in watch mode"],
          ["api", "pnpm test", "Jest unit tests"],
          ["api", "pnpm lint", "oxlint with type-aware rules"],
          ["api", "pnpm format", "Prettier formatting"],
        ],
      },
      {
        type: "note",
        text: "The root `package.json` defines `dev`, `build`, and `lint` scripts that shell out to Turborepo, but Turborepo is not configured in this repository yet (there is no `turbo.json`). Use the per-app commands above.",
      },
      { type: "h2", text: "Verify your setup" },
      {
        type: "ol",
        items: [
          "`pnpm dev` in `apps/web` prints a ready URL with no errors.",
          "The landing page renders and `/docs` loads with the sidebar.",
          "`pnpm test` in `apps/api` passes its scaffold tests.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------- project-structure */
  {
    slug: "project-structure",
    title: "Project Structure",
    category: "Getting Started",
    description:
      "How the Foundry monorepo is laid out: pnpm workspaces, the Next.js web app, and the NestJS API.",
    blocks: [
      {
        type: "p",
        text: "Foundry is organized as a **pnpm workspace monorepo**: one repository, two applications, one lockfile. Each app owns its own `package.json`, scripts, and tooling while sharing the workspace install.",
      },
      { type: "h2", text: "Repository layout" },
      {
        type: "code",
        lang: "bash",
        filename: "tree",
        code: "foundry/\n├── apps/\n│   ├── web/                 # Next.js 16 · TypeScript · Tailwind CSS\n│   │   ├── app/             # App Router routes (landing, docs, future pages)\n│   │   ├── components/      # site/ (marketing) + docs/ (documentation UI)\n│   │   ├── lib/             # shared documentation data & helpers\n│   │   └── public/          # brand assets: logo.png, icon.png\n│   └── api/                 # NestJS 12 REST API\n│       └── src/             # controllers, services, modules\n├── package.json             # root scripts (dev/build/lint)\n├── pnpm-workspace.yaml      # workspace globs: apps/*\n├── pnpm-lock.yaml           # single lockfile for the whole workspace\n└── README.md                # product vision & architecture",
      },
      { type: "h2", text: "Workspace members" },
      {
        type: "table",
        head: ["Path", "Package", "Purpose"],
        rows: [
          ["apps/web", "web", "Next.js frontend — landing page and documentation"],
          ["apps/api", "api", "NestJS REST API"],
          [".", "foundry", "Root scripts and workspace configuration"],
        ],
      },
      { type: "h2", text: "Frontend conventions" },
      {
        type: "ul",
        items: [
          "**Routing** — App Router under `app/`; every public route sits inside the `(site)` route group, which provides the shared header and footer.",
          "**Styling** — Tailwind CSS v4 with design tokens declared in `app/globals.css` via `@theme inline` (`bg`, `panel`, `fg`, `muted`, `faint`, `line`, `accent`, `mint`). The `.on-ink` class flips the same tokens for dark bands.",
          "**Typography** — Geist Sans and Geist Mono loaded through `next/font`; mono is reserved for labels, metadata, and code.",
          "**Motion** — `motion` (Framer Motion) for entrances and interactions; every animated component checks `useReducedMotion` and CSS respects `prefers-reduced-motion`.",
          "**Components** — marketing sections in `components/site`, documentation UI in `components/docs`.",
        ],
      },
      { type: "h2", text: "Backend conventions" },
      {
        type: "ul",
        items: [
          "NestJS modular monolith: controllers and services grouped by domain, with domain boundaries kept explicit.",
          "REST endpoints documented through the API reference pages as they land.",
          "Jest for unit tests, oxlint (type-aware) for linting, Prettier for formatting.",
        ],
      },
      {
        type: "note",
        text: "The README describes the full target architecture — PostgreSQL, Prisma, and the eight domain modules. The API in this repository is currently at scaffold stage; see [Backend API](/docs/backend-api) for what actually exists today.",
      },
    ],
  },

  /* ------------------------------------------------------------ eight-stages */
  {
    slug: "eight-stages",
    title: "The Eight Stages",
    category: "Core Concepts",
    description:
      "Reference for every stage of the Foundry ecosystem: Idea Lab through Founder Analytics.",
    blocks: [
      {
        type: "p",
        text: "Foundry is built around eight connected stages. Each stage owns a clear responsibility and hands its evidence to the next. This page is the reference for all of them — the same content drives the interactive cycle on the landing page.",
      },
      ...STAGES.flatMap((stage): Doc["blocks"] => [
        { type: "h2", text: `${stage.id} · ${stage.name}` },
        { type: "p", text: `**${stage.verb}.** ${stage.tagline} ${stage.detail}` },
        { type: "ul", items: stage.bullets },
        {
          type: "p",
          text:
            stage.id === "08"
              ? "*Hands off to* **01 Idea Lab** — insights and iteration restart the cycle."
              : `*Hands off to* **${stage.next}**.`,
        },
      ]),
      { type: "h2", text: "Why the stages are connected" },
      {
        type: "p",
        text: "The value is not the individual screens — it is the continuity between them. Research produced in stage 02 becomes the evidence evaluated in stage 03; validated problems from stage 03 scope the MVP in stage 04. Foundry treats that chain as the product.",
      },
    ],
  },

  /* ---------------------------------------------------------------- workflow */
  {
    slug: "workflow",
    title: "The Workflow",
    category: "Core Concepts",
    description:
      "The iterative Foundry workflow: capture, investigate, validate, build, plan, launch, listen, learn.",
    blocks: [
      {
        type: "p",
        text: "The workflow is how the eight stages behave in practice. It is **iterative, not strictly linear** — evidence flows forward, and insights cycle back to the beginning.",
      },
      { type: "h2", text: "The eight steps" },
      {
        type: "ol",
        items: [
          "**Capture** — record an idea and define the problem it addresses.",
          "**Investigate** — research the market, audience, and competition.",
          "**Validate** — test assumptions and collect evidence.",
          "**Build** — define and develop a focused MVP.",
          "**Plan** — establish priorities, milestones, and the product roadmap.",
          "**Launch** — coordinate the product's market introduction.",
          "**Listen** — collect user feedback and identify recurring needs.",
          "**Learn** — analyze outcomes and feed insights into the next iteration.",
        ],
      },
      { type: "h2", text: "Evidence moves forward" },
      {
        type: "ul",
        items: [
          "Market research influences validation.",
          "Validation shapes the MVP scope.",
          "The MVP guides the roadmap.",
          "Launch feedback drives product improvements.",
          "Analytics support better decisions.",
        ],
      },
      { type: "h2", text: "Insights cycle back" },
      {
        type: "p",
        text: "The loop closes on purpose. A failed experiment may send a founder back to the Idea Lab. New feedback may change the roadmap. Analytics may reveal that a product needs a different audience or value proposition — and the cycle begins again with better evidence.",
      },
      {
        type: "note",
        text: "Foundry treats iteration as a fundamental part of building a startup, not as failure of the original plan.",
      },
      { type: "h2", text: "Seeing it in the product" },
      {
        type: "ul",
        items: [
          "The hero's cycle diagram links each node to its stage in the [Eight Stages](/docs/eight-stages) reference.",
          "The workflow section of the landing page draws the line as a closed loop with the feedback arc.",
          "Every expanded stage row shows where its output hands off next.",
        ],
      },
    ],
  },

  /* -------------------------------------------------------------- architecture */
  {
    slug: "architecture",
    title: "Architecture",
    category: "Core Concepts",
    description:
      "Foundry's modular-monolith architecture: a Next.js frontend, a NestJS API, and explicit domain boundaries.",
    blocks: [
      {
        type: "p",
        text: "Foundry follows a **modular monolith** approach: the frontend, the API, and each startup domain keep explicit boundaries while shipping as one cohesive system. The monorepo keeps both applications versioned together without merging their responsibilities.",
      },
      { type: "h2", text: "System overview" },
      {
        type: "code",
        lang: "text",
        filename: "diagram",
        code: "Founder / User\n      │\n      ▼\n┌──────────────────────┐\n│  apps/web            │  Next.js · TypeScript · Tailwind CSS\n└──────────┬───────────┘\n           │ REST\n           ▼\n┌──────────────────────┐\n│  apps/api            │  NestJS · controllers & services\n└──────────┬───────────┘\n           │\n   ┌───────┼────────┐\n   ▼       ▼        ▼\n Auth   Workspace   Startup domain modules\n Users  & Products  (Idea · Market · Validation · MVP\n                     Roadmap · Launch · Feedback · Analytics)\n           │\n           ▼\n   PostgreSQL · Prisma            (target persistence layer)",
      },
      { type: "h2", text: "Applications" },
      {
        type: "table",
        head: ["App", "Stack", "Responsibility"],
        rows: [
          ["apps/web", "Next.js 16 · TypeScript", "Landing page, documentation, future product UI"],
          ["apps/api", "NestJS 12 · REST", "Domain logic, auth, workspaces, product data"],
        ],
      },
      { type: "h2", text: "Backend domains" },
      {
        type: "p",
        text: "Beyond the eight product-facing modules, the README defines a shared foundation. Each domain is meant to own its own rules rather than becoming a pile of unrelated CRUD endpoints:",
      },
      {
        type: "table",
        head: ["Domain", "Responsibility"],
        rows: [
          ["Auth", "Authentication, sessions, and access control"],
          ["Users", "User profiles and account management"],
          ["Workspaces", "Startup workspaces and collaboration boundaries"],
          ["Products", "Product identity and cross-module relationships"],
          ["Idea Lab", "Idea capture and organization"],
          ["Market Intelligence", "Market and competitor research"],
          ["Validation Lab", "Hypotheses, experiments, and findings"],
          ["MVP Studio", "MVP scope and feature definition"],
          ["Product Roadmap", "Milestones and prioritization"],
          ["Launch Center", "Launch planning and execution"],
          ["Feedback Hub", "User feedback and product insights"],
          ["Founder Analytics", "Metrics and decision support"],
          ["Notifications", "System and activity notifications"],
          ["Files", "File and asset management"],
          ["Common", "Shared utilities, guards, decorators, infrastructure"],
        ],
      },
      { type: "h2", text: "Stack" },
      {
        type: "table",
        head: ["Layer", "Technology"],
        rows: [
          ["Frontend", "Next.js 16 (App Router)"],
          ["Language", "TypeScript"],
          ["Styling", "Tailwind CSS v4 · motion (Framer Motion)"],
          ["Backend", "NestJS 12"],
          ["API", "REST"],
          ["Database", "PostgreSQL (target)"],
          ["ORM", "Prisma (target)"],
          ["Monorepo", "pnpm workspaces"],
          ["Testing", "Jest (api) · ESLint (web)"],
        ],
      },
      { type: "h2", text: "Principles" },
      {
        type: "ul",
        items: [
          "**Domain-driven modularity** — each business domain has a clear responsibility and boundary.",
          "**Separation of concerns** — frontend, API, domain logic, and persistence stay distinct.",
          "**Shared infrastructure** — auth, users, workspaces, notifications, and files support every module.",
          "**End-to-end consistency** — domain relationships connect research, validation, execution, launch, and feedback.",
          "**Testability** — domain logic and API behavior stay independently testable.",
        ],
      },
      {
        type: "note",
        text: "This page describes the architecture as defined in the repository README. The running API today is a scaffold — verify what exists in [Backend API](/docs/backend-api).",
      },
    ],
  },

  /* -------------------------------------------------------------- web-routes */
  {
    slug: "web-routes",
    title: "Web Routes",
    category: "Reference",
    description:
      "Every route served by the Foundry web app, what each one renders, and how to add a new route.",
    blocks: [
      {
        type: "p",
        text: "`apps/web` uses the Next.js App Router with two route groups. Marketing, documentation and legal pages live in `(site)`, which renders the shared header, the hairline page frame and the footer. Authentication screens live in `(auth)`, which replaces that chrome with the brand rail and a single form column.",
      },
      { type: "h2", text: "Route table" },
      {
        type: "table",
        head: ["Route", "Page", "Status"],
        rows: [
          ["/", "Landing page — hero cycle, stages, workflow, architecture", "Live"],
          ["/docs", "Documentation — Introduction", "Live"],
          ["/docs/quick-start", "Documentation — Quick Start", "Live"],
          ["/docs/project-structure", "Documentation — Project Structure", "Live"],
          ["/docs/eight-stages", "Documentation — The Eight Stages", "Live"],
          ["/docs/workflow", "Documentation — The Workflow", "Live"],
          ["/docs/architecture", "Documentation — Architecture", "Live"],
          ["/docs/web-routes", "Documentation — Web Routes", "Live"],
          ["/docs/backend-api", "Documentation — Backend API", "Live"],
          ["/about", "About Foundry", "Live"],
          ["/login", "Sign in — accepts a validated `?next=` destination", "Live"],
          ["/register", "Create an account", "Live"],
          ["/forgot-password", "Request a password reset", "Live"],
          ["/reset-password", "Set a new password; reads `?token=`", "Live"],
          ["/verify-email", "Confirm an address with a six-digit code", "Live"],
          ["/terms", "Terms of service", "Live"],
          ["/privacy", "Privacy policy", "Live"],
          ["/api-reference", "API reference for the running backend", "Live"],
          ["/guides", "Long-form workflow walkthroughs", "Scaffold"],
          ["/examples", "Worked end-to-end scenarios", "Scaffold"],
          ["/playground", "Sandbox for walking an idea through the modules", "Scaffold"],
          ["/changelog", "Release notes", "Scaffold"],
        ],
      },
      { type: "h2", text: "Deep links" },
      {
        type: "ul",
        items: [
          "`/#stages`, `/#workflow`, `/#architecture` scroll to landing sections from any route.",
          "`/docs/[slug]#heading` opens a documentation page directly at a section heading.",
          "The hero cycle nodes link to `/#stage-01` … `/#stage-08`, which expand that stage in the ledger.",
        ],
      },
      { type: "h2", text: "Adding a route" },
      {
        type: "ol",
        items: [
          "Create a folder under `app/(site)/` — or `app/(auth)/` for a form screen — named after the route.",
          "Add a `page.tsx` that exports a component and its own `metadata`.",
          "Return content only: the group layout already provides the header, frame and footer, or the auth rail and form column.",
          "Read URL state (`?token=`, `?next=`) from the page's `searchParams` prop and pass a validated value into the client form.",
        ],
      },
      {
        type: "code",
        lang: "tsx",
        filename: "app/(site)/guides/page.tsx",
        code: "import type { Metadata } from \"next\";\n\nexport const metadata: Metadata = {\n  title: \"Guides — Foundry\",\n  description: \"Practical guides for building with Foundry.\",\n};\n\nexport default function GuidesPage() {\n  return (\n    <section className=\"px-6 py-20 sm:px-10 sm:py-28\">\n      <h1 className=\"text-4xl font-medium tracking-tight\">Guides</h1>\n    </section>\n  );\n}",
      },
      {
        type: "note",
        text: "The scaffolded routes (Guides, Examples, Playground, Changelog) all render through `components/site/scaffold.tsx`. The auth screens are complete on the client but have no API behind them yet: see [Backend API](/docs/backend-api) for what the server actually exposes.",
      },
    ],
  },

  /* ------------------------------------------------------------- backend-api */
  {
    slug: "backend-api",
    title: "Backend API",
    category: "Reference",
    description:
      "The current state of the NestJS API in apps/api: endpoints, configuration, scripts, and what comes next.",
    blocks: [
      {
        type: "p",
        text: "The backend in `apps/api` is a **NestJS 12 application**. This page documents what the code actually exposes today — endpoints, environment variables, and scripts — without ahead-of-the-code promises.",
      },
      { type: "h2", text: "Current endpoints" },
      {
        type: "table",
        head: ["Method", "Path", "Returns"],
        rows: [["GET", "/", "`Hello World!` — from AppController.getHello()"]],
      },
      {
        type: "code",
        lang: "bash",
        filename: "try it",
        code: "# API started on PORT=3001\ncurl http://localhost:3001/",
      },
      { type: "h2", text: "Configuration" },
      {
        type: "p",
        text: "The API reads its configuration from the environment (`apps/api/src/main.ts` and `app.module.ts`):",
      },
      {
        type: "table",
        head: ["Variable", "Default", "Purpose"],
        rows: [
          ["PORT", "3000", "HTTP port the NestJS server listens on"],
          ["OBSERVE_APP_KEY", "—", "NestJS Observe telemetry app key"],
          ["OBSERVE_APP_SECRET", "—", "NestJS Observe telemetry secret"],
          ["OBSERVE service id", "`api`", "Service name reported to Observe"],
        ],
      },
      {
        type: "note",
        text: "Run the API on a different port than the web app (for example `PORT=3001`) — both default to 3000.",
      },
      { type: "h2", text: "Scripts" },
      {
        type: "code",
        lang: "bash",
        filename: "apps/api",
        code: "pnpm start:dev     # watch mode\npnpm build         # compile to dist/\npnpm test          # Jest unit tests\npnpm lint          # oxlint (type-aware)\npnpm format        # Prettier",
      },
      { type: "h2", text: "Module layout" },
      {
        type: "ul",
        items: [
          "`AppModule` — root module; wires the Observe instrumentation and the HTTP controllers.",
          "`AppController` / `AppService` — the current `GET /` handler.",
          "`main.ts` — bootstrap: creates the Nest app with instrumentation and listens on `PORT`.",
        ],
      },
      { type: "h2", text: "What comes next" },
      {
        type: "p",
        text: "The product roadmap plans the domain modules behind REST endpoints — auth and users, workspaces and products, then the eight startup stages. Until a module ships, this reference will not list endpoints for it. Track progress in the repository README roadmap and the [Changelog](/changelog).",
      },
    ],
  },
];