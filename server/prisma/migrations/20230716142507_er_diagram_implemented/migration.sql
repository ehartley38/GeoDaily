-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeSubmission" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "isComplete" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "ChallengeSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "parentChallengeId" TEXT NOT NULL,
    "correctPos" JSONB NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionSubmission" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "parentChallengeSubmissionId" TEXT NOT NULL,
    "attemptPos" JSONB NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "QuestionSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChallengeSubmission" ADD CONSTRAINT "ChallengeSubmission_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_parentChallengeId_fkey" FOREIGN KEY ("parentChallengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionSubmission" ADD CONSTRAINT "QuestionSubmission_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionSubmission" ADD CONSTRAINT "QuestionSubmission_parentChallengeSubmissionId_fkey" FOREIGN KEY ("parentChallengeSubmissionId") REFERENCES "ChallengeSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
