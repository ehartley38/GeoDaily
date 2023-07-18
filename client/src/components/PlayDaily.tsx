import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const PlayDaily = () => {
  const { state } = useLocation();
  const { currentChallenge, challengeSubmission } = state;
  const [questions, setQuestions] = useState(
    currentChallenge.questions.slice(
      challengeSubmission.questionsAnswered.length
    )
  );

  useEffect(() => {
    // console.log("Challenge data:", currentChallenge);
    // console.log("Submission data:", challengeSubmission);
    // console.log("Questions:", questions);
    console.log(questions[0].correctPos[0].lat);
  }, []);

  return (
    <>
      <h1>Play Daily</h1>
    </>
  );
};
