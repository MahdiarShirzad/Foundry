/** Shared documentation types and pure helpers. Kept free of page content so
 *  client components can import the small derived structures (sidebar tree,
 *  search entries) without pulling the full content into the browser bundle. */

export type DocCategory = "Getting Started" | "Core Concepts" | "Reference";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; lang: string; code: string; filename?: string }
  | { type: "note"; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export type Doc = {
  /** "index" is served at /docs; every other slug at /docs/[slug]. */
  slug: string;
  title: string;
  description: string;
  category: DocCategory;
  blocks: Block[];
};

export const CATEGORIES: DocCategory[] = [
  "Getting Started",
  "Core Concepts",
  "Reference",
];

/** Reading order — also drives previous/next pagination. */
export const DOC_ORDER = [
  "index",
  "quick-start",
  "project-structure",
  "eight-stages",
  "workflow",
  "architecture",
  "web-routes",
  "backend-api",
] as const;

export function docPath(slug: string): string {
  return slug === "index" ? "/docs" : `/docs/${slug}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s]+/g, "-");
}

export type TocItem = { id: string; label: string };

/** Headings for the on-page table of contents (h2 level keeps the rail calm). */
export function buildToc(blocks: Block[]): TocItem[] {
  return blocks
    .filter((b): b is { type: "h2"; text: string } => b.type === "h2")
    .map((b) => ({ id: slugify(b.text), label: b.text }));
}

export type SidebarTree = {
  category: DocCategory;
  items: { title: string; path: string }[];
}[];

export function buildTree(docs: Doc[]): SidebarTree {
  return CATEGORIES.map((category) => ({
    category,
    items: docs
      .filter((doc) => doc.category === category)
      .map((doc) => ({ title: doc.title, path: docPath(doc.slug) })),
  })).filter((group) => group.items.length > 0);
}

export type SearchEntry = {
  path: string;
  hash?: string;
  title: string;
  /** Where the hit lives — category · page, shown under the title. */
  context: string;
  snippet: string;
};

function plainText(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** A real client-side index: one entry per page plus one per h2 section,
 *  with the section's following prose as the snippet. */
export function buildSearchIndex(docs: Doc[]): SearchEntry[] {
  const entries: SearchEntry[] = [];
  for (const doc of docs) {
    const path = docPath(doc.slug);
    entries.push({
      path,
      title: doc.title,
      context: doc.category,
      snippet: doc.description,
    });
    for (let i = 0; i < doc.blocks.length; i++) {
      const block = doc.blocks[i];
      if (block.type !== "h2") continue;
      const snippetParts: string[] = [];
      for (let j = i + 1; j < doc.blocks.length; j++) {
        const next = doc.blocks[j];
        if (next.type === "h2") break;
        if (next.type === "p") snippetParts.push(next.text);
        if (next.type === "ul" || next.type === "ol") snippetParts.push(...next.items);
        if (next.type === "note") snippetParts.push(next.text);
        if (snippetParts.join(" ").length > 220) break;
      }
      entries.push({
        path,
        hash: slugify(block.text),
        title: block.text,
        context: doc.title,
        snippet: plainText(snippetParts.join(" ")).slice(0, 170),
      });
    }
  }
  return entries;
}

export type Pagination = {
  prev: { title: string; path: string } | null;
  next: { title: string; path: string } | null;
};

export function buildPagination(docs: Doc[], slug: string): Pagination {
  const index = DOC_ORDER.indexOf(slug as (typeof DOC_ORDER)[number]);
  const withTitles = DOC_ORDER.map((s) => {
    const doc = docs.find((d) => d.slug === s);
    return doc ? { title: doc.title, path: docPath(doc.slug) } : null;
  }).filter((x): x is { title: string; path: string } => x !== null);
  const current = withTitles.findIndex((p) => p.path === docPath(slug));
  if (index === -1 || current === -1) return { prev: null, next: null };
  return {
    prev: current > 0 ? withTitles[current - 1] : null,
    next: current < withTitles.length - 1 ? withTitles[current + 1] : null,
  };
}