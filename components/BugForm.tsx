"use client";

import React, { useState, useActionState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Upload, X } from "lucide-react";
import { bugFormSchema } from "./../app/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createBug } from "./../app/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import DarkModeEditor from "./DarkModeEditor";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const PROGRAMMING_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "Go",
  "Rust",
  "PHP",
  "Swift",
  "Kotlin",
  "Dart",
  "SQL",
  "HTML/CSS",
  "Other",
];

const SEVERITY_LEVELS = [
  { value: "LOW", label: "Low", color: "bg-blue-100" },
  { value: "MEDIUM", label: "Medium", color: "bg-yellow-100" },
  { value: "HIGH", label: "High", color: "bg-orange-100" },
  { value: "CRITICAL", label: "Critical", color: "bg-red-100" },
];

const BugForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [description, setDescription] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Trigger file input click
  const handleUploadClick = () => {
    console.log("🔵 Upload button clicked!");
    fileInputRef.current?.click();
  };

  // Direct file input handler
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("🔥 FILE SELECT TRIGGERED!", e.target.files);
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.log("❌ No files selected");
      return;
    }

    console.log("✅ Files selected:", files.length);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    console.log("Cloudinary config:", { cloudName, uploadPreset });

    if (!cloudName || !uploadPreset) {
      toast({
        title: "Configuration Error",
        description: "Cloudinary is not configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    const fileArray = Array.from(files);
    const uploadPromises = fileArray.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        console.log("Uploading to:", uploadUrl);

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Upload error:", errorData);
          throw new Error(errorData.error?.message || "Upload failed");
        }

        const data = await response.json();
        console.log("Upload success:", data.secure_url);
        return data.secure_url;
      } catch (error) {
        console.error("Upload failed:", error);
        toast({
          title: "Upload Failed",
          description: error instanceof Error ? error.message : "Failed to upload image",
          variant: "destructive",
        });
        return null;
      }
    });

    const urls = await Promise.all(uploadPromises);
    const validUrls = urls.filter((url): url is string => url !== null);

    setUploadedImages((prev) => [...prev, ...validUrls]);
    setIsUploading(false);

    // Reset the file input
    e.target.value = "";

    if (validUrls.length > 0) {
      toast({
        title: "Success",
        description: `${validUrls.length} image(s) uploaded successfully`,
      });
    } else {
      toast({
        title: "Upload Failed",
        description: "No images were uploaded successfully. Check console for details.",
        variant: "destructive",
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      // Add description and code snippet from state to formData
      formData.set("description", description);
      formData.set("codeSnippet", codeSnippet);
      formData.set("images", uploadedImages.join(","));
      
      const formValues = {
        title: formData.get("title") as string,
        description: description,
        codeSnippet: codeSnippet,
        language: formData.get("language") as string,
        framework: formData.get("framework") as string,
        severity: formData.get("severity") as string,
        images: uploadedImages.join(","),
      };

      await bugFormSchema.parseAsync(formValues);

      const result = await createBug(prevState, formData);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your bug has been created successfully",
        });

        router.push(`/bug/${result.slug}`);
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
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Bug Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Describe the bug in one line..."
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <DarkModeEditor
          value={description}
          onChange={(value?: string) => setDescription(value || "")}
          height={400}
          placeholder="Describe the bug in detail. Include error messages, expected behavior, and actual behavior..."
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="codeSnippet" className="startup-form_label">
          Code Snippet (Optional)
        </label>
        <div className="mb-3">
          <label htmlFor="codeLanguage" className="text-14-medium block mb-2">
            Select Language
          </label>
          <select
            id="codeLanguage"
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
            height="300px"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="language" className="startup-form_label">
            Programming Language
          </label>
          <select
            id="language"
            name="language"
            className="startup-form_input"
            required
          >
            <option value="">Select Language</option>
            {PROGRAMMING_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          {errors.language && (
            <p className="startup-form_error">{errors.language}</p>
          )}
        </div>

        <div>
          <label htmlFor="framework" className="startup-form_label">
            Framework (Optional)
          </label>
          <Input
            id="framework"
            name="framework"
            className="startup-form_input"
            placeholder="e.g., React, Django, Spring Boot..."
          />
          {errors.framework && (
            <p className="startup-form_error">{errors.framework}</p>
          )}
        </div>
      </div>

      <div>
        <label className="startup-form_label">Severity Level</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          {SEVERITY_LEVELS.map((level) => (
            <label
              key={level.value}
              className={`${level.color} border-[3px] border-black rounded-full p-4 cursor-pointer hover:scale-105 transition-transform text-center font-bold`}
            >
              <input
                type="radio"
                name="severity"
                value={level.value}
                className="sr-only peer"
                defaultChecked={level.value === "MEDIUM"}
              />
              <span className="peer-checked:underline">{level.label}</span>
            </label>
          ))}
        </div>
        {errors.severity && (
          <p className="startup-form_error">{errors.severity}</p>
        )}
      </div>

      <div>
        <label htmlFor="images" className="startup-form_label">
          Screenshots (Optional)
        </label>
        
        <div className="space-y-4">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            multiple
            onChange={handleFileSelect}
            disabled={isUploading}
            style={{ display: 'none' }}
          />
          
          {/* Clickable upload area */}
          <div
            onClick={handleUploadClick}
            className={`border-3 border-dashed rounded-[20px] p-8 text-center cursor-pointer transition-all ${
              isUploading
                ? "opacity-50 cursor-not-allowed border-gray-300"
                : "border-black hover:border-primary hover:bg-gray-50"
            }`}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
            {isUploading ? (
              <p className="text-16-medium">Uploading...</p>
            ) : (
              <>
                <p className="text-16-medium mb-2">
                  Click here to select images
                </p>
                <p className="text-14-normal text-black-300">
                  PNG, JPG, GIF, WEBP up to 5MB
                </p>
              </>
            )}
          </div>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedImages.map((url, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={url}
                    alt={`Upload ${index + 1}`}
                    width={200}
                    height={150}
                    className="rounded-xl object-cover w-full h-32"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {errors.images && <p className="startup-form_error">{errors.images}</p>}
      </div>

      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Posting..." : "Post Bug"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default BugForm;
