import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "./../app/lib/auth";
import { Bug, LogOut, Trophy, Tag, Activity } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white shadow-200 font-work-sans border-b-2 border-black">
      <nav className="flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Bug className="size-8 text-primary" />
            <span className="text-2xl font-black text-black">
              Cignito
            </span>
          </Link>

          {/* Quick Links - Only visible when logged in */}
          {session && session?.user && (
            <div className="hidden md:flex items-center gap-2">
              <Link 
                href="/leaderboard"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-yellow-50 border-2 border-transparent hover:border-black transition-all font-bold text-sm"
              >
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span>Leaderboard</span>
              </Link>
              <Link 
                href="/tags"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-blue-50 border-2 border-transparent hover:border-black transition-all font-bold text-sm"
              >
                <Tag className="w-4 h-4 text-blue-600" />
                <span>Tags</span>
              </Link>
              <Link 
                href="/activity"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-green-50 border-2 border-transparent hover:border-black transition-all font-bold text-sm"
              >
                <Activity className="w-4 h-4 text-green-600" />
                <span>Activity</span>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {session && session?.user ? (
            <>
              <Link href="/bug/create">
                <span className="max-sm:hidden font-semibold text-primary">
                  Post Bug
                </span>
                <Bug className="size-6 sm:hidden text-primary" />
              </Link>

              <form
                action={async () => {
                  "use server";

                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="text-red-600 hover:text-red-700">
                  <span className="max-sm:hidden font-semibold">Logout</span>
                  <LogOut className="size-6 sm:hidden text-red-600" />
                </button>
              </form>

              <Link href={`/user/${session?.user?.id}`}>
                <Avatar className="size-10 border-2 border-primary">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback className="bg-primary text-white">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <Link href="/signin">
              <button 
                className="px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-primary/90 shadow-200"
              >
                Sign In
              </button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;