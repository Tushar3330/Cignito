import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import SignInForm from "@/components/auth/SignInForm";

export default async function SignInPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-black mb-2">
            <span className="text-primary">Welcome</span> <span className="text-secondary">Back</span>
          </h1>
          <p className="text-black-100">
            Sign in to continue to <span className="text-primary font-bold">Cignito</span>
          </p>
        </div>

        <SignInForm />
      </div>
    </div>
  );
}
