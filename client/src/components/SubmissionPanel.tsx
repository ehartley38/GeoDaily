import { useNavigate } from "react-router-dom";
import { challengeSubmission } from "../customTypings/challengeSubmission";

type SubmissionPanelProps = {
  submission: challengeSubmission;
};

export const SubmissionPanel = ({ submission }: SubmissionPanelProps) => {
  const navigate = useNavigate();

  // const handleClick = () => {
  //   navigate(submission.parentChallengeId);
  // };

  return (
    <a className="history-submission">
      <div className="history-submission-header">
        <span>
          <h2>{submission.parentChallenge?.startDate.slice(0, 10)}</h2>
        </span>
        <div className="history-submission-bar"></div>
      </div>
      <div className="history-submission-content">
        Score: {submission.totalScore}
      </div>
    </a>
  );
};
