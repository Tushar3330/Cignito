import SearchForm from "@/components/SearchForm";
import BugCard, { BugCardType } from "@/components/BugCard";
import HomeSidebar from "@/components/HomeSidebar";
import FilterCarousel from "@/components/FilterCarousel";
import { getAllBugs } from "@/lib/queries";
import { auth } from "../lib/auth";
import { Filter, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

// Enable ISR (Incremental Static Regeneration) for better performance
export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; language?: string; status?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const query = params.query;
  const language = params.language;
  const status = params.status;
  const tag = params.tag;

  const session = await auth();

  const bugs = await getAllBugs({
    search: query || undefined,
    language: language || undefined,
    status: status || undefined,
    tag: tag || undefined,
  });

  const totalBugs = bugs.length;
  const openBugs = bugs.filter(b => b.status === 'OPEN').length;
  const solvedBugs = bugs.filter(b => b.status === 'CLOSED').length;

  return (
    <>
      <section className="pink_container !pb-12">
        <h1 className="heading !text-[52px]">
          Share Your Bugs, <br />
          Get Expert Solutions
        </h1>

        <p className="sub-heading !max-w-4xl !text-xl">
          Join thousands of developers solving real-world coding challenges together.
          Post your bug, get solutions, earn reputation!
        </p>

        <SearchForm query={query} />

        {/* All Bugs Title */}
        <div className="mt-8 text-center">
          <h2 className="text-white font-black text-2xl"> All Bugs</h2>
        </div>

        {/* Filter Chips Carousel */}
        <FilterCarousel />
      </section>

      <section className="section_container !max-w-[1600px]">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-black rounded-2xl p-5 shadow-200 hover:shadow-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center border-3 border-black">
                <Filter className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-black text-blue-900">{totalBugs}</p>
                <p className="text-sm font-bold text-blue-700">Total Bugs</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-orange-200 border-4 border-black rounded-2xl p-5 shadow-200 hover:shadow-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center border-3 border-black">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-black text-orange-900">{openBugs}</p>
                <p className="text-sm font-bold text-orange-700">Open & Waiting</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-200 border-4 border-black rounded-2xl p-5 shadow-200 hover:shadow-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center border-3 border-black">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-black text-green-900">{solvedBugs}</p>
                <p className="text-sm font-bold text-green-700">Solved Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Bugs (2-col grid) + Sidebar */}
        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          {/* Main Content - 2 Column Bug Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-30-semibold">
                {query
                  ? `Search: "${query}"`
                  : tag
                  ? `Tag: #${tag}`
                  : language
                  ? `${language} Bugs`
                  : status
                  ? `${status === 'OPEN' ? ' Open' : ' Solved'} Bugs`
                  : " Latest Bugs"}
              </h2>
              <select className="px-4 py-2 border-3 border-black rounded-xl font-bold bg-white hover:bg-gray-50 cursor-pointer">
                <option>Newest First</option>
                <option> Most Popular</option>
                <option> Most Discussed</option>
                <option> Recently Updated</option>
              </select>
            </div>

            {/* 2-Column Bug Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {bugs && bugs.length > 0 ? (
                bugs.map((bug) => (
                  <BugCard key={bug.id} bug={bug as unknown as BugCardType} />
                ))
              ) : (
                <div className="col-span-2 text-center py-20 bg-white rounded-2xl border-4 border-black">
                  <p className="text-6xl mb-4">🔍</p>
                  <p className="text-2xl font-black mb-2">No bugs found</p>
                  <p className="text-gray-600">Try adjusting your filters or search query</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Platform Stats + Post Bug CTA */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <HomeSidebar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}