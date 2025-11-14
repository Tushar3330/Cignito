"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      // Show coming soon message
      if (data.featureStatus === "coming-soon") {
        setMessage("🚧 Password reset feature is coming soon! Please contact support for assistance.");
      } else {
        setMessage("Request processed successfully!");
      }
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-[5px] border-black rounded-[22px] shadow-200 p-8 space-y-6"
    >
      <div className="bg-yellow-100 border-[3px] border-secondary text-black p-4 rounded-lg text-sm">
        <strong>🚧 Coming Soon:</strong> Password reset feature is currently under development. 
        Please contact support if you need assistance with your account.
      </div>

      {message && (
        <div className="bg-green-100 border-[3px] border-green-500 text-green-700 p-4 rounded-lg">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-[3px] border-red-500 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-primary font-bold uppercase">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={isLoading}
            className="pl-12 border-[3px] border-black h-12 rounded-full"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-white font-bold py-6 rounded-full border-[3px] border-black shadow-200 hover:shadow-300 transition-all uppercase"
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </Button>

      <div className="text-center pt-4">
        <Link
          href="/signin"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Sign In
        </Link>
      </div>
    </form>
  );
}
