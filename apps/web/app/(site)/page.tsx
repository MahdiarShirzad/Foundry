import type { Metadata } from "next";
import FlowLines from "@/components/FlowLines";
import Hero from "@/components/site/hero";
import Manifesto from "@/components/site/manifesto";
import Stages from "@/components/site/stages";
import Workflow from "@/components/site/workflow";
import Architecture from "@/components/site/architecture";
import Closing from "@/components/site/closing";
import StructuredData from "@/components/site/structured-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "Foundry — One idea. Eight stages. One ecosystem.",
    template: "%s — Foundry",
  },
  description:
    "Foundry is a startup builder ecosystem: eight connected stages — idea, market research, validation, MVP, roadmap, launch, feedback and analytics — in one workflow, so every stage informs the next.",
  authors: [{ name: "Foundry" }],
  creator: "Foundry",
  publisher: "Foundry",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: siteUrl
    ? {
        title: "Foundry — One idea. Eight stages. One ecosystem.",
        description:
          "Foundry is a startup builder ecosystem: eight connected stages — idea, market research, validation, MVP, roadmap, launch, feedback and analytics — in one workflow, so every stage informs the next.",
        url: "/",
        siteName: "Foundry",
        type: "website",
        locale: "en_US",
        images: [
          {
            url: "/icon.png",
            width: 316,
            height: 314,
            alt: "Foundry",
          },
        ],
      }
    : undefined,
  twitter: siteUrl
    ? {
        card: "summary_large_image",
        title: "Foundry — One idea. Eight stages. One ecosystem.",
        description:
          "Foundry is a startup builder ecosystem: eight connected stages — idea, market research, validation, MVP, roadmap, launch, feedback and analytics — in one workflow, so every stage informs the next.",
        images: ["/icon.png"],
      }
    : undefined,
};

export default function Home() {
  return (
    <div className="relative overflow-x-clip">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Foundry",
          url: siteUrl ?? "/",
          logo: `${siteUrl ?? ""}/icon.png`,
          description:
            "Foundry is a startup builder ecosystem: eight connected stages — idea, market research, validation, MVP, roadmap, launch, feedback and analytics — in one workflow, so every stage informs the next.",
        }}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Foundry",
          url: siteUrl ?? "/",
          description:
            "Foundry is a startup builder ecosystem: eight connected stages — idea, market research, validation, MVP, roadmap, launch, feedback and analytics — in one workflow, so every stage informs the next.",
        }}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Foundry",
          applicationCategory: "BusinessApplication",
          url: siteUrl ?? "/",
          description:
            "Foundry is a startup builder ecosystem: eight connected stages — idea, market research, validation, MVP, roadmap, launch, feedback and analytics — in one workflow, so every stage informs the next.",
        }}
      />
      <FlowLines />
      <Hero />
      <Manifesto />
      <Stages />
      <Workflow />
      <Architecture />
      <Closing />
    </div>
  );
}
