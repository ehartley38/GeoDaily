-- CreateTable
CREATE TABLE "TempQuestionSubmission" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL DEFAULT '',
    "parentQuestionId" TEXT NOT NULL,
    "attemptPos" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,

    CONSTRAINT "TempQuestionSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TempQuestionSubmission" ADD CONSTRAINT "TempQuestionSubmission_parentQuestionId_fkey" FOREIGN KEY ("parentQuestionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
