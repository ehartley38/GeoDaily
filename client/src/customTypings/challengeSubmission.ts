export type challengeSubmission = {
  id: string;
  isComplete: boolean;
  parentChallengeId: string;
  playerId: string;
  totalScore: number;
  parentChallenge?: {
    id: string;
    endDate: string;
    startDate: string;
  };
};
