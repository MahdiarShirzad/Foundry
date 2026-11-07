import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
