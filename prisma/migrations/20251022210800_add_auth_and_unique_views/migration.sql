-- AlterTable
ALTER TABLE "User" ADD COLUMN     "company" TEXT,
ADD COLUMN     "githubUsername" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "BugView" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "bugId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BugView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolutionView" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "solutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SolutionView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BugView_userId_idx" ON "BugView"("userId");

-- CreateIndex
CREATE INDEX "BugView_bugId_idx" ON "BugView"("bugId");

-- CreateIndex
CREATE INDEX "BugView_createdAt_idx" ON "BugView"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BugView_userId_bugId_key" ON "BugView"("userId", "bugId");

-- CreateIndex
CREATE INDEX "SolutionView_userId_idx" ON "SolutionView"("userId");

-- CreateIndex
CREATE INDEX "SolutionView_solutionId_idx" ON "SolutionView"("solutionId");

-- CreateIndex
CREATE INDEX "SolutionView_createdAt_idx" ON "SolutionView"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SolutionView_userId_solutionId_key" ON "SolutionView"("userId", "solutionId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_email_idx" ON "PasswordResetToken"("email");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_email_token_key" ON "PasswordResetToken"("email", "token");

-- CreateIndex
CREATE INDEX "User_githubId_idx" ON "User"("githubId");

-- AddForeignKey
ALTER TABLE "BugView" ADD CONSTRAINT "BugView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugView" ADD CONSTRAINT "BugView_bugId_fkey" FOREIGN KEY ("bugId") REFERENCES "Bug"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionView" ADD CONSTRAINT "SolutionView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolutionView" ADD CONSTRAINT "SolutionView_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
