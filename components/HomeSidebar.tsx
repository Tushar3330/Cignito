import Link from "next/link";
import { Zap, Bug, Send } from "lucide-react";
import { getPlatformStats } from "@/lib/queries";

export default async function HomeSidebar() {
  const stats = await getPlatformStats();

  return (
    <aside className="space-y-6">
      {/* Platform Stats */}
      <div className="bg-gradient-to-br from-primary to-pink-600 rounded-2xl border-4 border-black p-6 shadow-200 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-6 h-6" />
          <h3 className="font-black text-xl">Platform Stats</h3>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-white/90 font-semibold">Active Bugs</span>
            <span className="font-black text-3xl">{stats.activeBugs}</span>
          </div>
          <div className="w-full h-px bg-white/20"></div>
          <div className="flex justify-between items-center">
            <span className="text-white/90 font-semibold">Solved Today</span>
            <span className="font-black text-3xl text-secondary">{stats.solvedToday}</span>
          </div>
          <div className="w-full h-px bg-white/20"></div>
          <div className="flex justify-between items-center">
            <span className="text-white/90 font-semibold">Avg Response</span>
            <span className="font-black text-3xl">{stats.avgResponseTime}hrs</span>
          </div>
        </div>
      </div>

      {/* Post Bug CTA */}
      <div className="bg-gradient-to-br from-secondary via-yellow-400 to-yellow-300 rounded-2xl border-4 border-black p-8 shadow-200 text-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-20 h-20 bg-black rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-black rounded-full translate-x-16 translate-y-16"></div>
        </div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <Bug className="w-8 h-8 text-secondary" />
          </div>
          <p className="font-black text-2xl mb-2 text-gray-900">Got a Bug?</p>
          <p className="text-sm text-gray-800 mb-6 font-semibold">
            Post it now and get help from {stats.totalUsers.toLocaleString()}+ developers!
          </p>
          <Link
            href="/bug/create"
            className="inline-flex items-center gap-2 bg-black text-white font-black px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-200"
          >
            <Send className="w-5 h-5" />
            Post Your Bug
          </Link>
        </div>
      </div>
    </aside>
  );
}
