import { z } from "zod";

export const bugFormSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must be less than 5000 characters"),
  codeSnippet: z.string().optional(),
  language: z
    .string()
    .min(2, "Please select a programming language")
    .max(50),
  framework: z.string().max(50).optional(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  images: z.string().optional(), // Comma-separated URLs
});

export const solutionFormSchema = z.object({
  content: z
    .string()
    .min(20, "Solution must be at least 20 characters")
    .max(5000, "Solution must be less than 5000 characters"),
  codeSnippet: z.string().optional(),
  images: z.string().optional(), // Comma-separated URLs
});

export const commentFormSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be less than 1000 characters"),
});