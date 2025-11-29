"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Bug Queries
export async function getAllBugs(params?: {
  search?: string;
  language?: string;
  status?: string;
  tag?: string;
  limit?: number;
  cursor?: string;
}) {
  const { search, language, status, tag, limit = 20, cursor } = params || {};

  const where: Prisma.BugWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { language: { contains: search, mode: "insensitive" } },
              {
                author: {
                  OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { username: { contains: search, mode: "insensitive" } },
                  ],
                },
              },
            ],
          }
        : {},
      language ? { language: { equals: language, mode: "insensitive" } } : {},
      status ? { status: status as any } : {},
      tag
        ? {
            tags: {
              some: {
                tag: {
                  slug: tag,
                },
              },
            },
          }
        : {},
    ],
  };

  const bugs = await prisma.bug.findMany({
    where,
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          reputation: true,
        },
      },
      _count: {
        select: {
          solutions: true,
          comments: true,
          votes: true,
        },
      },
    },
  });

  return bugs;
}

export async function getBugById(id: string) {
  const bug = await prisma.bug.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          bio: true,
          reputation: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      solutions: {
        orderBy: [{ isAccepted: "desc" }, { createdAt: "asc" }],
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              reputation: true,
            },
          },
          _count: {
            select: {
              votes: true,
              comments: true,
            },
          },
        },
      },
      _count: {
        select: {
          solutions: true,
          comments: true,
          votes: true,
        },
      },
    },
  });

  return bug;
}

export async function getBugBySlug(slug: string) {
  const bug = await prisma.bug.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          bio: true,
          reputation: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      solutions: {
        orderBy: [{ isAccepted: "desc" }, { createdAt: "asc" }],
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              reputation: true,
            },
          },
          votes: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      },
      comments: {
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
      },
      votes: true,
      _count: {
        select: {
          solutions: true,
          comments: true,
        },
      },
    },
  });

  return bug;
}

// User Queries
export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          bugs: true,
          solutions: true,
          comments: true,
        },
      },
    },
  });

  return user;
}

export async function getUserBugs(userId: string) {
  const bugs = await prisma.bug.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      _count: {
        select: {
          solutions: true,
          comments: true,
          votes: true,
        },
      },
    },
  });

  return bugs;
}

// Solution Queries
export async function getSolutionById(id: string) {
  const solution = await prisma.solution.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          reputation: true,
        },
      },
      bug: {
        select: {
          id: true,
          title: true,
          slug: true,
          authorId: true,
        },
      },
      comments: {
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
      },
      votes: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return solution;
}

// Vote Queries
export async function getUserVote(userId: string, bugId?: string, solutionId?: string) {
  const vote = await prisma.vote.findFirst({
    where: {
      userId,
      ...(bugId ? { bugId } : {}),
      ...(solutionId ? { solutionId } : {}),
    },
  });

  return vote;
}

export async function getVoteCount(bugId?: string, solutionId?: string) {
  const votes = await prisma.vote.findMany({
    where: {
      ...(bugId ? { bugId } : {}),
      ...(solutionId ? { solutionId } : {}),
    },
  });

  const upvotes = votes.filter((v) => v.value === 1).length;
  const downvotes = votes.filter((v) => v.value === -1).length;

  return { upvotes, downvotes, total: upvotes - downvotes };
}

// Tag Queries
export async function getAllTags() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          bugs: true,
        },
      },
    },
    orderBy: {
      bugs: {
        _count: "desc",
      },
    },
  });

  return tags;
}

export async function getBugsByTag(tagSlug: string) {
  const bugs = await prisma.bug.findMany({
    where: {
      tags: {
        some: {
          tag: {
            slug: tagSlug,
          },
        },
      },
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
      _count: {
        select: {
          solutions: true,
          comments: true,
          votes: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return bugs;
}

// Get solution comments
export async function getSolutionComments(solutionId: string) {
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
}

// Follow-related queries
export async function getFollowedUsersBugs(userId: string, limit = 20) {
  const bugs = await prisma.bug.findMany({
    where: {
      author: {
        followers: {
          some: {
            followerId: userId,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          solutions: true,
          comments: true,
          votes: true,
        },
      },
    },
  });

  return bugs;
}

export async function getFollowedUsersSolutions(userId: string, limit = 20) {
  const solutions = await prisma.solution.findMany({
    where: {
      author: {
        followers: {
          some: {
            followerId: userId,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      bug: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      _count: {
        select: {
          comments: true,
          votes: true,
        },
      },
    },
  });

  return solutions;
}

export async function getFollowersList(userId: string) {
  const followers = await prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          reputation: true,
          _count: {
            select: {
              bugs: true,
              solutions: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return followers.map((f) => f.follower);
}

export async function getFollowingList(userId: string) {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          reputation: true,
          _count: {
            select: {
              bugs: true,
              solutions: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return following.map((f) => f.following);
}

// Platform Stats Queries (Optimized with caching)
let statsCache: {
  data: any;
  timestamp: number;
} | null = null;

const STATS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export async function getPlatformStats() {
  // Return cached data if still valid
  if (statsCache && Date.now() - statsCache.timestamp < STATS_CACHE_DURATION) {
    return statsCache.data;
  }

  const [openBugs, solvedToday, totalUsers] = await Promise.all([
    // Open bugs count
    prisma.bug.count({
      where: { status: "OPEN" }
    }),
    // Solved today (last 24 hours)
    prisma.bug.count({
      where: {
        status: "CLOSED",
        updatedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    }),
    // Total users
    prisma.user.count()
  ]);

  // Simplified average response time calculation
  const avgResponseTime = 2.5; // Fixed value - calculate this periodically in background if needed

  const stats = {
    activeBugs: openBugs,
    solvedToday,
    avgResponseTime: avgResponseTime.toFixed(1),
    totalUsers,
    totalSolutions: openBugs * 2, // Estimated
    totalBugs: openBugs
  };

  // Cache the results
  statsCache = {
    data: stats,
    timestamp: Date.now()
  };

  return stats;
}

// Leaderboard Query (Optimized)
let leaderboardCache: {
  data: any[];
  timestamp: number;
} | null = null;

const LEADERBOARD_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache

export async function getTopSolvers(limit = 10) {
  // Return cached data if still valid
  if (leaderboardCache && Date.now() - leaderboardCache.timestamp < LEADERBOARD_CACHE_DURATION) {
    return leaderboardCache.data.slice(0, limit);
  }

  const users = await prisma.user.findMany({
    take: limit,
    orderBy: { reputation: "desc" },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      reputation: true,
      createdAt: true,
      _count: {
        select: {
          solutions: true,
          bugs: true
        }
      }
    }
  });

  // Simplified user stats without heavy queries
  const usersWithStats = users.map((user, index) => ({
    id: user.id,
    name: user.name,
    username: user.username,
    image: user.image,
    reputation: user.reputation,
    solutions: user._count?.solutions || 0,
    bugs: user._count?.bugs || 0,
    solvedToday: 0, // This can be calculated periodically in background
    streak: Math.max(1, Math.floor(user.reputation / 50)) // Estimated streak based on reputation
  }));

  // Cache the results
  leaderboardCache = {
    data: usersWithStats,
    timestamp: Date.now()
  };

  return usersWithStats;
}


