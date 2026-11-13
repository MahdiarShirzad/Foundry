import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DocView, { getDoc } from "@/components/docs/doc-view";
import { DOC_ORDER } from "@/lib/docs";

// Every doc is statically generated from local content, so the page only needs
// `params` to pick the right one. Blocking on that read is cheaper than
// shipping a loading shell for content the server can render immediately.
export const instant = false;

export function generateStaticParams() {
  return DOC_ORDER.filter((slug) => slug !== "index").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return { title: "Not found" };
  return {
    title: doc.title,
    description: doc.description,
  };
}

export default async function DocsSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getDoc(slug)) notFound();
  return <DocView slug={slug} />;
}