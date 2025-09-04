import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import GitHubProvider from "next-auth/providers/github";

export const {handlers , signIn , signOut , auth} = NextAuth({
    providers : [
        Github({
            clientId: process.env.AUTH_GITHUB_ID || "",
            clientSecret: process.env.AUTH_GITHUB_SECRET || ""  
        })
    ],
    // Add any additional NextAuth configuration options here
});
