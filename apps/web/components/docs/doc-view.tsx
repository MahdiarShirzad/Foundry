import { notFound } from "next/navigation";
import { DOCS } from "@/lib/docs-content";
import {
  buildPagination,
  buildSearchIndex,
  buildToc,
  buildTree,
} from "@/lib/docs";
import DocsShell from "./docs-shell";
import DocRenderer from "./doc-renderer";
import PrevNext from "./prev-next";

/** Derived once per build — no content is duplicated in client bundles. */
const TREE = buildTree(DOCS);
const SEARCH_ENTRIES = buildSearchIndex(DOCS);

export function getDoc(slug: string) {
  return DOCS.find((doc) => doc.slug === slug);
}

/** Server view shared by /docs (index) and /docs/[slug]. */
export default function DocView({ slug }: { slug: string }) {
  const doc = getDoc(slug);
  if (!doc) notFound();

  const toc = buildToc(doc.blocks);
  const pagination = buildPagination(DOCS, doc.slug);

  return (
    <DocsShell
      tree={TREE}
      toc={toc}
      searchEntries={SEARCH_ENTRIES}
      category={doc.category}
      title={doc.title}
    >
      <article className="min-w-0 px-6 py-10 sm:px-10 lg:py-14">
        <header className="border-b border-line pb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.03em] text-fg">
            {doc.title}
          </h1>
          <p className="mt-3 max-w-[64ch] text-[17px] leading-[1.7] text-muted">
            {doc.description}
          </p>
        </header>

        <DocRenderer blocks={doc.blocks} />

        <PrevNext prev={pagination.prev} next={pagination.next} />
      </article>
    </DocsShell>
  );
}