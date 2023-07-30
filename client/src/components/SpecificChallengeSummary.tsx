import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const SpecificChallengeSummary = () => {
  let { challengeId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [challengeData, setChallengeData] = useState<any>(null); // Tidy up type
  const [submissionData, setSubmissionData] = useState<any>(null); // Tidy up type

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
        <h1>Challenge summary page</h1>
        <h1>Challenge ID: {challengeData.id}</h1>
        <h1>Submission ID: {submissionData.id}</h1>
      </>
    )
  );
};
