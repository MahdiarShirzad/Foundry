import type { Metadata } from "next";

import ResetForm from "@/components/auth/reset-form";

// Reads `?token=`, so it renders per request.
export const instant = false;

export const metadata: Metadata = {
  title: "Set a new password",
  description: "Choose a new password for your Foundry account.",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  return <ResetForm token={token} />;
}
