import Eyebrow from "./eyebrow";
import Reveal from "./reveal";

const STACK: [string, string][] = [
  ["Frontend", "Next.js"],
  ["Language", "TypeScript"],
  ["Backend", "NestJS"],
  ["API", "REST · OpenAPI"],
  ["Database", "PostgreSQL"],
  ["ORM", "Prisma"],
  ["Monorepo", "pnpm workspaces"],
  ["Build", "Turborepo"],
  ["Testing", "Jest"],
];

const DOMAINS: [string, string][] = [
  ["Auth & Users", "Sessions & access"],
  ["Workspace & Products", "Products & collaboration"],
  ["Startup domains", "Idea · Market · Validation · MVP · Roadmap · Launch · Feedback · Analytics"],
];

function Connector({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`h-8 flex-col items-center ${className}`}>
      <span className="w-px flex-1 bg-line-2" />
      <svg width="9" height="7" viewBox="0 0 9 7" className="mt-px fill-accent" aria-hidden>
        <path d="M0 0h9L4.5 7z" />
      </svg>
    </div>
  );
}

const boxClass =
  "border border-line bg-panel px-5 py-4 text-center font-mono transition-colors";

export default function Architecture() {
  return (
    <section
      id="architecture"
      aria-labelledby="architecture-title"
      className="on-ink scroll-mt-16 border-b border-line bg-bg text-fg"
    >
      <div className="px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>Sec. 04 — Architecture</Eyebrow>
              <h2
                id="architecture-title"
                className="mt-8 text-[clamp(1.75rem,3.4vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.03em]"
              >
                One repository. Clear boundaries.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="lg:col-span-5 lg:pt-3">
            <p className="max-w-[52ch] text-[16.5px] leading-[1.75] text-muted">
              A modular monolith: the frontend, the API and every startup domain keep
              explicit boundaries while shipping as one cohesive system.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Schematic */}
          <Reveal className="lg:col-span-7">
            <div className="blueprint border border-line p-6 sm:p-8">
              <div className="flex flex-col items-center">
                <div className="w-44 border border-line bg-panel px-4 py-3 text-center font-mono text-[10.5px] uppercase tracking-[0.18em] text-faint">
                  Founder / user
                </div>

                <Connector className="flex" />

                <div className={`${boxClass} w-full max-w-md`}>
                  <div className="text-[13px] text-fg">apps/web</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-faint">
                    Next.js · TypeScript · Tailwind
                  </div>
                </div>

                <Connector className="flex" />

                <div className={`${boxClass} w-full max-w-md`}>
                  <div className="text-[13px] text-fg">apps/api</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-faint">
                    NestJS · REST · Swagger
                  </div>
                </div>

                {/* fork into domains (sm+) */}
                <div aria-hidden className="relative hidden h-8 w-full sm:block">
                  <span className="absolute top-0 right-[16.6667%] left-[16.6667%] h-px bg-line-2" />
                  <span className="absolute top-0 left-[16.6667%] h-8 w-px bg-line-2" />
                  <span className="absolute top-0 left-1/2 h-8 w-px bg-line-2" />
                  <span className="absolute top-0 left-[83.3333%] h-8 w-px bg-line-2" />
                </div>
                <Connector className="flex sm:hidden" />

                <div className="grid w-full grid-cols-1 sm:grid-cols-3">
                  {DOMAINS.map(([name, sub], i) => (
                    <div
                      key={name}
                      className={`${boxClass} ${i > 0 ? "-mt-px sm:mt-0 sm:-ml-px" : ""}`}
                    >
                      <div className="text-[12px] text-fg">{name}</div>
                      <div className="mt-1 text-[9.5px] leading-relaxed tracking-[0.08em] text-faint uppercase">
                        {sub}
                      </div>
                    </div>
                  ))}
                </div>

                {/* merge into the database (sm+) */}
                <div aria-hidden className="relative hidden h-8 w-full sm:block">
                  <span className="absolute bottom-0 right-[16.6667%] left-[16.6667%] h-px bg-line-2" />
                  <span className="absolute bottom-0 left-[16.6667%] h-8 w-px bg-line-2" />
                  <span className="absolute bottom-0 left-1/2 h-8 w-px bg-line-2" />
                  <span className="absolute bottom-0 left-[83.3333%] h-8 w-px bg-line-2" />
                </div>
                <Connector className="flex sm:hidden" />

                <Connector className="hidden sm:flex" />

                <div className={`${boxClass} w-full max-w-md`}>
                  <div className="text-[13px] text-fg">PostgreSQL</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-faint">
                    Prisma · migrations
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Spec sheet */}
          <Reveal delay={0.12} className="lg:col-span-5">
            <div className="border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.25em] text-faint">
                The stack
              </div>
              <dl className="mt-4">
                {STACK.map(([term, value]) => (
                  <div
                    key={term}
                    className="flex items-baseline gap-3 border-b border-line py-3 font-mono"
                  >
                    <dt className="text-[10.5px] uppercase tracking-[0.18em] text-faint">
                      {term}
                    </dt>
                    <span
                      aria-hidden
                      className="h-px flex-1 translate-y-[-2px] bg-line"
                    />
                    <dd className="text-[13px] text-fg">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-[15px] leading-[1.7] text-muted">
                Domain-driven modularity: each business domain owns its rules and stays
                independently testable — without sacrificing a cohesive system.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}