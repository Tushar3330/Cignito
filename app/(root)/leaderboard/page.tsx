import { Trophy } from "lucide-react";
import Link from "next/link";
import { getTopSolvers } from "@/lib/queries";
import Image from "next/image";

// Enable ISR for better performance
export const revalidate = 300; // Revalidate every 5 minutes

const CATEGORIES = [
  { name: " Top Solvers", active: true },
  { name: " Fastest Response", active: false },
  { name: " Most Helpful", active: false },
  { name: "Rising Stars", active: false },
];

const getBadge = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  if (rank <= 6) return "🏅";
  return "⭐";
};

export default async function LeaderboardPage() {
  const topSolvers = await getTopSolvers(10);

  return (
    <>
      <section className="pink_container !pb-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="heading !text-[52px]">
            🏆 Leaderboard
          </h1>
          <p className="sub-heading !max-w-4xl !text-xl">
            Top developers who are making our community awesome! Compete, solve bugs, and climb the ranks.
          </p>
        </div>
      </section>

      <section className="section_container !max-w-6xl">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              className={`px-6 py-3 rounded-full font-bold border-3 border-black transition-all ${
                cat.active
                  ? "bg-primary text-white shadow-200"
                  : "bg-white hover:bg-gray-50 shadow-100 hover:shadow-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {topSolvers.length >= 3 && (
          <>
            {/* Top 3 Podium */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {/* 2nd Place */}
              <div className="md:mt-8">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-black rounded-2xl p-6 text-center shadow-200 hover:shadow-300 transition-all">
                  <div className="text-6xl mb-4">🥈</div>
                  <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden border-4 border-black">
                    <Image
                      src={topSolvers[1].image || "/default-avatar.png"}
                      alt={topSolvers[1].name || "User"}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-black text-xl mb-2">{topSolvers[1].name}</h3>
                  <div className="flex justify-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 border-2 border-black rounded-full text-xs font-bold">
                      Rank #2
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-bold"> {topSolvers[1].solutions} Solutions</p>
                    <p className="font-bold"> {topSolvers[1].reputation} Reputation</p>
                    <p className="font-bold">{topSolvers[1].streak} Day Streak</p>
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="md:-mt-4">
                <div className="bg-gradient-to-br from-yellow-200 to-yellow-300 border-4 border-black rounded-2xl p-8 text-center shadow-300 relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="w-16 h-16 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-yellow-900" />
                    </div>
                  </div>
                  <div className="text-7xl mb-4 mt-4">👑</div>
                  <div className="w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden border-4 border-black">
                    <Image
                      src={topSolvers[0].image || "/default-avatar.png"}
                      alt={topSolvers[0].name || "User"}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-black text-2xl mb-2">{topSolvers[0].name}</h3>
                  <div className="flex justify-center gap-2 mb-4">
                    <span className="px-4 py-1 bg-yellow-400 border-2 border-black rounded-full text-sm font-black">
                      🏆 CHAMPION
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="font-black text-lg"> {topSolvers[0].solutions} Solutions</p>
                    <p className="font-black text-lg"> {topSolvers[0].reputation} Reputation</p>
                    <p className="font-black text-lg"> {topSolvers[0].streak} Day Streak</p>
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="md:mt-8">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 border-4 border-black rounded-2xl p-6 text-center shadow-200 hover:shadow-300 transition-all">
                  <div className="text-6xl mb-4">🥉</div>
                  <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden border-4 border-black">
                    <Image
                      src={topSolvers[2].image || "/default-avatar.png"}
                      alt={topSolvers[2].name || "User"}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-black text-xl mb-2">{topSolvers[2].name}</h3>
                  <div className="flex justify-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-orange-100 border-2 border-black rounded-full text-xs font-bold">
                      Rank #3
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-bold">{topSolvers[2].solutions} Solutions</p>
                    <p className="font-bold">{topSolvers[2].reputation} Reputation</p>
                    <p className="font-bold">{topSolvers[2].streak} Day Streak</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white rounded-2xl border-4 border-black shadow-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-pink-600 p-6 border-b-4 border-black">
            <h2 className="font-black text-2xl text-white">📊 Full Rankings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-3 border-black">
                <tr>
                  <th className="px-6 py-4 text-left font-black">Rank</th>
                  <th className="px-6 py-4 text-left font-black">Developer</th>
                  <th className="px-6 py-4 text-center font-black">Solutions</th>
                  <th className="px-6 py-4 text-center font-black">Reputation</th>
                  <th className="px-6 py-4 text-center font-black">Today</th>
                  <th className="px-6 py-4 text-center font-black">Streak</th>
                </tr>
              </thead>
              <tbody>
                {topSolvers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b-2 border-gray-200 hover:bg-yellow-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getBadge(index + 1)}</span>
                        <span className="font-black text-lg">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/user/${user.id}`}
                        className="flex items-center gap-3 hover:underline font-bold"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-black">
                          <Image
                            src={user.image || "/default-avatar.png"}
                            alt={user.name || "User"}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span>{user.name || user.username}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-lg">
                      {user.solutions}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-blue-100 border-2 border-black rounded-full font-bold">
                        ⭐ {user.reputation}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-green-100 border-2 border-black rounded-full font-bold text-sm">
                        +{user.solvedToday}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-orange-100 border-2 border-black rounded-full font-bold text-sm">
                        🔥 {user.streak}d
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-secondary to-yellow-400 rounded-2xl border-4 border-black p-8 text-center shadow-200">
          <p className="font-black text-3xl mb-3">Want to join the leaderboard?</p>
          <p className="text-lg mb-6 font-semibold">Start solving bugs and earning reputation today!</p>
          <Link
            href="/"
            className="inline-block bg-black text-white font-black px-8 py-4 rounded-full hover:scale-105 transition-transform"
          >
            Browse Bugs →
          </Link>
        </div>
      </section>
    </>
  );
}
