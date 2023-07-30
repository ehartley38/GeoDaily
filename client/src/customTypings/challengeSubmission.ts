export type challengeSubmission = {
  id: string;
  isComplete: boolean;
  parentChallengeId: string;
  playerId: string;
  score: number;
  parentChallenge?: {
    id: string;
    endDate: string;
    startDate: string;
  };
};
