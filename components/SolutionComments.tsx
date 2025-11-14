"use client";

import { useState, useEffect } from "react";
import { getSolutionCommentsAction, addSolutionComment, deleteSolutionComment } from "@/app/lib/actions";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
}

interface SolutionCommentsProps {
  solutionId: string;
  currentUserId?: string;
}

const SolutionComments = ({ solutionId, currentUserId }: SolutionCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
  }, [solutionId]);

  const loadComments = async () => {
    try {
      const data = await getSolutionCommentsAction(solutionId);
      setComments(data);
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !currentUserId) return;

    setIsSubmitting(true);

    try {
      const result = await addSolutionComment(solutionId, newComment);

      if (result.status === "SUCCESS") {
        toast({
          title: "Comment Posted!",
          description: "Your comment has been added successfully",
        });
        setNewComment("");
        loadComments(); // Reload comments
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to post comment",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const result = await deleteSolutionComment(commentId);

      if (result.status === "SUCCESS") {
        toast({
          title: "Comment Deleted",
          description: "Your comment has been removed",
        });
        loadComments();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete comment",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts, ask questions, or provide suggestions..."
            className="min-h-[120px] border-3 border-black rounded-xl resize-none"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="bg-primary hover:bg-primary/90 text-white font-bold border-3 border-black"
          >
            {isSubmitting ? (
              "Posting..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </>
            )}
          </Button>
        </form>
      ) : (
        <div className="bg-yellow-50 border-3 border-black rounded-xl p-4 text-center">
          <p className="font-semibold">
            Please <Link href="/signin" className="text-primary hover:underline">sign in</Link> to comment
          </p>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-black">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-16-medium text-black-300">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 border-2 border-black rounded-xl p-4 hover:shadow-100 transition-shadow"
            >
              <div className="flex items-start gap-3">
                <Link href={`/user/${comment.author.id}`}>
                  <Image
                    src={comment.author.image || "/default-avatar.png"}
                    alt={comment.author.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-black"
                  />
                </Link>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <Link
                        href={`/user/${comment.author.id}`}
                        className="font-bold hover:text-primary transition-colors"
                      >
                        {comment.author.name}
                      </Link>
                      <span className="text-sm text-black-300 ml-2">
                        @{comment.author.username}
                      </span>
                      <span className="text-sm text-black-300 ml-2">
                        • {formatDate(comment.createdAt.toString())}
                      </span>
                    </div>

                    {currentUserId === comment.author.id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-16-medium text-black-300 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SolutionComments;
