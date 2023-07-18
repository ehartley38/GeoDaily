import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const PlayDaily = () => {
  const { state } = useLocation();
  const { currentChallenge, challengeSubmission } = state;

  useEffect(() => {
    console.log(currentChallenge);
    console.log(challengeSubmission);
  }, []);

  return (
    <>
      Current challenge ID is {currentChallenge.id}
      Current challenge submission ID is {challengeSubmission.id}
      <h1>Play Daily</h1>
    </>
  );
};
