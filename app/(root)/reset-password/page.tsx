import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black uppercase mb-2">
            <span className="text-primary">Reset</span>{" "}
            <span className="text-secondary">Password</span>
          </h1>
          <p className="text-gray-600">
            Enter your new password. 
          </p>
        </div>
        <Suspense fallback={
          <div className="bg-white border-[5px] border-black rounded-[22px] shadow-200 p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-12 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-12 bg-gray-200 rounded-full"></div>
              <div className="h-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
