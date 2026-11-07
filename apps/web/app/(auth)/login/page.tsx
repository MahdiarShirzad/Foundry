import type { Metadata } from "next";

import LoginForm from "@/components/auth/login-form";

export const instant = false;

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Foundry to continue where your idea left off.",
};

export default function LoginPage() {
  return <LoginForm next="/" />;
}
