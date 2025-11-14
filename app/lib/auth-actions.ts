"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn } from "./auth";
import { redirect } from "next/navigation";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signup(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatedData = signupSchema.parse(rawData);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    // Auto sign-in after signup
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    console.error("Signup error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function credentialsSignIn(formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatedData = signinSchema.parse(rawData);

    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Invalid email or password" };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    console.error("Sign-in error:", error);
    return { error: "Invalid email or password" };
  }
}

export async function githubSignIn() {
  await signIn("github", { redirectTo: "/" });
}

export async function googleSignIn() {
  await signIn("google", { redirectTo: "/" });
}
