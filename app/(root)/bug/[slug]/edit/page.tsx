import { auth } from "@/app/lib/auth";
import { getBugBySlug } from "@/lib/queries";
import { notFound, redirect } from "next/navigation";
import EditBugForm from "@/components/EditBugForm";

const EditBugPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const session = await auth();
  const { slug } = await params;

  if (!session || !session.user) {
    redirect("/");
  }

  const bug = await getBugBySlug(slug);

  if (!bug) {
    notFound();
  }

  // Check if user is the author
  if (bug.author.id !== session.user.id) {
    redirect(`/bug/${slug}`);
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-36-black">Edit Bug</h1>
        <p className="text-14-normal text-black-300 mt-2">
          Update your bug report details
        </p>
      </div>

      <EditBugForm bug={bug} />
    </div>
  );
};

export default EditBugPage;
