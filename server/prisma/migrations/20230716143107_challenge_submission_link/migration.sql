/*
  Warnings:

  - Added the required column `parentChallengeId` to the `ChallengeSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChallengeSubmission" ADD COLUMN     "parentChallengeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ChallengeSubmission" ADD CONSTRAINT "ChallengeSubmission_parentChallengeId_fkey" FOREIGN KEY ("parentChallengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
