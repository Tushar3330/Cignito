import BugForm from "@/components/BugForm";
import { auth } from "../../../lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Post Your Bug</h1>
        <p className="sub-heading !max-w-3xl">
          Share the coding issue you're facing and get help from the community
        </p>
      </section>

      <BugForm />
    </>
  );
};

export default Page;