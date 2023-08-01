import { useNavigate } from "react-router-dom";
import { challengeSubmission } from "../customTypings/challengeSubmission";

type SubmissionPanelProps = {
  submission: challengeSubmission;
};

export const SubmissionPanel = ({ submission }: SubmissionPanelProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(submission.parentChallengeId);
  };

  return (
    <a onClick={handleClick}>
      <div className="bg-slate-400 hover:bg-slate-700 hover:cursor-pointer my-1">
        <h1>Score: {submission.totalScore}</h1>
        <h1>Start Date: {submission.parentChallenge?.startDate}</h1>
        <h1>End Date: {submission.parentChallenge?.endDate} </h1>
      </div>
    </a>
  );
};
