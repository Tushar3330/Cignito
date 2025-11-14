import Link from "next/link";
import { Tag, TrendingUp, Search } from "lucide-react";

const ALL_TAGS = [
  { name: "react", count: 245, trend: "+12%", emoji: "⚛️", color: "from-blue-400 to-blue-600" },
  { name: "async", count: 189, trend: "+8%", emoji: "⏳", color: "from-purple-400 to-purple-600" },
  { name: "typescript", count: 167, trend: "+15%", emoji: "🔷", color: "from-blue-500 to-indigo-600" },
  { name: "api", count: 143, trend: "+5%", emoji: "🔌", color: "from-green-400 to-green-600" },
  { name: "database", count: 128, trend: "+10%", emoji: "🗄️", color: "from-yellow-400 to-yellow-600" },
  { name: "hooks", count: 112, trend: "+18%", emoji: "🪝", color: "from-pink-400 to-pink-600" },
  { name: "performance", count: 98, trend: "+7%", emoji: "⚡", color: "from-orange-400 to-orange-600" },
  { name: "authentication", count: 87, trend: "+13%", emoji: "🔐", color: "from-red-400 to-red-600" },
  { name: "cors", count: 76, trend: "+6%", emoji: "🌐", color: "from-teal-400 to-teal-600" },
  { name: "npm", count: 65, trend: "+9%", emoji: "📦", color: "from-red-500 to-pink-600" },
  { name: "state-management", count: 58, trend: "+11%", emoji: "🔄", color: "from-indigo-400 to-indigo-600" },
  { name: "routing", count: 52, trend: "+4%", emoji: "🛣️", color: "from-cyan-400 to-cyan-600" },
  { name: "debugging", count: 47, trend: "+14%", emoji: "🐛", color: "from-lime-400 to-lime-600" },
  { name: "testing", count: 43, trend: "+8%", emoji: "🧪", color: "from-emerald-400 to-emerald-600" },
  { name: "deployment", count: 39, trend: "+12%", emoji: "🚀", color: "from-violet-400 to-violet-600" },
  { name: "memory-leak", count: 35, trend: "+6%", emoji: "💾", color: "from-rose-400 to-rose-600" },
  { name: "webpack", count: 31, trend: "+5%", emoji: "📦", color: "from-sky-400 to-sky-600" },
  { name: "css", count: 28, trend: "+9%", emoji: "🎨", color: "from-fuchsia-400 to-fuchsia-600" },
  { name: "security", count: 24, trend: "+16%", emoji: "🔒", color: "from-amber-400 to-amber-600" },
  { name: "websocket", count: 21, trend: "+7%", emoji: "🔌", color: "from-teal-500 to-cyan-600" },
];

export default function TagsPage() {
  return (
    <>
      <section className="pink_container !pb-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="heading !text-[52px]">
            🏷️ All Tags
          </h1>
          <p className="sub-heading !max-w-4xl !text-xl">
            Explore bugs by topics. Find the tag you're interested in and dive into related discussions!
          </p>

          {/* Search Tags */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm border-3 border-white rounded-full p-4">
              <Search className="w-6 h-6 text-white" />
              <input
                type="text"
                placeholder="Search tags..."
                className="flex-1 bg-transparent text-white placeholder:text-white/70 font-bold text-lg outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section_container !max-w-6xl">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-black rounded-2xl p-6 shadow-200">
            <div className="flex items-center gap-3">
              <Tag className="w-10 h-10 text-blue-600" />
              <div>
                <p className="text-3xl font-black text-blue-900">{ALL_TAGS.length}</p>
                <p className="text-sm font-bold text-blue-700">Total Tags</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-200 border-4 border-black rounded-2xl p-6 shadow-200">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-green-600" />
              <div>
                <p className="text-3xl font-black text-green-900">8</p>
                <p className="text-sm font-bold text-green-700">Trending Now</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 border-4 border-black rounded-2xl p-6 shadow-200">
            <div className="flex items-center gap-3">
              <Tag className="w-10 h-10 text-purple-600" />
              <div>
                <p className="text-3xl font-black text-purple-900">1,234</p>
                <p className="text-sm font-bold text-purple-700">Tagged Bugs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tag Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ALL_TAGS.map((tag) => (
            <Link
              key={tag.name}
              href={`/?tag=${tag.name}`}
              className="group"
            >
              <div className={`bg-gradient-to-br ${tag.color} border-4 border-black rounded-2xl p-6 shadow-200 hover:shadow-300 hover:scale-105 transition-all`}>
                <div className="text-center">
                  <div className="text-5xl mb-3">{tag.emoji}</div>
                  <h3 className="font-black text-xl text-white mb-2">
                    #{tag.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-white/30 backdrop-blur-sm rounded-full text-white font-bold text-sm">
                      {tag.count} bugs
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-4 h-4 text-white" />
                    <span className="font-black text-white text-sm">{tag.trend}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary to-pink-600 rounded-2xl border-4 border-black p-8 text-center shadow-200">
          <p className="font-black text-3xl text-white mb-3">Can't find the tag you're looking for?</p>
          <p className="text-lg text-white/90 mb-6 font-semibold">Post a bug and create new tags!</p>
          <Link
            href="/bug/create"
            className="inline-block bg-white text-primary font-black px-8 py-4 rounded-full hover:scale-105 transition-transform"
          >
            Post a Bug →
          </Link>
        </div>
      </section>
    </>
  );
}
