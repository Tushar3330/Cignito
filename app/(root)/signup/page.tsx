import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import SignUpForm from "@/components/auth/SignUpForm";

export default async function SignUpPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-black mb-2">
            <span className="text-primary">Join</span> <span className="text-secondary">Cignito</span>
          </h1>
          <p className="text-black-100">
            Create an account to start <span className="text-primary font-bold">solving bugs</span>
          </p>
        </div>

        <SignUpForm />
      </div>
    </div>
  );
}
