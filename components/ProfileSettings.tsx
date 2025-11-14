"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";
import { Github, Upload, Link as LinkIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { linkGitHub, linkGoogle } from "@/app/lib/link-actions";

interface LinkedAccount {
  provider: string;
  providerAccountId: string;
}

interface ProfileSettingsProps {
  userId: string;
  currentImage: string | null;
  linkedAccounts: LinkedAccount[];
  hasPassword: boolean;
}

export default function ProfileSettings({
  userId,
  currentImage,
  linkedAccounts,
  hasPassword,
}: ProfileSettingsProps) {
  const [image, setImage] = useState(currentImage);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const isGithubLinked = linkedAccounts.some((acc) => acc.provider === "github");
  const isGoogleLinked = linkedAccounts.some((acc) => acc.provider === "google");

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "Cignito"
      );

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dqtgmzibi";
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const imageUrl = data.secure_url;

      // Update user profile with new image
      const updateResponse = await fetch("/api/user/update-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update profile");
      }

      setImage(imageUrl);
    } catch (error) {
      setUploadError("Failed to upload image. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleLinkAccount(provider: "github" | "google") {
    try {
      if (provider === "github") {
        await linkGitHub(userId);
      } else {
        await linkGoogle(userId);
      }
    } catch (error) {
      console.error("Failed to link account:", error);
      alert("Failed to link account. Please try again.");
    }
  }

  return (
    <div className="bg-white border-[5px] border-black rounded-[22px] shadow-200 p-6 space-y-6">
      <h2 className="text-24-black font-bold uppercase">Profile Settings</h2>

      {/* Profile Picture */}
      <div className="space-y-3">
        <h3 className="text-16-medium font-bold text-primary uppercase">
          Profile Picture
        </h3>
        <div className="flex items-center gap-4">
          <Image
            src={image || "/default-avatar.png"}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full border-[3px] border-black object-cover"
          />
          <div className="flex-1">
            <label
              htmlFor="image-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-full border-[3px] border-black shadow-100 hover:shadow-200 transition-all cursor-pointer"
            >
              <Upload className="size-4" />
              {isUploading ? "Uploading..." : "Upload New Picture"}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="hidden"
            />
            {uploadError && (
              <p className="text-red-500 text-sm mt-2">{uploadError}</p>
            )}
            <p className="text-xs text-black-100 mt-2">
              Max size: 5MB. Supported formats: JPG, PNG, GIF
            </p>
          </div>
        </div>
      </div>

      {/* Linked Accounts */}
      <div className="space-y-3">
        <h3 className="text-16-medium font-bold text-primary uppercase">
          Linked Accounts
        </h3>
        
        {/* GitHub */}
        <div className="flex items-center justify-between p-4 bg-white border-[3px] border-black rounded-lg">
          <div className="flex items-center gap-3">
            <Github className="size-6" />
            <div>
              <p className="font-semibold">GitHub</p>
              {isGithubLinked && (
                <p className="text-sm text-black-100">Connected</p>
              )}
            </div>
          </div>
          {isGithubLinked ? (
            <Button
              variant="outline"
              className="border-[2px] border-black text-red-600 hover:bg-red-50"
              disabled
            >
              Linked
            </Button>
          ) : (
            <Button
              onClick={() => handleLinkAccount("github")}
              className="bg-black text-white hover:bg-black-200 border-[2px] border-black"
            >
              <LinkIcon className="size-4 mr-2" />
              Link Account
            </Button>
          )}
        </div>

        {/* Google */}
        <div className="flex items-center justify-between p-4 bg-white border-[3px] border-black rounded-lg">
          <div className="flex items-center gap-3">
            <FcGoogle className="size-6" />
            <div>
              <p className="font-semibold">Google</p>
              {isGoogleLinked && (
                <p className="text-sm text-black-100">Connected</p>
              )}
            </div>
          </div>
          {isGoogleLinked ? (
            <Button
              variant="outline"
              className="border-[2px] border-black text-red-600 hover:bg-red-50"
              disabled
            >
              Linked
            </Button>
          ) : (
            <Button
              onClick={() => handleLinkAccount("google")}
              className="bg-black text-white hover:bg-black-200 border-[2px] border-black"
            >
              <LinkIcon className="size-4 mr-2" />
              Link Account
            </Button>
          )}
        </div>
      </div>

      {/* Account Type Info */}
      <div className="p-4 bg-primary-100 border-[3px] border-black rounded-lg">
        <h4 className="font-bold text-black mb-2">Account Type</h4>
        <p className="text-sm text-black-100">
          {hasPassword
            ? "You can sign in with email/password and any linked accounts"
            : "You're using OAuth sign-in. Link multiple accounts for more options."}
        </p>
      </div>
    </div>
  );
}
