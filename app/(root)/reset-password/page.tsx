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
            Enter your new password
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
