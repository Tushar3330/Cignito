import EnhancedBugForm from "@/components/EnhancedBugForm";
import { auth } from "../../../lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <>
      <section className="pink_container !min-h-[200px]">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="heading !text-[48px]"> Post Your Bug</h1>
          <p className="sub-heading !max-w-4xl !text-xl">
            Share your coding challenge with our community of expert developers
          </p>
        </div>
      </section>

      <section className="section_container !py-10">
        <EnhancedBugForm />
      </section>
    </>
  );
};

export default Page;
