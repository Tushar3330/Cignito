"use server";

import { auth } from "./auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Severity, BugStatus, VoteType } from "@prisma/client";

// Bug Actions
export const createBug = async (state: any, form: FormData) => {
  const session = await auth();

  if (!session || !session.user?.id)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

  const {
    title,
    description,
    codeSnippet,
    language,
    framework,
    severity,
    images,
  } = Object.fromEntries(form);

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    // Check if slug already exists
    const existingBug = await prisma.bug.findUnique({
      where: { slug },
    });

    if (existingBug) {
      return parseServerActionResponse({
        error: "A bug with this title already exists",
        status: "ERROR",
      });
    }

    const bug = await prisma.bug.create({
      data: {
        title: title as string,
        slug,
        description: description as string,
        codeSnippet: codeSnippet as string | undefined,
        language: language as string,
        framework: framework as string | undefined,
        severity: (severity as Severity) || "MEDIUM",
        images: images && (images as string).trim()
          ? (images as string).split(",").map((img) => img.trim()).filter(Boolean)
          : [],
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    revalidatePath("/");
    revalidatePath(`/bug/${slug}`);

    return parseServerActionResponse({
      ...bug,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error creating bug:", error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const updateBugStatus = async (
  bugId: string,
  status: BugStatus
) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  try {
    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
    });

    if (!bug) {
      return parseServerActionResponse({
        error: "Bug not found",
        status: "ERROR",
      });
    }

    if (bug.authorId !== session.user.id) {
      return parseServerActionResponse({
        error: "Unauthorized",
        status: "ERROR",
      });
    }

    const updatedBug = await prisma.bug.update({
      where: { id: bugId },
      data: { status },
    });

    revalidatePath(`/bug/${bug.slug}`);

    return parseServerActionResponse({
      ...updatedBug,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error updating bug status:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

// Update bug
export const updateBug = async (bugId: string, formData: FormData) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  try {
    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
    });

    if (!bug) {
      return parseServerActionResponse({
        error: "Bug not found",
        status: "ERROR",
      });
    }

    if (bug.authorId !== session.user.id) {
      return parseServerActionResponse({
        error: "Unauthorized",
        status: "ERROR",
      });
    }

    const {
      title,
      description,
      codeSnippet,
      language,
      framework,
      severity,
      images,
    } = Object.fromEntries(formData);

    const updatedBug = await prisma.bug.update({
      where: { id: bugId },
      data: {
        title: title as string,
        description: description as string,
        codeSnippet: codeSnippet as string | undefined,
        language: language as string,
        framework: framework as string | undefined,
        severity: (severity as Severity) || bug.severity,
        images: images && (images as string).trim()
          ? (images as string).split(",").map((img) => img.trim()).filter(Boolean)
          : [],
      },
    });

    revalidatePath(`/bug/${bug.slug}`);
    revalidatePath("/");

    return parseServerActionResponse({
      ...updatedBug,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error updating bug:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

// Delete bug with cascade (deletes all solutions, comments, votes)
export const deleteBug = async (bugId: string) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  try {
    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
      include: {
        solutions: {
          select: { id: true },
        },
      },
    });

    if (!bug) {
      return parseServerActionResponse({
        error: "Bug not found",
        status: "ERROR",
      });
    }

    if (bug.authorId !== session.user.id) {
      return parseServerActionResponse({
        error: "Unauthorized - Only the bug author can delete it",
        status: "ERROR",
      });
    }

    // Get all solution IDs to delete their related data
    const solutionIds = bug.solutions.map((s) => s.id);

    // Delete everything in a transaction for data integrity
    await prisma.$transaction([
      // Delete comments on solutions
      prisma.comment.deleteMany({
        where: { solutionId: { in: solutionIds } },
      }),
      // Delete votes on solutions
      prisma.vote.deleteMany({
        where: { solutionId: { in: solutionIds } },
      }),
      // Delete solutions
      prisma.solution.deleteMany({
        where: { bugId },
      }),
      // Delete comments on bug
      prisma.comment.deleteMany({
        where: { bugId },
      }),
      // Delete votes on bug
      prisma.vote.deleteMany({
        where: { bugId },
      }),
      // Delete bug views
      prisma.bugView.deleteMany({
        where: { bugId },
      }),
      // Delete bug tags relation
      prisma.bugTag.deleteMany({
        where: { bugId },
      }),
      // Finally delete the bug itself
      prisma.bug.delete({
        where: { id: bugId },
      }),
    ]);

    revalidatePath("/");

    return parseServerActionResponse({
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error deleting bug:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const incrementBugViews = async (bugId: string, userId?: string) => {
  try {
    // Check if this user already viewed this bug
    if (userId) {
      const existingView = await prisma.bugView.findUnique({
        where: {
          userId_bugId: {
            userId,
            bugId,
          },
        },
      });

      // If user already viewed, don't increment
      if (existingView) {
        return { success: true, alreadyViewed: true };
      }

      // Create a new view record for this user
      await prisma.bugView.create({
        data: {
          userId,
          bugId,
        },
      });
    }

    // Increment the view count
    await prisma.bug.update({
      where: { id: bugId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return { success: true, alreadyViewed: false };
  } catch (error) {
    console.error("Error incrementing views:", error);
    return { success: false };
  }
};

// Solution Actions
export const createSolution = async (
  bugId: string,
  formData: FormData
) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  const { content, codeSnippet, images } = Object.fromEntries(formData);

  try {
    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
    });

    if (!bug) {
      return parseServerActionResponse({
        error: "Bug not found",
        status: "ERROR",
      });
    }

    // Check if this user already viewed this bug
    const existingView = await prisma.bugView.findUnique({
      where: {
        userId_bugId: {
          userId: session.user.id,
          bugId,
        },
      },
    });

    // If user hasn't viewed yet, create view record and increment count
    if (!existingView) {
      await prisma.bugView.create({
        data: {
          userId: session.user.id,
          bugId,
        },
      });

      await prisma.bug.update({
        where: { id: bugId },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    }

    const solution = await prisma.solution.create({
      data: {
        content: content as string,
        codeSnippet: codeSnippet as string | undefined,
        images: images && (images as string).trim() 
          ? (images as string).split(",").map((img) => img.trim()).filter(Boolean)
          : [],
        bugId,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    revalidatePath(`/bug/${bug.slug}`);

    return parseServerActionResponse({
      ...solution,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error creating solution:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const acceptSolution = async (solutionId: string) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  try {
    const solution = await prisma.solution.findUnique({
      where: { id: solutionId },
      include: { bug: true },
    });

    if (!solution) {
      return parseServerActionResponse({
        error: "Solution not found",
        status: "ERROR",
      });
    }

    // Only bug author can accept solutions
    if (solution.bug.authorId !== session.user.id) {
      return parseServerActionResponse({
        error: "Only the bug author can accept solutions",
        status: "ERROR",
      });
    }

    // Unaccept all other solutions for this bug
    await prisma.solution.updateMany({
      where: { bugId: solution.bugId },
      data: { isAccepted: false },
    });

    // Accept this solution
    const acceptedSolution = await prisma.solution.update({
      where: { id: solutionId },
      data: { isAccepted: true },
    });

    // Update bug status to SOLVED
    await prisma.bug.update({
      where: { id: solution.bugId },
      data: { status: "SOLVED" },
    });

    // Increase solver's reputation
    await prisma.user.update({
      where: { id: solution.authorId },
      data: {
        reputation: {
          increment: 15,
        },
      },
    });

    revalidatePath(`/bug/${solution.bug.slug}`);

    return parseServerActionResponse({
      ...acceptedSolution,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error accepting solution:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

// Vote Actions
export const voteBug = async (bugId: string, voteType: VoteType) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  try {
    // Get the bug to check ownership
    const bug = await prisma.bug.findUnique({
      where: { id: bugId },
      select: { authorId: true, slug: true },
    });

    if (!bug) {
      return parseServerActionResponse({
        error: "Bug not found",
        status: "ERROR",
      });
    }

    // ❌ BLOCK: Users cannot vote on their own bugs
    if (bug.authorId === session.user.id) {
      return parseServerActionResponse({
        error: "You cannot vote on your own bug",
        status: "ERROR",
      });
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_bugId: {
          userId: session.user.id,
          bugId,
        },
      },
    });

    const voteValue = voteType === "UPVOTE" ? 1 : -1;

    if (existingVote) {
      // If same vote type, remove the vote (toggle off)
      if (existingVote.type === voteType) {
        await prisma.$transaction([
          prisma.vote.delete({
            where: { id: existingVote.id },
          }),
          // Reverse the reputation change
          prisma.user.update({
            where: { id: bug.authorId },
            data: {
              reputation: {
                decrement: voteValue * 2,
              },
            },
          }),
        ]);
      } else {
        // Change vote type (upvote -> downvote or vice versa)
        // This is a 2x swing: remove old vote effect, add new vote effect
        const reputationChange = voteValue * 2 - existingVote.value * 2;
        
        await prisma.$transaction([
          prisma.vote.update({
            where: { id: existingVote.id },
            data: { type: voteType, value: voteValue },
          }),
          prisma.user.update({
            where: { id: bug.authorId },
            data: {
              reputation: {
                increment: reputationChange,
              },
            },
          }),
        ]);
      }
    } else {
      // Create new vote
      await prisma.$transaction([
        prisma.vote.create({
          data: {
            userId: session.user.id,
            bugId,
            type: voteType,
            value: voteValue,
          },
        }),
        // Increase/decrease bug author's reputation
        prisma.user.update({
          where: { id: bug.authorId },
          data: {
            reputation: {
              increment: voteValue * 2,
            },
          },
        }),
      ]);
    }

    revalidatePath(`/bug/${bug.slug}`);
    revalidatePath('/');

    return parseServerActionResponse({
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error voting on bug:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const voteSolution = async (solutionId: string, voteType: VoteType) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  try {
    // Get the solution to check ownership
    const solution = await prisma.solution.findUnique({
      where: { id: solutionId },
      include: { bug: { select: { slug: true } } },
    });

    if (!solution) {
      return parseServerActionResponse({
        error: "Solution not found",
        status: "ERROR",
      });
    }

    // ❌ BLOCK: Users cannot vote on their own solutions
    if (solution.authorId === session.user.id) {
      return parseServerActionResponse({
        error: "You cannot vote on your own solution",
        status: "ERROR",
      });
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_solutionId: {
          userId: session.user.id,
          solutionId,
        },
      },
    });

    const voteValue = voteType === "UPVOTE" ? 1 : -1;

    if (existingVote) {
      // If same vote type, remove the vote (toggle off)
      if (existingVote.type === voteType) {
        await prisma.$transaction([
          prisma.vote.delete({
            where: { id: existingVote.id },
          }),
          // Reverse the reputation change
          prisma.user.update({
            where: { id: solution.authorId },
            data: {
              reputation: {
                decrement: voteValue * 3,
              },
            },
          }),
        ]);
      } else {
        // Change vote type (upvote -> downvote or vice versa)
        // This is a 2x swing: remove old vote effect, add new vote effect
        const reputationChange = voteValue * 3 - existingVote.value * 3;
        
        await prisma.$transaction([
          prisma.vote.update({
            where: { id: existingVote.id },
            data: { type: voteType, value: voteValue },
          }),
          prisma.user.update({
            where: { id: solution.authorId },
            data: {
              reputation: {
                increment: reputationChange,
              },
            },
          }),
        ]);
      }
    } else {
      // Create new vote
      await prisma.$transaction([
        prisma.vote.create({
          data: {
            userId: session.user.id,
            solutionId,
            type: voteType,
            value: voteValue,
          },
        }),
        // Increase/decrease solution author's reputation
        prisma.user.update({
          where: { id: solution.authorId },
          data: {
            reputation: {
              increment: voteValue * 3,
            },
          },
        }),
      ]);
    }

    revalidatePath(`/bug/${solution.bug.slug}`);
    revalidatePath('/');

    return parseServerActionResponse({
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error voting on solution:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

// Comment Actions
export const createComment = async (
  content: string,
  bugId?: string,
  solutionId?: string
) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: session.user.id,
        bugId,
        solutionId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    // Revalidate the appropriate page
    if (bugId) {
      const bug = await prisma.bug.findUnique({
        where: { id: bugId },
        select: { slug: true },
      });
      if (bug) {
        revalidatePath(`/bug/${bug.slug}`);
      }
    }

    return parseServerActionResponse({
      ...comment,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

// Solution-specific comment actions
export const addSolutionComment = async (solutionId: string, content: string) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  if (!content.trim()) {
    return parseServerActionResponse({
      error: "Comment cannot be empty",
      status: "ERROR",
    });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: session.user.id,
        solutionId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    // Revalidate solution page
    const solution = await prisma.solution.findUnique({
      where: { id: solutionId },
      include: { bug: { select: { slug: true } } },
    });

    if (solution) {
      revalidatePath(`/bug/${solution.bug.slug}/solution/${solutionId}`);
    }

    return parseServerActionResponse({
      ...comment,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const deleteSolutionComment = async (commentId: string) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        solution: {
          include: { bug: { select: { slug: true } } },
        },
      },
    });

    if (!comment) {
      return parseServerActionResponse({
        error: "Comment not found",
        status: "ERROR",
      });
    }

    if (comment.authorId !== session.user.id) {
      return parseServerActionResponse({
        error: "Unauthorized",
        status: "ERROR",
      });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    // Revalidate solution page
    if (comment.solution) {
      revalidatePath(`/bug/${comment.solution.bug.slug}/solution/${comment.solutionId}`);
    }

    return parseServerActionResponse({
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

// Delete solution
export const deleteSolution = async (solutionId: string) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  try {
    const solution = await prisma.solution.findUnique({
      where: { id: solutionId },
      include: { bug: { select: { slug: true } } },
    });

    if (!solution) {
      return parseServerActionResponse({
        error: "Solution not found",
        status: "ERROR",
      });
    }

    if (solution.authorId !== session.user.id) {
      return parseServerActionResponse({
        error: "Unauthorized",
        status: "ERROR",
      });
    }

    // Delete all related data (comments, votes)
    await prisma.$transaction([
      prisma.comment.deleteMany({ where: { solutionId } }),
      prisma.vote.deleteMany({ where: { solutionId } }),
      prisma.solution.delete({ where: { id: solutionId } }),
    ]);

    revalidatePath(`/bug/${solution.bug.slug}`);

    return parseServerActionResponse({
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error deleting solution:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

// Server Action wrapper for getting solution comments
export async function getSolutionCommentsAction(solutionId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: { solutionId },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

// Follow/Unfollow Actions
export async function followUser(userIdToFollow: string) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  if (session.user.id === userIdToFollow) {
    return parseServerActionResponse({
      error: "You cannot follow yourself",
      status: "ERROR",
    });
  }

  try {
    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userIdToFollow,
        },
      },
    });

    if (existingFollow) {
      return parseServerActionResponse({
        error: "Already following this user",
        status: "ERROR",
      });
    }

    // Create follow relationship
    await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: userIdToFollow,
      },
    });

    revalidatePath(`/user/${userIdToFollow}`);

    return parseServerActionResponse({
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error following user:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
}

export async function unfollowUser(userIdToUnfollow: string) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userIdToUnfollow,
        },
      },
    });

    revalidatePath(`/user/${userIdToUnfollow}`);

    return parseServerActionResponse({
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
}

// Get follow statistics
export async function getFollowStats(userId: string) {
  try {
    const [followersCount, followingCount] = await Promise.all([
      prisma.follow.count({ where: { followingId: userId } }),
      prisma.follow.count({ where: { followerId: userId } }),
    ]);

    return { followersCount, followingCount };
  } catch (error) {
    console.error("Error fetching follow stats:", error);
    return { followersCount: 0, followingCount: 0 };
  }
}

// Check if current user follows another user
export async function checkIsFollowing(userIdToCheck: string) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return false;
  }

  try {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userIdToCheck,
        },
      },
    });

    return !!follow;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}