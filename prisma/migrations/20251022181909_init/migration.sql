-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "BugStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'SOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "username" TEXT,
    "bio" TEXT,
    "githubId" INTEGER,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bug" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "codeSnippet" TEXT,
    "images" TEXT[],
    "language" TEXT NOT NULL,
    "framework" TEXT,
    "severity" "Severity" NOT NULL DEFAULT 'MEDIUM',
    "status" "BugStatus" NOT NULL DEFAULT 'OPEN',
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Bug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solution" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "codeSnippet" TEXT,
    "images" TEXT[],
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bugId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "bugId" TEXT,
    "solutionId" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "type" "VoteType" NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "bugId" TEXT,
    "solutionId" TEXT,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BugTag" (
    "bugId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "BugTag_pkey" PRIMARY KEY ("bugId","tagId")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bugId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Bug_slug_key" ON "Bug"("slug");

-- CreateIndex
CREATE INDEX "Bug_authorId_idx" ON "Bug"("authorId");

-- CreateIndex
CREATE INDEX "Bug_status_idx" ON "Bug"("status");

-- CreateIndex
CREATE INDEX "Bug_language_idx" ON "Bug"("language");

-- CreateIndex
CREATE INDEX "Bug_createdAt_idx" ON "Bug"("createdAt");

-- CreateIndex
CREATE INDEX "Bug_slug_idx" ON "Bug"("slug");

-- CreateIndex
CREATE INDEX "Solution_bugId_idx" ON "Solution"("bugId");

-- CreateIndex
CREATE INDEX "Solution_authorId_idx" ON "Solution"("authorId");

-- CreateIndex
CREATE INDEX "Solution_isAccepted_idx" ON "Solution"("isAccepted");

-- CreateIndex
CREATE INDEX "Solution_createdAt_idx" ON "Solution"("createdAt");

-- CreateIndex
CREATE INDEX "Comment_bugId_idx" ON "Comment"("bugId");

-- CreateIndex
CREATE INDEX "Comment_solutionId_idx" ON "Comment"("solutionId");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "Vote_bugId_idx" ON "Vote"("bugId");

-- CreateIndex
CREATE INDEX "Vote_solutionId_idx" ON "Vote"("solutionId");

-- CreateIndex
CREATE INDEX "Vote_userId_idx" ON "Vote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_bugId_key" ON "Vote"("userId", "bugId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_solutionId_key" ON "Vote"("userId", "solutionId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "Tag_slug_idx" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "BugTag_bugId_idx" ON "BugTag"("bugId");

-- CreateIndex
CREATE INDEX "BugTag_tagId_idx" ON "BugTag"("tagId");

-- CreateIndex
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");

-- CreateIndex
CREATE INDEX "Bookmark_bugId_idx" ON "Bookmark"("bugId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_bugId_key" ON "Bookmark"("userId", "bugId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bug" ADD CONSTRAINT "Bug_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_bugId_fkey" FOREIGN KEY ("bugId") REFERENCES "Bug"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_bugId_fkey" FOREIGN KEY ("bugId") REFERENCES "Bug"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_bugId_fkey" FOREIGN KEY ("bugId") REFERENCES "Bug"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugTag" ADD CONSTRAINT "BugTag_bugId_fkey" FOREIGN KEY ("bugId") REFERENCES "Bug"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugTag" ADD CONSTRAINT "BugTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_bugId_fkey" FOREIGN KEY ("bugId") REFERENCES "Bug"("id") ON DELETE CASCADE ON UPDATE CASCADE;
