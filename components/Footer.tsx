import Link from "next/link";
import { Bug, Github, Twitter, Mail, Heart, TrendingUp, Users, Trophy } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-20">
      {/* Main Footer */}
      <div className="bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600 border-t-8 border-black relative overflow-hidden">
        {/* Crazy Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          {/* Top Section - Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-md border-3 border-white rounded-2xl p-6 text-center hover:scale-105 transition-transform">
              <Users className="w-10 h-10 mx-auto mb-3 text-white" />
              <p className="text-4xl font-black text-white">10K+</p>
              <p className="text-white/80 font-bold mt-2">Developers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border-3 border-white rounded-2xl p-6 text-center hover:scale-105 transition-transform">
              <Bug className="w-10 h-10 mx-auto mb-3 text-white" />
              <p className="text-4xl font-black text-white">5K+</p>
              <p className="text-white/80 font-bold mt-2">Bugs Solved</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border-3 border-white rounded-2xl p-6 text-center hover:scale-105 transition-transform">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 text-white" />
              <p className="text-4xl font-black text-white">95%</p>
              <p className="text-white/80 font-bold mt-2">Success Rate</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border-3 border-white rounded-2xl p-6 text-center hover:scale-105 transition-transform">
              <Trophy className="w-10 h-10 mx-auto mb-3 text-white" />
              <p className="text-4xl font-black text-white">2hrs</p>
              <p className="text-white/80 font-bold mt-2">Avg Response</p>
            </div>
          </div>

          {/* Middle Section - Links */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Bug className="size-8 text-white" />
                <span className="text-2xl font-black text-white">Cignito</span>
              </Link>
              <p className="text-white/80 text-sm font-semibold mb-4">
                The ultimate platform for developers to solve coding bugs together. 
                Join our community and level up your debugging skills! 
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/Tushar3330/Cignito"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all group"
                >
                  <Github className="w-5 h-5 text-white group-hover:text-primary" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all group"
                >
                  <Twitter className="w-5 h-5 text-white group-hover:text-primary" />
                </a>
                <a
                  href="mailto:tusharrana2505@gmail.com"
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all group"
                >
                  <Mail className="w-5 h-5 text-white group-hover:text-primary" />
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h3 className="font-black text-white text-lg mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-white/80 hover:text-white font-semibold transition-colors hover:underline">
                    🏠 Home
                  </Link>
                </li>
                <li>
                  <Link href="/bug/create" className="text-white/80 hover:text-white font-semibold transition-colors hover:underline">
                    🐛 Post Bug
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="text-white/80 hover:text-white font-semibold transition-colors hover:underline">
                    🏆 Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/tags" className="text-white/80 hover:text-white font-semibold transition-colors hover:underline">
                    🏷️ All Tags
                  </Link>
                </li>
                <li>
                  <Link href="/activity" className="text-white/80 hover:text-white font-semibold transition-colors hover:underline">
                    ⚡ Activity Feed
                  </Link>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="font-black text-white text-lg mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/Tushar3330/Cignito" className="text-white/80 hover:text-white font-semibold transition-colors hover:underline">
                    📚 Documentation
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Tushar3330/Cignito" className="text-white/80 hover:text-white font-semibold transition-colors hover:underline">
                    💡 Guidelines
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Tushar3330/Cignito" className="text-white/80 hover:text-white font-semibold transition-colors hover:underline">
                    🎓 Tutorials
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Tushar3330/Cignito" className="text-white/80 hover:text-white font-semibold transition-colors hover:underline">
                    💬 Discord
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Tushar3330/Cignito" className="text-white/80 hover:text-white font-semibold transition-colors hover:underline">
                    📰 Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-black text-white text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/Tushar3330/Cignito" className="text-white/80 hover:text-white font-semibold transition-colors hover:underline">
                    📜 Terms of Service
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Tushar3330/Cignito" className="text-white/80 hover:text-white font-semibold transition-colors hover:underline">
                    🔒 Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Tushar3330/Cignito" className="text-white/80 hover:text-white font-semibold transition-colors hover:underline">
                    🍪 Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Tushar3330/Cignito" className="text-white/80 hover:text-white font-semibold transition-colors hover:underline">
                    ⚖️ Code of Conduct
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Tushar3330/Cignito" className="text-white/80 hover:text-white font-semibold transition-colors hover:underline">
                    📧 Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t-2 border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/80 text-sm font-semibold text-center md:text-left">
                © 2025 Cignito. Built with <Heart className="inline w-4 h-4 text-red-400" /> by developers, for developers.
              </p>
              <div className="flex gap-4 text-sm font-semibold">
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  English
                </a>
                <span className="text-white/40">•</span>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  Español
                </a>
                <span className="text-white/40">•</span>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  日本語
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
