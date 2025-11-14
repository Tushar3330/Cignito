"use client";

import React, { useState, useActionState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Send, Upload, X, Plus, Minus, Code2, Tag, 
  AlertCircle, CheckCircle2, Sparkles, Link as LinkIcon,
  FileText, Image as ImageIcon, Zap
} from "lucide-react";
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
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", 
  "Ruby", "Go", "Rust", "PHP", "Swift", "Kotlin", "Dart", 
  "SQL", "HTML/CSS", "Shell", "Other"
];

const FRAMEWORKS = {
  JavaScript: ["React", "Vue", "Angular", "Svelte", "Next.js", "Express", "Node.js"],
  TypeScript: ["React", "Angular", "Next.js", "Nest.js", "Deno"],
  Python: ["Django", "Flask", "FastAPI", "Pandas", "NumPy"],
  Java: ["Spring", "Spring Boot", "Hibernate", "JSF"],
  "C#": [".NET", "ASP.NET", "Unity", "Xamarin"],
  PHP: ["Laravel", "Symfony", "CodeIgniter", "WordPress"],
  Ruby: ["Rails", "Sinatra"],
  Go: ["Gin", "Echo", "Fiber"],
  Other: []
};

const SEVERITY_LEVELS = [
  { value: "LOW", label: "🟢 Low", desc: "Minor issue, workaround available" },
  { value: "MEDIUM", label: "🟡 Medium", desc: "Affects functionality but not critical" },
  { value: "HIGH", label: "🟠 High", desc: "Major functionality broken" },
  { value: "CRITICAL", label: "🔴 Critical", desc: "System down or data loss" },
];

interface CodeBlock {
  id: string;
  language: string;
  code: string;
  description: string;
}

const EnhancedBugForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [description, setDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState("");
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([
    { id: "1", language: "javascript", code: "", description: "Main code where bug occurs" }
  ]);
  
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Add new code block
  const addCodeBlock = () => {
    const newId = (codeBlocks.length + 1).toString();
    setCodeBlocks([
      ...codeBlocks,
      { id: newId, language: "javascript", code: "", description: "" }
    ]);
  };

  // Remove code block
  const removeCodeBlock = (id: string) => {
    if (codeBlocks.length > 1) {
      setCodeBlocks(codeBlocks.filter(block => block.id !== id));
    }
  };

  // Update code block
  const updateCodeBlock = (id: string, field: keyof CodeBlock, value: string) => {
    setCodeBlocks(codeBlocks.map(block => 
      block.id === id ? { ...block, [field]: value } : block
    ));
  };

  // Handle image upload
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast({
        title: "Configuration Error",
        description: "Cloudinary is not configured.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!response.ok) throw new Error("Upload failed");
        const data = await response.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setUploadedImages([...uploadedImages, ...uploadedUrls]);
      
      toast({
        title: "✅ Images uploaded!",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    
    // Combine all code blocks
    const combinedCode = codeBlocks
      .filter(block => block.code.trim())
      .map(block => {
        const desc = block.description ? `// ${block.description}\n` : '';
        return `${desc}\`\`\`${block.language}\n${block.code}\n\`\`\``;
      })
      .join('\n\n');

    formData.set("codeSnippet", combinedCode);
    formData.set("description", description);
    formData.set("images", uploadedImages.join(","));

    try {
      const result = await createBug(null, formData);

      if (result.status === "SUCCESS") {
        toast({
          title: "🎉 Bug posted successfully!",
          description: "Your bug has been shared with the community",
        });
        router.push(`/bug/${result.slug}`);
      } else {
        if (result.errors) {
          const newErrors: Record<string, string> = {};
          Object.keys(result.errors).forEach((key) => {
            newErrors[key] = result.errors![key]?.join(", ") || "";
          });
          setErrors(newErrors);
        }
        toast({
          title: "Validation Error",
          description: "Please check all fields and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const steps = [
    { num: 1, title: "Basic Info", icon: FileText },
    { num: 2, title: "Code & Details", icon: Code2 },
    { num: 3, title: "Images & Submit", icon: ImageIcon },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          {steps.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className={`w-14 h-14 rounded-full border-4 border-black flex items-center justify-center font-black text-lg transition-all ${
                    currentStep === step.num
                      ? "bg-primary text-white shadow-200 scale-110"
                      : currentStep > step.num
                      ? "bg-green-400 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {currentStep > step.num ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </button>
                <span className="text-xs font-bold mt-2">{step.title}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-20 h-1 ${currentStep > step.num ? 'bg-green-400' : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: Basic Info */}
        <div style={{ display: currentStep !== 1 ? 'none' : 'block' }} className="bg-white rounded-2xl border-4 border-black p-8 shadow-200 space-y-6">
          <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-24-black">Basic Information</h2>
                <p className="text-14-normal text-black-300">Let's start with the essentials</p>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="startup-form_label">
                Bug Title <span className="text-red-500">*</span>
              </label>
              <Input
                name="title"
                className="startup-form_input"
                placeholder="e.g., React useState not updating on first click"
                required
              />
              {errors.title && <p className="startup-form_error">{errors.title}</p>}
              <p className="text-xs text-black-300 mt-1">Be specific and descriptive</p>
            </div>

            {/* Language & Framework */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="startup-form_label">
                  Programming Language <span className="text-red-500">*</span>
                </label>
                <select
                  name="language"
                  className="startup-form_input"
                  required
                  onChange={(e) => setSelectedFramework("")}
                >
                  <option value="">Select Language</option>
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                {errors.language && <p className="startup-form_error">{errors.language}</p>}
              </div>

              <div>
                <label className="startup-form_label">Framework/Library (Optional)</label>
                <Input
                  name="framework"
                  className="startup-form_input"
                  placeholder="e.g., React, Django, Spring Boot"
                  value={selectedFramework}
                  onChange={(e) => setSelectedFramework(e.target.value)}
                />
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="startup-form_label">
                Severity Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SEVERITY_LEVELS.map((level) => (
                  <label
                    key={level.value}
                    className="relative cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={level.value}
                      className="peer sr-only"
                      required
                    />
                    <div className="border-3 border-black rounded-xl p-4 peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-200 hover:shadow-100 transition-all">
                      <p className="font-bold text-center">{level.label}</p>
                      <p className="text-xs text-center mt-1 opacity-75">{level.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.severity && <p className="startup-form_error">{errors.severity}</p>}
            </div>

            {/* Description - Dark Mode Markdown Editor */}
            <div>
              <label className="startup-form_label">
                Bug Description <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-black-300 mb-2">
                Supports Markdown: **bold**, *italic*, `code`, [links](url), etc.
              </p>
              <DarkModeEditor
                value={description}
                onChange={(value) => setDescription(value || "")}
                placeholder="Describe the bug in detail:
• What were you trying to do?
• What actually happened?
• What did you expect to happen?
• Steps to reproduce the bug"
              />
              {errors.description && <p className="startup-form_error">{errors.description}</p>}
            </div>

            <Button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="w-full startup-form_btn"
            >
              Next: Add Code <Code2 className="w-5 h-5 ml-2" />
            </Button>
          </div>

        {/* STEP 2: Code Blocks */}
        <div style={{ display: currentStep !== 2 ? 'none' : 'block' }} className="bg-white rounded-2xl border-4 border-black p-8 shadow-200 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-24-black">Code & Technical Details</h2>
                <p className="text-14-normal text-black-300">Add your code snippets</p>
              </div>
            </div>

            {/* Code Blocks */}
            {codeBlocks.map((block, index) => (
              <div
                key={block.id}
                className="border-3 border-black rounded-xl p-6 bg-gray-50 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">Code Block {index + 1}</h3>
                  {codeBlocks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCodeBlock(block.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Description (Optional)
                  </label>
                  <Input
                    value={block.description}
                    onChange={(e) => updateCodeBlock(block.id, "description", e.target.value)}
                    placeholder="e.g., Component file, API route, Config file"
                    className="startup-form_input"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Language</label>
                  <select
                    value={block.language}
                    onChange={(e) => updateCodeBlock(block.id, "language", e.target.value)}
                    className="startup-form_input"
                  >
                    {PROGRAMMING_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">Code</label>
                  <div className="border-3 border-black rounded-xl overflow-hidden">
                    <Editor
                      height="250px"
                      language={block.language}
                      value={block.code}
                      onChange={(value) => updateCodeBlock(block.id, "code", value || "")}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Code Block Button */}
            <button
              type="button"
              onClick={addCodeBlock}
              className="w-full border-3 border-dashed border-black rounded-xl p-4 hover:bg-gray-50 transition-all group"
            >
              <div className="flex items-center justify-center gap-2 text-black-300 group-hover:text-black">
                <Plus className="w-5 h-5" />
                <span className="font-bold">Add Another Code Block</span>
              </div>
            </button>

            {/* Tags */}
            <div>
              <label className="startup-form_label">Tags (comma-separated)</label>
              <Input
                name="tags"
                className="startup-form_input"
                placeholder="e.g., react, hooks, async, performance"
              />
              <p className="text-xs text-black-300 mt-1">Help others find your bug</p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-gray-200 text-black border-3 border-black rounded-full px-6 py-3 font-bold hover:bg-gray-300"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex-1 startup-form_btn"
              >
                Next: Add Images <ImageIcon className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

        {/* STEP 3: Images & Submit */}
        <div style={{ display: currentStep !== 3 ? 'none' : 'block' }} className="bg-white rounded-2xl border-4 border-black p-8 shadow-200 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-24-black">Visual Evidence & Submit</h2>
                <p className="text-14-normal text-black-300">Screenshots help a lot!</p>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="startup-form_label">Screenshots (Optional)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={isUploading}
                className="w-full border-3 border-dashed border-black rounded-xl p-8 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-12 h-12 text-black-300" />
                  <div>
                    <p className="font-bold text-lg">
                      {isUploading ? "Uploading..." : "Click to upload images"}
                    </p>
                    <p className="text-sm text-black-300">
                      Error screenshots, console logs, etc.
                    </p>
                  </div>
                </div>
              </button>

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={url}
                        alt={`Upload ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded-xl border-3 border-black"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Repository Link */}
            <div>
              <label className="startup-form_label">Repository Link (Optional)</label>
              <div className="flex gap-2">
                <LinkIcon className="w-5 h-5 text-black-300 mt-3" />
                <Input
                  name="repoLink"
                  type="url"
                  className="startup-form_input"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex-1 bg-gray-200 text-black border-3 border-black rounded-full px-6 py-3 font-bold hover:bg-gray-300"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isUploading}
                className="flex-1 bg-gradient-to-r from-primary to-pink-600 text-white border-3 border-black rounded-full px-6 py-3 font-black text-lg hover:scale-105 transition-all shadow-200 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Post Bug & Get Help
              </Button>
            </div>
          </div>
      </form>
    </div>
  );
};

export default EnhancedBugForm;
