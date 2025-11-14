import { auth } from "../../../lib/auth";
import { getUserById, getUserBugs } from "@/lib/queries";
import { getFollowStats } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import { BugCardSkeleton } from "@/components/BugCard";
import BugCard, { BugCardType } from "@/components/BugCard";
import { Trophy, Bug, MessageCircle, Users } from "lucide-react";
import ProfileSettings from "@/components/ProfileSettings";
import FollowButton from "@/components/FollowButton";
import prisma from "@/lib/prisma";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await auth();

  const user = await getUserById(id);
  if (!user) return notFound();

  const bugs = await getUserBugs(id);
  const followStats = await getFollowStats(id);

  // Get linked accounts for the user (only for own profile)
  const isOwnProfile = session?.user?.id === id;
  let linkedAccounts: any[] = [];
  let hasPassword = false;

  if (isOwnProfile) {
    const userWithAccounts = await prisma.user.findUnique({
      where: { id },
      select: {
        password: true,
        accounts: {
          select: {
            provider: true,
            providerAccountId: true,
          },
        },
      },
    });

    linkedAccounts = userWithAccounts?.accounts || [];
    hasPassword = !!userWithAccounts?.password;
  }

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>

          <div className="w-[220px] h-[220px] rounded-full overflow-hidden mx-auto">
            <Image
              src={user.image || "/default-avatar.png"}
              alt={user.name || "User"}
              width={220}
              height={220}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-30-extrabold mt-7 text-center">
            @{user?.username}
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <Trophy className="size-6 text-secondary" />
              <p className="text-20-medium">{user?.reputation}</p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-6 text-primary" />
              <p className="text-16-medium">{followStats.followersCount} followers</p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-6 text-black-300" />
              <p className="text-16-medium">{followStats.followingCount} following</p>
            </div>
          </div>

          {/* Follow Button */}
          <div className="mt-4">
            <FollowButton userId={id} currentUserId={session?.user?.id} />
          </div>

          {user?.bio && (
            <p className="mt-4 text-center text-14-normal px-4">{user.bio}</p>
          )}

          <div className="mt-6 w-full space-y-2">
            <div className="flex items-center justify-between px-4 py-2 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <Bug className="size-5 text-primary" />
                <span className="text-16-medium">Bugs Posted</span>
              </div>
              <span className="text-20-medium">{user._count?.bugs || 0}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2 bg-white rounded-lg">
              <div className="flex items-center gap-2">
                <MessageCircle className="size-5 text-primary" />
                <span className="text-16-medium">Solutions</span>
              </div>
              <span className="text-20-medium">{user._count?.solutions || 0}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          {/* Profile Settings - only show on own profile */}
          {isOwnProfile && (
            <ProfileSettings
              userId={id}
              currentImage={user.image}
              linkedAccounts={linkedAccounts}
              hasPassword={hasPassword}
            />
          )}

          <p className="text-30-bold">
            {session?.user?.id === id ? "Your" : "All"} Bugs
          </p>
          <ul className="card_grid-sm">
            <Suspense fallback={<BugCardSkeleton />}>
              {bugs.length > 0 ? (
                bugs.map((bug) => (
                  <BugCard key={bug.id} bug={bug as unknown as BugCardType} />
                ))
              ) : (
                <p className="no-result">No bugs posted yet</p>
              )}
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Page;