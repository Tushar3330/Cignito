"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateBug } from "@/app/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Save, X } from "lucide-react";
import DarkModeEditor from "./DarkModeEditor";

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
  "Other",
];

const SEVERITY_LEVELS = [
  { value: "LOW", label: "🟢 Low", description: "Minor issue, workaround available" },
  { value: "MEDIUM", label: "🟡 Medium", description: "Affects functionality but not critical" },
  { value: "HIGH", label: "🟠 High", description: "Major issue, needs attention" },
  { value: "CRITICAL", label: "🔴 Critical", description: "Blocking issue, urgent fix needed" },
];

interface EditBugFormProps {
  bug: any;
}

const EditBugForm = ({ bug }: EditBugFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Parse existing images
  const existingImages = Array.isArray(bug.images) ? bug.images : [];
  const [description, setDescription] = useState(bug.description || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    formData.set("description", description);
    formData.set("images", existingImages.join(","));

    try {
      const result = await updateBug(bug.id, formData);

      if (result.status === "SUCCESS") {
        toast({
          title: "✅ Bug updated successfully!",
          description: "Your changes have been saved",
        });
        router.push(`/bug/${bug.slug}`);
        router.refresh();
      } else {
        if (result.errors) {
          const newErrors: Record<string, string> = {};
          Object.keys(result.errors).forEach((key) => {
            newErrors[key] = result.errors![key]?.join(", ") || "";
          });
          setErrors(newErrors);
        }
        toast({
          title: "Error",
          description: result.error || "Failed to update bug",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl border-4 border-black p-8 shadow-200 space-y-6">
        {/* Title */}
        <div>
          <label className="startup-form_label">
            Bug Title <span className="text-red-500">*</span>
          </label>
          <Input
            name="title"
            className="startup-form_input"
            placeholder="e.g., React useState not updating on first click"
            defaultValue={bug.title}
            required
          />
          {errors.title && <p className="startup-form_error">{errors.title}</p>}
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
              defaultValue={bug.language}
              required
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
              defaultValue={bug.framework || ""}
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
                  defaultChecked={bug.severity === level.value}
                  required
                />
                <div className="border-3 border-black rounded-xl p-3 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary hover:bg-gray-50 transition-all">
                  <div className="font-bold text-sm">{level.label}</div>
                  <div className="text-xs mt-1 opacity-70">{level.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.severity && <p className="startup-form_error">{errors.severity}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="startup-form_label">
            Description <span className="text-red-500">*</span>
          </label>
          <DarkModeEditor
            value={description}
            onChange={setDescription}
            placeholder="• What's the bug?
• What did you expect to happen?
• Steps to reproduce the bug"
          />
          {errors.description && <p className="startup-form_error">{errors.description}</p>}
        </div>

        {/* Code Snippet */}
        <div>
          <label className="startup-form_label">Code Snippet (Optional)</label>
          <textarea
            name="codeSnippet"
            className="startup-form_textarea"
            rows={10}
            placeholder="Paste your code here..."
            defaultValue={bug.codeSnippet || ""}
          />
        </div>

        {/* Existing Images Display */}
        {existingImages.length > 0 && (
          <div>
            <label className="startup-form_label">Attached Images</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingImages.map((url: string, index: number) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-32 object-cover rounded-xl border-3 border-black"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-black-300 mt-2">
              Note: Image editing is not available. Delete and recreate the bug if you need to change images.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            onClick={() => router.back()}
            variant="outline"
            className="flex-1 border-3 border-black rounded-full px-6 py-3 font-bold hover:bg-gray-100"
          >
            <X className="w-5 h-5 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 startup-form_btn"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditBugForm;
