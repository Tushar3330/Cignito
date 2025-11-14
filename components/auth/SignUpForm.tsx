"use client";

import { useState } from "react";
import { signup, githubSignIn, googleSignIn } from "@/app/lib/auth-actions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import { Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleCredentialsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleGithubSignIn() {
    setIsLoading(true);
    await githubSignIn();
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    await googleSignIn();
  }

  return (
    <div className="bg-white rounded-2xl shadow-200 p-8 border-[5px] border-black max-w-md w-full">
      {/* Social Sign-In Buttons */}
      <div className="space-y-3 mb-6">
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-3 h-12 border-[3px] border-black hover:bg-primary-100 transition-all duration-300"
          onClick={handleGithubSignIn}
          disabled={isLoading}
        >
          <Github className="size-5" />
          <span className="font-semibold">Continue with GitHub</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-3 h-12 border-[3px] border-black hover:bg-primary-100 transition-all duration-300"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <FcGoogle className="size-5" />
          <span className="font-semibold">Continue with Google</span>
        </Button>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-black"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-black-100">
            Or sign up with email
          </span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border-[3px] border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-bold text-black mb-2 uppercase"
          >
            Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            placeholder="John Doe"
            className="h-12 border-[3px] border-black bg-white text-black focus:border-primary transition-all"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold text-primary mb-2 uppercase"
          >
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="h-12 border-[3px] border-black bg-white text-black focus:border-primary transition-all"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-bold text-black mb-2 uppercase"
          >
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="h-12 border-[3px] border-black bg-white text-black focus:border-primary transition-all"
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-200 hover:shadow-300 transition-all duration-300 border-[3px] border-black"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      {/* Sign In Link */}
      <div className="mt-6 text-center text-sm text-black-100">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-bold text-primary hover:text-secondary transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
