"use client";

import Link from "next/link";

import { STAGES } from "@/components/site/data";
import { EmptyState, ErrorState } from "@/components/ui/primitives";
import { useProducts } from "@/lib/product/use-products";

/** Shape returned by `GET /products`. */
type Product = {
  id: string;
  name: string;
  slug?: string;
};

/** Same anchor format as `stageSlug`, kept local so no demo data is bundled. */
function slugFor(stage: { id: string; name: string }): string {
  return `${stage.id}-${stage.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function ModulesSkeleton() {
  return (
    <div className="space-y-4" aria-busy>
      <div className="h-[6.5rem] animate-pulse border border-line bg-panel shadow-[var(--elevation-lift)]" />
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((card) => (
          <div
            key={card}
            className="border border-line bg-panel px-5 py-5 shadow-[var(--elevation-lift)]"
          >
            <div className="h-2 w-24 animate-pulse bg-line" />
            <div className="mt-3 h-3 w-40 animate-pulse bg-line/70" />
            <div className="mt-4 space-y-2">
              <div className="h-2.5 w-full animate-pulse bg-line/60" />
              <div className="h-2.5 w-4/5 animate-pulse bg-line/50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ModulesOverview() {
  const { data, isPending, isError, refetch } = useProducts();

  // `getAllProducts` is untyped at the client wrapper, so narrow here.
  const products = (data as Product[] | undefined) ?? [];
  const unassigned = products.length;
  const pending = isPending;

  return (
    <div className="space-y-5">
      <header className="relative overflow-hidden border border-line bg-panel shadow-[var(--elevation-lift)]">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-28 size-[20rem] rounded-full bg-mint-tint/70 blur-3xl"
        />
        <div className="relative flex flex-wrap items-end justify-between gap-5 px-5 py-5 sm:px-7 sm:py-6">
          <div className="min-w-0 max-w-[58ch]">
            <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
              <span aria-hidden className="size-1.5 bg-mint" />
              Eight modules
            </p>
            <h1 className="mt-2.5 text-[clamp(1.9rem,3vw,2.45rem)] font-medium leading-[1.02] tracking-[-0.045em] text-fg">
              The cycle
            </h1>
            <p className="mt-3 max-w-[56ch] text-[13px] leading-relaxed text-muted">
              Products enter the cycle in the Idea Lab. Until stage data is available, every
              product is listed as unassigned.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="border border-line bg-bg/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                {pending ? "—" : `${products.length} products`}
              </span>
              <span className="border border-line bg-bg/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                {pending ? "…" : `${unassigned} unassigned`}
              </span>
            </div>
          </div>
          <Link
            href="/docs/eight-stages"
            className="border border-line-2 bg-panel px-3 py-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            reference ↗
          </Link>
        </div>
      </header>

      {pending ? (
        <ModulesSkeleton />
      ) : isError ? (
        <ErrorState
          eyebrow="Products unavailable"
          title="Could not load products"
          description="The product list could not be fetched from the workspace. Check your connection and try again."
          onRetry={() => void refetch()}
        />
      ) : products.length === 0 ? (
        <div className="border border-line bg-panel shadow-[var(--elevation-lift)]">
          <EmptyState
            eyebrow="Products"
            title="No products yet — create one to get started"
            description="Use the product switcher in the sidebar to add your first product. It will appear here as soon as it exists."
            icon="plus"
          />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3 pt-1">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                Stage rail
              </p>
              <p className="mt-1 text-[11.5px] text-faint">
                Stage assignment is not available yet. Products stay unassigned until the module
                APIs can place them.
              </p>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
              {STAGES.length} stages
            </span>
          </div>

          {/* Horizontal cycle rail */}
          <div className="overflow-x-auto border border-line bg-panel shadow-[var(--elevation-lift)]">
            <ol className="flex min-w-max items-stretch">
              <li className="flex items-stretch">
                <Link
                  href="#unassigned"
                  className="group flex w-[9.5rem] flex-col justify-between gap-3 px-4 py-4 transition-colors hover:bg-mint-tint/25"
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-[9px] tracking-[0.16em] text-accent">—</span>
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-accent">
                      {unassigned} ⚑
                    </span>
                  </span>
                  <span className="text-[12px] font-medium leading-snug text-fg transition-colors group-hover:text-accent">
                    Unassigned
                  </span>
                  <span className="flex items-baseline gap-1.5 border-t border-line/70 pt-2.5">
                    <span className="font-mono text-[1.5rem] font-medium leading-none tracking-[-0.03em] text-fg">
                      {unassigned}
                    </span>
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint">
                      products
                    </span>
                  </span>
                </Link>
                <span aria-hidden className="my-3 w-px shrink-0 bg-line" />
              </li>
              {STAGES.map((stage, index) => (
                <li key={stage.id} className="flex items-stretch">
                  <Link
                    href={`#${slugFor(stage)}`}
                    className="group flex w-[9.5rem] flex-col justify-between gap-3 px-4 py-4 transition-colors hover:bg-mint-tint/25"
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-mono text-[9px] tracking-[0.16em] text-accent">
                        {stage.id}
                      </span>
                    </span>
                    <span className="text-[12px] font-medium leading-snug text-fg transition-colors group-hover:text-accent">
                      {stage.name}
                    </span>
                    <span className="flex items-baseline gap-1.5 border-t border-line/70 pt-2.5">
                      <span className="font-mono text-[1.5rem] font-medium leading-none tracking-[-0.03em] text-fg">
                        0
                      </span>
                      <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-faint">
                        active
                      </span>
                    </span>
                  </Link>
                  {index < STAGES.length - 1 ? (
                    <span aria-hidden className="my-3 w-px shrink-0 bg-line" />
                  ) : null}
                </li>
              ))}
            </ol>
          </div>

          {/* Stage detail grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <section
              id="unassigned"
              className="scroll-mt-24 border border-line bg-panel shadow-[var(--elevation-lift)] transition-colors hover:border-line-2"
            >
              <header className="flex items-start justify-between gap-4 border-b border-line/80 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
                    Stage unassigned
                  </p>
                  <h2 className="mt-1 text-[15px] font-medium tracking-[-0.015em] text-fg">
                    Unassigned
                  </h2>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                    Products that do not have a cycle stage yet.
                  </p>
                </div>
                <span className="shrink-0 border border-line bg-bg/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                  {products.length} products
                </span>
              </header>

              <ul className="divide-y divide-line/70">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-baseline justify-between gap-3 px-5 py-2.5 transition-colors hover:bg-mint-tint/15"
                  >
                    <span className="min-w-0 truncate text-[12px] text-fg">{product.name}</span>
                    <span className="shrink-0 font-mono text-[9px] text-faint">
                      {product.slug ?? product.id.slice(0, 8)}
                    </span>
                  </li>
                ))}
              </ul>

              <footer className="flex items-center justify-between gap-3 border-t border-line/80 bg-bg/30 px-5 py-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                  {products.length} products · no stage assigned
                </span>
                <Link
                  href="/dashboard/idea-lab"
                  className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint underline decoration-line underline-offset-4 transition-colors hover:text-accent"
                >
                  idea lab ↗
                </Link>
              </footer>
            </section>

            {STAGES.map((stage) => (
              <section
                key={stage.id}
                id={slugFor(stage)}
                className="scroll-mt-24 border border-line bg-panel shadow-[var(--elevation-lift)] transition-colors hover:border-line-2"
              >
                <header className="flex items-start justify-between gap-4 border-b border-line/80 px-5 py-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
                      {stage.id} / {stage.verb}
                    </p>
                    <h2 className="mt-1 text-[15px] font-medium tracking-[-0.015em] text-fg">
                      {stage.name}
                    </h2>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                      {stage.tagline}
                    </p>
                  </div>
                  <span className="shrink-0 border border-line bg-bg/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                    0 active
                  </span>
                </header>

                <p className="mx-5 my-4 border border-dashed border-line px-3 py-4 text-center text-[11px] text-faint">
                  No product assigned to this stage yet.
                </p>

                <footer className="flex items-center justify-between gap-3 border-t border-line/80 bg-bg/30 px-5 py-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                    0 active
                  </span>
                  <Link
                    href={`/docs/eight-stages#${slugFor(stage)}`}
                    className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint underline decoration-line underline-offset-4 transition-colors hover:text-accent"
                  >
                    docs ↗
                  </Link>
                </footer>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
