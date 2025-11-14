"use client";

import { useState, useActionState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Upload, X } from "lucide-react";
import { solutionFormSchema } from "@/app/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { createSolution } from "@/app/lib/actions";
import dynamic from "next/dynamic";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import DarkModeEditor from "./DarkModeEditor";
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface SolutionFormProps {
  bugId: string;
}

const SolutionForm = ({ bugId }: SolutionFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [content, setContent] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Image upload handler
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
        toast({
          title: "Configuration Error",
          description: "Cloudinary is not configured. Please add images via URL.",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
        );

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();
          return data.secure_url;
        } catch (error) {
          console.error("Upload failed:", error);
          return null;
        }
      });

      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url): url is string => url !== null);
      setUploadedImages((prev) => [...prev, ...validUrls]);
      setIsUploading(false);

      if (validUrls.length > 0) {
        toast({
          title: "Success",
          description: `${validUrls.length} image(s) uploaded successfully`,
        });
      }
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxSize: 5242880, // 5MB
  });

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      // Add content, code snippet, and images from state to formData
      formData.set("content", content);
      formData.set("codeSnippet", codeSnippet);
      formData.set("images", uploadedImages.join(","));
      
      const formValues = {
        content: content,
        codeSnippet: codeSnippet,
        images: uploadedImages.join(","),
      };

      await solutionFormSchema.parseAsync(formValues);

      const result = await createSolution(bugId, formData);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your solution has been posted!",
        });

        // Reset form
        setContent("");
        setCodeSnippet("");
        setUploadedImages([]);
        setErrors({});
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);

        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });

        return { error: "Validation failed", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });

      return {
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="content" className="text-16-medium block mb-2">
          Your Solution
        </label>
        <DarkModeEditor
          value={content}
          onChange={(value?: string) => setContent(value || "")}
          height={350}
          placeholder="Explain your solution in detail. Use markdown for formatting..."
        />
        {errors.content && (
          <p className="startup-form_error">{errors.content}</p>
        )}
      </div>

      <div>
        <label htmlFor="codeSnippet" className="text-16-medium block mb-2">
          Code Solution (Optional)
        </label>
        <div className="mb-3">
          <label htmlFor="solutionCodeLanguage" className="text-14-medium block mb-2">
            Select Language
          </label>
          <select
            id="solutionCodeLanguage"
            className="startup-form_input"
            value={codeLanguage}
            onChange={(e) => setCodeLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
            <option value="ruby">Ruby</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="php">PHP</option>
            <option value="swift">Swift</option>
            <option value="kotlin">Kotlin</option>
            <option value="sql">SQL</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
        </div>
        <div className="rounded-[20px] overflow-hidden border-3 border-black shadow-100">
          <Editor
            height="250px"
            language={codeLanguage}
            value={codeSnippet}
            onChange={(value) => setCodeSnippet(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              lineNumbers: "on",
              roundedSelection: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              fontFamily: "Monaco, 'Courier New', monospace",
              fontWeight: "500",
            }}
          />
        </div>
        {errors.codeSnippet && (
          <p className="startup-form_error">{errors.codeSnippet}</p>
        )}
      </div>

      <div>
        <label htmlFor="images" className="text-16-medium block mb-2">
          Screenshots (Optional)
        </label>
        
        <div
          {...getRootProps()}
          className={`border-3 border-dashed rounded-[20px] p-6 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-primary bg-primary/10 scale-105"
              : "border-black hover:border-primary"
          } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} disabled={isUploading} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-primary" />
          {isDragActive ? (
            <p className="text-14-medium">Drop the images here...</p>
          ) : (
            <>
              <p className="text-14-medium mb-1">
                Drag & drop images or click to select
              </p>
              <p className="text-12-normal text-black-300">
                PNG, JPG, GIF up to 5MB
              </p>
            </>
          )}
        </div>

        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {uploadedImages.map((url, index) => (
              <div key={index} className="relative group">
                <Image
                  src={url}
                  alt={`Upload ${index + 1}`}
                  width={150}
                  height={100}
                  className="rounded-lg object-cover w-full h-24"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {errors.images && <p className="startup-form_error">{errors.images}</p>}
      </div>

      <Button
        type="submit"
        className="startup-form_btn text-white w-full"
        disabled={isPending}
      >
        {isPending ? "Posting..." : "Post Solution"}
        <Send className="size-5 ml-2" />
      </Button>
    </form>
  );
};

export default SolutionForm;
