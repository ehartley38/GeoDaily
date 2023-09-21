/*
  Warnings:

  - You are about to drop the column `score` on the `ChallengeSubmission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChallengeSubmission" DROP COLUMN "score",
ADD COLUMN     "totalScore" INTEGER NOT NULL DEFAULT 0;
