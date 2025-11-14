"use server";

import { signIn } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export async function linkGitHub(userId: string) {
  // The callbackUrl with linking=true tells our auth callback to link instead of signin
  await signIn("github", {
    redirectTo: `/user/${userId}?linking=true`,
  });
}

export async function linkGoogle(userId: string) {
  await signIn("google", {
    redirectTo: `/user/${userId}?linking=true`,
  });
}
