"use client";

import { useState, useTransition } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { voteBug, voteSolution } from "@/app/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { VoteType } from "@prisma/client";

interface VoteButtonProps {
  targetId: string;
  targetType: "bug" | "solution";
  initialVotes: number;
  userId?: string;
  authorId: string; // The author of the bug/solution
  userVoteType?: VoteType; // Current user's vote type (if any)
}

const VoteButton = ({
  targetId,
  targetType,
  initialVotes,
  userId,
  authorId,
  userVoteType,
}: VoteButtonProps) => {
  const [votes, setVotes] = useState(initialVotes);
  const [currentVote, setCurrentVote] = useState<VoteType | null>(userVoteType || null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const isOwnContent = userId === authorId;

  const handleVote = (voteType: VoteType) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to vote",
        variant: "destructive",
      });
      return;
    }

    if (isOwnContent) {
      toast({
        title: "Cannot Vote",
        description: `You cannot vote on your own ${targetType}`,
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const action = targetType === "bug" ? voteBug : voteSolution;
      const result = await action(targetId, voteType);

      if (result.status === "SUCCESS") {
        // Calculate vote change based on previous state
        let voteChange = 0;
        
        if (currentVote === voteType) {
          // Toggle off - remove vote
          voteChange = voteType === "UPVOTE" ? -1 : 1;
          setCurrentVote(null);
        } else if (currentVote === null) {
          // New vote
          voteChange = voteType === "UPVOTE" ? 1 : -1;
          setCurrentVote(voteType);
        } else {
          // Change from upvote to downvote or vice versa (2x swing)
          voteChange = voteType === "UPVOTE" ? 2 : -2;
          setCurrentVote(voteType);
        }

        setVotes((prev) => prev + voteChange);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to vote",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleVote("UPVOTE")}
        disabled={isPending || isOwnContent}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black transition-colors",
          currentVote === "UPVOTE"
            ? "bg-green-500 text-white"
            : "bg-green-100 hover:bg-green-200",
          (isPending || isOwnContent) && "opacity-50 cursor-not-allowed"
        )}
        title={isOwnContent ? "Cannot vote on your own content" : "Upvote"}
      >
        <ThumbsUp className="size-5" />
      </button>

      <span className="text-24-black font-bold min-w-[3rem] text-center">
        {votes}
      </span>

      <button
        onClick={() => handleVote("DOWNVOTE")}
        disabled={isPending || isOwnContent}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black transition-colors",
          currentVote === "DOWNVOTE"
            ? "bg-red-500 text-white"
            : "bg-red-100 hover:bg-red-200",
          (isPending || isOwnContent) && "opacity-50 cursor-not-allowed"
        )}
        title={isOwnContent ? "Cannot vote on your own content" : "Downvote"}
      >
        <ThumbsDown className="size-5" />
      </button>
    </div>
  );
};

export default VoteButton;
