import { challengeSubmission } from "../customTypings/challengeSubmission";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import { SubmissionPanel } from "./SubmissionPanel";

export const History = () => {
  const axiosPrivate = useAxiosPrivate();
  const [submissionHistory, setSubmissionHistory] =
    useState<challengeSubmission[]>();

  useEffect(() => {
    const fetchSubmissionHistory = async () => {
      try {
        const submissionHistory = await axiosPrivate.get(
          "/challenges/history",
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        setSubmissionHistory(submissionHistory.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSubmissionHistory();
  }, []);

  return (
    submissionHistory && (
      <div className="grid grid-cols-5 h-screen">
        <div className="col-span-4">
          <h1>History</h1>

          <div className="flex flex-col">
            {submissionHistory.map((submission) => (
              <SubmissionPanel key={submission.id} submission={submission} />
            ))}
            {submissionHistory.map((submission) => (
              <SubmissionPanel key={submission.id} submission={submission} />
            ))}
          </div>
        </div>
      </div>
    )
  );
};
