import { Suspense } from "react";
import { getBugBySlug, getVoteCount, getUserVote } from "@/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { incrementBugViews } from "@/app/lib/actions";
import { 
  Code2, 
  Clock, 
  Eye, 
  MessageCircle, 
  CheckCircle2,
} from "lucide-react";
import { auth } from "@/app/lib/auth";
import SolutionsList from "@/components/SolutionsList";
import SolutionForm from "@/components/SolutionForm";
import VoteButton from "@/components/VoteButton";
import BugDetailContent from "@/components/BugDetailContent";
import BugActions from "@/components/BugActions";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const session = await auth();

  const bug = await getBugBySlug(slug);

  if (!bug) return notFound();

  // Increment views only once per user (non-blocking)
  incrementBugViews(bug.id, session?.user?.id);

  const voteCount = await getVoteCount(bug.id);
  const userVote = session?.user?.id 
    ? await getUserVote(session.user.id, bug.id)
    : null;

  const severityColors = {
    LOW: "bg-blue-100 text-blue-800 border-blue-300",
    MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-300",
    HIGH: "bg-orange-100 text-orange-800 border-orange-300",
    CRITICAL: "bg-red-100 text-red-800 border-red-300",
  };

  const statusColors = {
    OPEN: "bg-green-100 text-green-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    SOLVED: "bg-purple-100 text-purple-800",
    CLOSED: "bg-gray-100 text-gray-800",
  };

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <div className="flex gap-3 mb-4">
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${
              severityColors[bug.severity as keyof typeof severityColors]
            }`}
          >
            {bug.severity}
          </span>
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${
              statusColors[bug.status as keyof typeof statusColors]
            }`}
          >
            {bug.status === "IN_PROGRESS" ? "IN PROGRESS" : bug.status}
            {bug.status === "SOLVED" && <CheckCircle2 className="inline ml-1 size-4" />}
          </span>
        </div>

                <h1 className="heading !text-left">{bug.title}</h1>
      </section>

      <section className="section_container">
        {/* Bug Description, Code, and Images */}
        <BugDetailContent
          description={bug.description}
          codeSnippet={bug.codeSnippet}
          images={bug.images}
        />

        <div className="space-y-5 w-full">
          {/* Bug Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Code2 className="size-5 text-primary" />
              <span className="font-semibold">{bug.language}</span>
              {bug.framework && <span className="text-black-300">• {bug.framework}</span>}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              <span>{formatDate(bug.createdAt.toString())}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="size-5 text-primary" />
              <span>{bug.views} views</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="size-5 text-primary" />
              <span>{bug._count?.solutions || 0} solutions</span>
            </div>
          </div>

          {/* Author Info & Voting */}
          <div className="flex-between gap-5 p-5 bg-primary-100 rounded-xl border-2 border-black">
            <Link
              href={`/user/${bug.author.id}`}
              className="flex gap-3 items-center"
            >
              <Image
                src={bug.author.image || "/default-avatar.png"}
                alt={bug.author.name || "User"}
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg border-2 border-black"
              />
              <div>
                <p className="text-20-medium">{bug.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{bug.author.username}
                </p>
                <p className="text-sm text-primary font-bold">
                  {bug.author.reputation} reputation
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <VoteButton
                targetId={bug.id}
                targetType="bug"
                initialVotes={voteCount.total}
                userId={session?.user?.id}
                authorId={bug.author.id}
                userVoteType={userVote?.type}
              />
              
              {session?.user?.id === bug.author.id && (
                <BugActions bugId={bug.id} bugSlug={slug} />
              )}
            </div>
          </div>

          <hr className="divider" />

          {/* Solutions Section */}
          <div className="mt-10">
            <h2 className="text-30-bold mb-6 flex items-center gap-2">
              <MessageCircle className="size-8" />
              Solutions ({bug.solutions.length})
            </h2>

            {bug.status !== "CLOSED" && session && (
              <div className="mb-8 p-6 bg-white border-4 border-black rounded-xl">
                <h3 className="text-20-medium mb-4">Post Your Solution</h3>
                <SolutionForm bugId={bug.id} />
              </div>
            )}

            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <SolutionsList
                solutions={bug.solutions}
                bugAuthorId={bug.author.id}
                bugSlug={slug}
                currentUserId={session?.user?.id}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
