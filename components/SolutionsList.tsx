"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { CheckCircle2, Trophy, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoteButton from "@/components/VoteButton";
import { acceptSolution } from "@/app/lib/actions";
import { useToast } from "@/hooks/use-toast";

type Solution = {
  id: string;
  content: string;
  codeSnippet?: string | null;
  images?: string[];
  isAccepted: boolean;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    reputation: number;
  };
  votes?: any[];
  _count?: {
    comments: number;
  };
};

interface SolutionsListProps {
  solutions: Solution[];
  bugAuthorId: string;
  bugSlug: string;
  currentUserId?: string;
}

const SolutionsList = ({
  solutions,
  bugAuthorId,
  bugSlug,
  currentUserId,
}: SolutionsListProps) => {
  const { toast } = useToast();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const handleAcceptSolution = async (solutionId: string) => {
    setAcceptingId(solutionId);

    const result = await acceptSolution(solutionId);

    if (result.status === "SUCCESS") {
      toast({
        title: "Solution Accepted!",
        description: "This solution has been marked as the accepted answer",
      });
      window.location.reload();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to accept solution",
        variant: "destructive",
      });
    }

    setAcceptingId(null);
  };

  const calculateVoteScore = (votes: any[] = []) => {
    return votes.reduce((sum, vote) => sum + vote.value, 0);
  };

  if (solutions.length === 0) {
    return (
      <div className="text-center py-12 bg-primary-100 rounded-xl border-2 border-black">
        <p className="text-20-medium text-black-300">
          No solutions yet. Be the first to help solve this bug!
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {solutions.map((solution) => {
        const voteScore = calculateVoteScore(solution.votes);
        const isBugAuthor = currentUserId === bugAuthorId;
        const canAccept = isBugAuthor && !solution.isAccepted;
        
        // Filter out empty strings from images
        const validImages = solution.images?.filter(img => img && img.trim() !== '') || [];
        
        // Get preview of content (first 150 chars)
        const preview = solution.content.length > 150 
          ? solution.content.substring(0, 150) + "..."
          : solution.content;

        return (
          <div
            key={solution.id}
            className={`bg-white rounded-2xl border-4 shadow-200 hover:shadow-300 transition-all group ${
              solution.isAccepted
                ? "border-purple-500 bg-purple-50"
                : "border-black"
            }`}
          >
            <div className="p-5">
              {/* Accepted Badge */}
              {solution.isAccepted && (
                <div className="flex items-center gap-2 mb-3 text-purple-700 font-black text-sm">
                  <Trophy className="w-5 h-5" />
                  <span>ACCEPTED SOLUTION</span>
                </div>
              )}

              {/* Author Info */}
              <div className="flex items-start gap-3 mb-4">
                <Link href={`/user/${solution.author.id}`}>
                  <Image
                    src={solution.author.image || "/default-avatar.png"}
                    alt={solution.author.name || "User"}
                    width={48}
                    height={48}
                    className="rounded-full border-3 border-black hover:scale-110 transition-transform"
                  />
                </Link>
                
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/user/${solution.author.id}`}
                    className="font-bold hover:text-primary transition-colors"
                  >
                    {solution.author.name}
                  </Link>
                  <p className="text-sm text-black-300">
                    {solution.author.reputation} rep • {formatDate(solution.createdAt.toString())}
                  </p>
                </div>

                <VoteButton
                  targetId={solution.id}
                  targetType="solution"
                  initialVotes={voteScore}
                  userId={currentUserId}
                  authorId={solution.author.id}
                  userVoteType={
                    currentUserId && solution.votes
                      ? solution.votes.find((v: any) => v.userId === currentUserId)?.type
                      : undefined
                  }
                />
              </div>

              {/* Preview */}
              <p className="text-14-normal text-black-300 mb-4 line-clamp-3">
                {preview}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-4 mb-4 text-sm text-black-300">
                {solution.codeSnippet && (
                  <span className="flex items-center gap-1">
                    💻 Code included
                  </span>
                )}
                {validImages.length > 0 && (
                  <span className="flex items-center gap-1">
                    📸 {validImages.length} image{validImages.length > 1 ? 's' : ''}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {solution._count?.comments || 0}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/bug/${bugSlug}/solution/${solution.id}`}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full border-3 border-black hover:bg-primary hover:text-white transition-colors group"
                  >
                    View Solution
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                {canAccept && (
                  <Button
                    onClick={() => handleAcceptSolution(solution.id)}
                    disabled={acceptingId === solution.id}
                    size="sm"
                    className="bg-purple-500 hover:bg-purple-600 text-white border-3 border-black"
                  >
                    {acceptingId === solution.id ? (
                      "..."
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SolutionsList;
