"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteSolution } from "@/app/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SolutionActionsProps {
  solutionId: string;
  bugSlug: string;
}

const SolutionActions = ({ solutionId, bugSlug }: SolutionActionsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this solution? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteSolution(solutionId);

      if (result.status === "SUCCESS") {
        toast({
          title: "Solution Deleted",
          description: "Your solution has been removed",
        });
        router.push(`/bug/${bugSlug}`);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete solution",
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
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="border-2 border-black hover:bg-gray-100"
        onClick={() => router.push(`/bug/${bugSlug}/solution/${solutionId}/edit`)}
      >
        <Edit className="w-4 h-4 mr-1" />
        Edit
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="border-2 border-red-500 text-red-500 hover:bg-red-50"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="w-4 h-4 mr-1" />
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
};

export default SolutionActions;
