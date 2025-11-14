import { auth } from "../../lib/auth";
import { getFollowedUsersBugs } from "@/lib/queries";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import BugCard, { BugCardType, BugCardSkeleton } from "@/components/BugCard";
import Link from "next/link";
import { TrendingUp, Users } from "lucide-react";

const ActivityFeed = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const bugs = await getFollowedUsersBugs(session.user.id, 50);

  return (
    <>
      <section className="pink_container !pb-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="heading !text-[52px]">
            ⚡ Activity Feed
          </h1>
          <p className="sub-heading !max-w-4xl !text-xl">
            Stay updated with the latest bugs and solutions from developers you follow!
          </p>
        </div>
      </section>

      <section className="section_container !max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="size-6 text-primary" />
            <p className="text-20-medium">
              {bugs.length} {bugs.length === 1 ? "post" : "posts"} from followed users
            </p>
          </div>
        </div>

        {bugs.length === 0 ? (
          <div className="card_grid">
            <div className="col-span-full text-center py-12">
              <TrendingUp className="size-16 mx-auto text-black-300 mb-4" />
              <h3 className="text-24-black mb-2">No Activity Yet</h3>
              <p className="text-16-medium text-black-300 mb-6">
                Start following developers to see their latest bugs and solutions here
              </p>
              <Link
                href="/"
                className="startup-form_btn"
              >
                Browse Bugs
              </Link>
            </div>
          </div>
        ) : (
          <ul className="card_grid">
            {bugs.map((bug) => (
              <BugCard key={bug.id} bug={bug as unknown as BugCardType} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
};

export default function ActivityPage() {
  return (
    <Suspense fallback={<BugCardSkeleton />}>
      <ActivityFeed />
    </Suspense>
  );
}
