"use client";

import Link from "next/link";

import { STAGES } from "@/components/site/data";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/primitives";
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
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((card) => (
          <div
            key={card}
            className="rounded-card border border-line bg-panel px-5 py-5 shadow-card"
          >
            <Skeleton className="h-2.5 w-24" />
            <Skeleton className="mt-3 h-3.5 w-40" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-2.5 w-full" />
              <Skeleton className="h-2.5 w-4/5" />
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
    <div className="space-y-6">
      <header className="relative isolate">
        <span
          aria-hidden
          className="blueprint pointer-events-none absolute -inset-x-4 -top-5 -z-10 h-40 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_85%)] sm:-inset-x-6"
        />
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between xl:gap-10">
          <div className="min-w-0 max-w-[74ch]">
            <p className="text-[12px] text-faint">
              Eight modules
            </p>
            <h1 className="mt-3 text-[clamp(1.75rem,2.6vw,2rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-fg">
              The cycle
            </h1>
            <p className="mt-2.5 max-w-[68ch] text-[14px] leading-relaxed text-muted">
              Products enter the cycle in the Idea Lab. Until stage data is available, every
              product is listed as unassigned.
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 text-[13px] text-muted">
              <span className="font-medium text-fg">
                {pending ? "—" : `${products.length} products`}
              </span>
              <span aria-hidden className="size-1 rounded-full bg-line-2" />
              <span>{pending ? "…" : `${unassigned} unassigned`}</span>
            </p>
          </div>
          <Link
            href="/docs/eight-stages"
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-control border border-line bg-panel px-3.5 text-[13px] font-medium text-fg transition-colors hover:border-accent/60 hover:text-accent xl:mt-1"
          >
            Reference
            <span aria-hidden>↗</span>
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
        <div className="rounded-card border border-line bg-panel shadow-card">
          <EmptyState
            eyebrow="Products"
            title="No products yet — create one to get started"
            description="Use the product switcher in the sidebar to add your first product. It will appear here as soon as it exists."
            icon="plus"
          />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-semibold tracking-[-0.015em] text-fg">
                Stage rail
              </h2>
              <p className="mt-1 max-w-[70ch] text-[13px] text-muted">
                Stage assignment is not available yet. Products stay unassigned until the module
                APIs can place them.
              </p>
            </div>
            <span className="text-[12px] text-faint">{STAGES.length} stages</span>
          </div>

          {/* Horizontal cycle rail */}
          <div className="overflow-x-auto rounded-card border border-line bg-panel shadow-card">
            <ol className="flex min-w-max items-stretch">
              <li className="flex items-stretch">
                <Link
                  href="#unassigned"
                  className="group flex w-[10rem] flex-col justify-between gap-3 px-4 py-4 transition-colors hover:bg-mint-tint/25"
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-[11px] text-accent">—</span>
                    <span className="text-[11.5px] font-medium text-accent">
                      {unassigned} ⚑
                    </span>
                  </span>
                  <span className="text-[13px] font-medium leading-snug text-fg transition-colors group-hover:text-accent">
                    Unassigned
                  </span>
                  <span className="flex items-baseline gap-1.5 border-t border-line/70 pt-2.5">
                    <span className="font-sans text-[1.35rem] font-semibold leading-none tracking-[-0.03em] text-fg tabular-nums">
                      {unassigned}
                    </span>
                    <span className="text-[11.5px] text-faint">products</span>
                  </span>
                </Link>
                <span aria-hidden className="my-3 w-px shrink-0 bg-line" />
              </li>
              {STAGES.map((stage, index) => (
                <li key={stage.id} className="flex items-stretch">
                  <Link
                    href={`#${slugFor(stage)}`}
                    className="group flex w-[10rem] flex-col justify-between gap-3 px-4 py-4 transition-colors hover:bg-mint-tint/25"
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-mono text-[11px] text-faint">{stage.id}</span>
                    </span>
                    <span className="text-[13px] font-medium leading-snug text-fg transition-colors group-hover:text-accent">
                      {stage.name}
                    </span>
                    <span className="flex items-baseline gap-1.5 border-t border-line/70 pt-2.5">
                      <span className="font-sans text-[1.35rem] font-semibold leading-none tracking-[-0.03em] text-fg tabular-nums">
                        0
                      </span>
                      <span className="text-[11.5px] text-faint">active</span>
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
              className="scroll-mt-24 rounded-card border border-line bg-panel shadow-card"
            >
              <header className="flex items-start justify-between gap-4 px-5 pb-3 pt-5">
                <div className="min-w-0">
                  <p className="text-[12px] text-muted">Stage unassigned</p>
                  <h2 className="mt-1 text-[16px] font-semibold tracking-[-0.015em] text-fg">
                    Unassigned
                  </h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">
                    Products that do not have a cycle stage yet.
                  </p>
                </div>
                <span className="shrink-0 rounded-pill bg-surface-sunken/60 px-2.5 py-1 text-[11.5px] font-medium text-muted">
                  {products.length} products
                </span>
              </header>

              <ul className="divide-y divide-line/70 border-t border-line/70">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-baseline justify-between gap-3 px-5 py-2.5 transition-colors hover:bg-surface-sunken/25"
                  >
                    <span className="min-w-0 truncate text-[13px] text-fg">{product.name}</span>
                    <span className="shrink-0 font-mono text-[11px] text-faint">
                      {product.slug ?? product.id.slice(0, 8)}
                    </span>
                  </li>
                ))}
              </ul>

              <footer className="flex items-center justify-between gap-3 border-t border-line/70 px-5 py-3">
                <span className="text-[12px] text-faint">
                  {products.length} products · no stage assigned
                </span>
                <Link
                  href="/dashboard/idea-lab"
                  className="text-[12.5px] font-medium text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
                >
                  Idea Lab
                </Link>
              </footer>
            </section>

            {STAGES.map((stage) => (
              <section
                key={stage.id}
                id={slugFor(stage)}
                className="scroll-mt-24 rounded-card border border-line bg-panel shadow-card"
              >
                <header className="flex items-start justify-between gap-4 px-5 pb-3 pt-5">
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] text-faint">
                      {stage.id} / {stage.verb}
                    </p>
                    <h2 className="mt-1 text-[16px] font-semibold tracking-[-0.015em] text-fg">
                      {stage.name}
                    </h2>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">
                      {stage.tagline}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-pill bg-surface-sunken/60 px-2.5 py-1 text-[11.5px] font-medium text-muted">
                    0 active
                  </span>
                </header>

                <p className="mx-5 my-3 rounded-control border border-dashed border-line px-3 py-4 text-center text-[12.5px] text-faint">
                  No product assigned to this stage yet.
                </p>

                <footer className="flex items-center justify-between gap-3 border-t border-line/70 px-5 py-3">
                  <span className="text-[12px] text-faint">0 active</span>
                  <Link
                    href={`/docs/eight-stages#${slugFor(stage)}`}
                    className="text-[12.5px] font-medium text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
                  >
                    Docs
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
