import { Suspense } from "react";
import { getSolutionById, getVoteCount, getUserVote } from "@/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Code2, 
  Clock, 
  Trophy,
  ArrowLeft,
  MessageCircle,
  Edit,
  Trash2,
  CheckCircle2
} from "lucide-react";
import { auth } from "@/app/lib/auth";
import ReactMarkdown from "react-markdown";
import VoteButton from "@/components/VoteButton";
import SolutionComments from "@/components/SolutionComments";
import SolutionActions from "@/components/SolutionActions";

const SolutionDetailPage = async ({ 
  params 
}: { 
  params: Promise<{ slug: string; id: string }> 
}) => {
  const { slug, id } = await params;
  const session = await auth();

  const solution = await getSolutionById(id);

  if (!solution) return notFound();

  const voteCount = await getVoteCount(undefined, solution.id);
  const userVote = session?.user?.id 
    ? await getUserVote(session.user.id, undefined, solution.id)
    : null;

  const isAuthor = session?.user?.id === solution.author.id;

  // Filter out empty strings from images array
  const validImages = solution.images?.filter(img => img && img.trim() !== '') || [];

  return (
    <>
      <section className="pink_container !min-h-[200px]">
        <Link 
          href={`/bug/${slug}`}
          className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors mb-4 font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Bug
        </Link>

        <h1 className="heading !text-left">
          {solution.isAccepted && <Trophy className="inline mr-3 text-yellow-400" />}
          Solution to: {solution.bug.title}
        </h1>
        
        {solution.isAccepted && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-full font-bold border-3 border-white">
            <CheckCircle2 className="w-5 h-5" />
            Accepted Solution
          </div>
        )}
      </section>

      <section className="section_container">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Author Info & Actions */}
          <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-200">
            <div className="flex items-start justify-between">
              <Link
                href={`/user/${solution.author.id}`}
                className="flex gap-4 items-center group"
              >
                <Image
                  src={solution.author.image || "/default-avatar.png"}
                  alt={solution.author.name || "User"}
                  width={64}
                  height={64}
                  className="rounded-full border-3 border-black group-hover:scale-110 transition-transform"
                />
                <div>
                  <p className="text-20-medium group-hover:text-primary transition-colors">
                    {solution.author.name}
                  </p>
                  <p className="text-16-medium !text-black-300">
                    @{solution.author.username}
                  </p>
                  <p className="text-sm text-primary font-bold">
                    {solution.author.reputation} reputation
                  </p>
                  <p className="text-sm text-black-300 mt-1">
                    <Clock className="inline w-4 h-4 mr-1" />
                    {formatDate(solution.createdAt.toString())}
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                <VoteButton
                  targetId={solution.id}
                  targetType="solution"
                  initialVotes={voteCount.total}
                  userId={session?.user?.id}
                  authorId={solution.author.id}
                  userVoteType={userVote?.type}
                />

                {isAuthor && (
                  <SolutionActions 
                    solutionId={solution.id}
                    bugSlug={slug}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Solution Content */}
          <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-200">
            <h2 className="text-24-bold mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" />
              Solution Explanation
            </h2>
            
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-32-bold mb-4 border-b-2 border-black pb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-26-semibold mb-3 border-b border-black-100 pb-2">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-20-medium mb-2">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-16-medium mb-4 leading-relaxed text-black-300">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-2 text-16-medium">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-2 text-16-medium">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-black-300 ml-4">{children}</li>
                  ),
                  code: ({ inline, children, ...props }: any) => {
                    return inline ? (
                      <code className="bg-primary/10 text-primary px-2 py-1 rounded font-mono text-sm font-semibold border border-primary/20">
                        {children}
                      </code>
                    ) : (
                      <code
                        className="block bg-black-200 text-white p-4 rounded-lg overflow-x-auto font-mono text-sm my-4 border-3 border-black"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary bg-primary/5 pl-4 py-2 my-4 italic">
                      {children}
                    </blockquote>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-primary hover:underline font-semibold"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-black">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-black">{children}</em>
                  ),
                }}
              >
                {solution.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Code Snippet */}
          {solution.codeSnippet && (
            <div className="bg-white border-4 border-black rounded-2xl overflow-hidden shadow-200">
              <div className="flex items-center gap-2 bg-black text-white px-6 py-4">
                <Code2 className="w-5 h-5" />
                <span className="text-18-medium font-bold">Code Solution</span>
              </div>
              <pre className="overflow-x-auto bg-black-100 p-6">
                <code className="text-white-100 text-sm font-work-sans">
                  {solution.codeSnippet}
                </code>
              </pre>
            </div>
          )}

          {/* Images */}
          {validImages && validImages.length > 0 && (
            <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-200">
              <h3 className="text-20-medium mb-4 flex items-center gap-2">
                📸 Screenshots ({validImages.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {validImages.map((image, index) => (
                  <div
                    key={index}
                    className="rounded-xl overflow-hidden border-3 border-black shadow-100 hover:scale-105 transition-transform cursor-pointer"
                  >
                    <img
                      src={image}
                      alt={`Solution screenshot ${index + 1}`}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-200">
            <h2 className="text-24-bold mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" />
              Discussion ({solution._count?.comments || 0})
            </h2>
            
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <SolutionComments 
                solutionId={solution.id}
                currentUserId={session?.user?.id}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
};

export default SolutionDetailPage;
