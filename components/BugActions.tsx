"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteBug } from "@/app/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface BugActionsProps {
  bugId: string;
  bugSlug: string;
}

const BugActions = ({ bugId, bugSlug }: BugActionsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    const confirmation = prompt(
      'This will delete the bug and ALL its solutions and comments. Type "DELETE" to confirm:'
    );

    if (confirmation !== "DELETE") {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteBug(bugId);

      if (result.status === "SUCCESS") {
        toast({
          title: "Bug Deleted",
          description: "The bug and all related data have been removed",
        });
        router.push("/");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete bug",
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
        className="border-3 border-black hover:bg-gray-100 font-bold"
        onClick={() => router.push(`/bug/${bugSlug}/edit`)}
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Bug
      </Button>
      
      <Button
        variant="outline"
        className="border-3 border-red-500 text-red-500 hover:bg-red-50 font-bold"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        {isDeleting ? "Deleting..." : "Delete Bug"}
      </Button>
    </div>
  );
};

export default BugActions;
