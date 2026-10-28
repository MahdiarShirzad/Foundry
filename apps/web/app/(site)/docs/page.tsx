import type { Metadata } from "next";
import DocView, { getDoc } from "@/components/docs/doc-view";

const indexDoc = getDoc("index");

export const metadata: Metadata = {
  title: "Documentation",
  description: indexDoc?.description ?? "Foundry documentation.",
};

export default function DocsIndexPage() {
  return <DocView slug="index" />;
}