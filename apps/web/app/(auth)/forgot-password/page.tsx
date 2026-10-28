import type { Metadata } from "next";

import ForgotForm from "@/components/auth/forgot-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a single-use link to reset your Foundry password.",
};

export default function ForgotPasswordPage() {
  return <ForgotForm />;
}
