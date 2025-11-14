import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          githubId: profile.id, // Keep as number
          githubUsername: profile.login,
          bio: profile.bio,
          location: profile.location,
          company: profile.company,
          website: profile.blog,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentialsSchema.parse(credentials);

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              password: true,
            },
          });

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        console.error("No email provided by OAuth provider");
        return false;
      }

      if (account?.provider === "credentials") {
        return true;
      }
      
      // For OAuth providers (Google, GitHub), auto-link accounts with same email
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          // Find existing user by email
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true },
          });

          if (existingUser) {
            // Check if this specific OAuth account is already linked
            const isAccountLinked = existingUser.accounts.some(
              (acc) => 
                acc.provider === account.provider && 
                acc.providerAccountId === account.providerAccountId
            );

            if (!isAccountLinked) {
              // Link the new OAuth account to existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state as string | null,
                },
              });
              
              console.log(`✅ Linked ${account.provider} account to existing user: ${user.email}`);
            }

            // Update user ID to use existing user's ID
            user.id = existingUser.id;
          } else {
            // New user - will be created by adapter
            console.log(`🆕 Creating new user with ${account.provider}: ${user.email}`);
          }
        } catch (error) {
          console.error("Error in OAuth account linking:", error);
          return false;
        }
      }
      
      return true;
    },
    async session({ session, token }) {
      try {
        if (session.user && token?.sub) {
          session.id = token.sub;
          session.user.id = token.sub;
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (user) {
          token.id = user.id;
        }
        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
});