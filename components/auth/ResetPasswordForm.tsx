"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setMessage("Password reset successful! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="bg-red-100 border-[3px] border-red-500 text-red-700 p-4 rounded-lg">
        Invalid or missing reset token. Please request a new password reset link.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-[5px] border-black rounded-[22px] shadow-200 p-8 space-y-6"
    >
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
        <label htmlFor="password" className="text-primary font-bold uppercase">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            disabled={isLoading}
            className="pl-12 pr-12 border-[3px] border-black h-12 rounded-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="size-5 text-gray-400" />
            ) : (
              <Eye className="size-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-primary font-bold uppercase"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            disabled={isLoading}
            className="pl-12 pr-12 border-[3px] border-black h-12 rounded-full"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? (
              <EyeOff className="size-5 text-gray-400" />
            ) : (
              <Eye className="size-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-white font-bold py-6 rounded-full border-[3px] border-black shadow-200 hover:shadow-300 transition-all uppercase"
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}
