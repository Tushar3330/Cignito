"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { followUser, unfollowUser, checkIsFollowing } from "@/app/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface FollowButtonProps {
  userId: string;
  currentUserId?: string;
  className?: string;
}

const FollowButton = ({ userId, currentUserId, className }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkFollowStatus();
  }, [userId, currentUserId]);

  const checkFollowStatus = async () => {
    if (!currentUserId || currentUserId === userId) {
      setIsCheckingStatus(false);
      return;
    }

    try {
      const following = await checkIsFollowing(userId);
      setIsFollowing(following);
    } catch (error) {
      console.error("Error checking follow status:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow users",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = isFollowing 
        ? await unfollowUser(userId) 
        : await followUser(userId);

      if (result.status === "SUCCESS") {
        setIsFollowing(!isFollowing);
        toast({
          title: isFollowing ? "Unfollowed" : "Following!",
          description: isFollowing 
            ? "You have unfollowed this user" 
            : "You are now following this user",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button if user is viewing their own profile
  if (!currentUserId || currentUserId === userId) {
    return null;
  }

  if (isCheckingStatus) {
    return (
      <Button disabled className={className} variant="outline">
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading}
      className={className}
      variant={isFollowing ? "outline" : "default"}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : isFollowing ? (
        <UserMinus className="w-4 h-4 mr-2" />
      ) : (
        <UserPlus className="w-4 h-4 mr-2" />
      )}
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
