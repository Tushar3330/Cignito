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

// Platform Stats Queries
export async function getPlatformStats() {
  const [totalBugs, openBugs, solvedToday, totalUsers, totalSolutions] = await Promise.all([
    // Total active bugs
    prisma.bug.count({
      where: { status: "OPEN" }
    }),
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
    prisma.user.count(),
    // Total solutions
    prisma.solution.count()
  ]);

  // Calculate average response time (in hours)
  const recentSolutions = await prisma.solution.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: {
      bug: {
        select: { createdAt: true }
      }
    }
  });

  let avgResponseTime = 0;
  if (recentSolutions.length > 0) {
    const totalTime = recentSolutions.reduce((sum, solution) => {
      const timeDiff = solution.createdAt.getTime() - solution.bug.createdAt.getTime();
      return sum + timeDiff;
    }, 0);
    avgResponseTime = totalTime / recentSolutions.length / (1000 * 60 * 60); // Convert to hours
  }

  return {
    activeBugs: openBugs,
    solvedToday,
    avgResponseTime: avgResponseTime.toFixed(1),
    totalUsers,
    totalSolutions,
    totalBugs
  };
}

// Leaderboard Query
export async function getTopSolvers(limit = 10) {
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

  // Get solutions posted today for each user
  const usersWithTodayStats = await Promise.all(
    users.map(async (user) => {
      const todaySolutions = await prisma.solution.count({
        where: {
          authorId: user.id,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      });

      // Calculate streak (consecutive days with at least 1 solution)
      const solutions = await prisma.solution.findMany({
        where: { authorId: user.id },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
        take: 365
      });

      let streak = 0;
      if (solutions.length > 0) {
        const today = new Date().setHours(0, 0, 0, 0);
        let checkDate = today;
        
        for (let i = 0; i < 365; i++) { // Check up to 365 days
          const dayStart = new Date(checkDate);
          const dayEnd = new Date(checkDate + 24 * 60 * 60 * 1000);
          
          const hasActivity = solutions.some(s => {
            const sTime = s.createdAt.getTime();
            return sTime >= dayStart.getTime() && sTime < dayEnd.getTime();
          });
          
          if (hasActivity) {
            streak++;
            checkDate -= 24 * 60 * 60 * 1000;
          } else {
            break;
          }
        }
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        reputation: user.reputation,
        solutions: user._count?.solutions || 0,
        bugs: user._count?.bugs || 0,
        solvedToday: todaySolutions,
        streak
      };
    })
  );

  return usersWithTodayStats;
}


