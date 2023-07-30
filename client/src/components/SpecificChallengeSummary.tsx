import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { challengeSubmission } from "../customTypings/challengeSubmission";
import { challenge } from "../customTypings/challenge";

export const SpecificChallengeSummary = () => {
  let { challengeId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [challengeData, setChallengeData] = useState<challenge>();
  const [submissionData, setSubmissionData] = useState<challengeSubmission>();

  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        const summaryData = await axiosPrivate.get(
          `/challenges/summary/${challengeId}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        setChallengeData(summaryData.data.challenge);
        setSubmissionData(summaryData.data.challengeSubmission);
      } catch (err) {
        console.log(err);
      }
    };

    fetchChallengeData();
  }, []);

  return (
    challengeData &&
    submissionData && (
      <>
        <h1>Challenge summary page W/B {challengeData.startDate}</h1>
        <h1>Challenge ID: {challengeData.id}</h1>
        <h1>Submission ID: {submissionData.id}</h1>
      </>
    )
  );
};
