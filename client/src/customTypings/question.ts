export type question = {
  id: string;
  parentChallengeId: string;
  correctPos: {
    lat: number;
    lng: number;
  };
};
