import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DocView, { getDoc } from "@/components/docs/doc-view";
import { DOC_ORDER } from "@/lib/docs";

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
  if (!doc) return { title: "Not found — Foundry" };
  return {
    title: `${doc.title} — Foundry`,
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