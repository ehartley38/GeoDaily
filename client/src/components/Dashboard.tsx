import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { currentChallenge } from "../customTypings/currentChallenge";
import { challengeSubmission } from "../customTypings/challengeSubmission";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { Timer } from "./Timer";
import useUserData from "../hooks/useUserData";
import { Loading } from "./Loading";

type ResponseDataType = {
  currentChallenge: currentChallenge;
  challengeSubmission: challengeSubmission;
};

export const Dashboard = () => {
  const [timeRemaining, setTimeRemaining] = useState<number>();
  const [isComplete, setIsComplete] = useState<boolean>();
  const [isLoading, setIsLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { userData } = useUserData();
  const demoToken = localStorage.getItem("demoToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeRemaining = await axiosPrivate.get("/play/time-remaining", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        const isComplete = await axiosPrivate.get(
          "/challenges/current-submission/isComplete",
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        setTimeRemaining(timeRemaining.data.timeRemaining);
        setIsComplete(isComplete.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();

    if (demoToken) {
      handlePlay();
      localStorage.removeItem("demoToken");
    }
  }, []);

  const handlePlay = async () => {
    try {
      const response: AxiosResponse<ResponseDataType> = await axiosPrivate.get(
        "/play",
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const { currentChallenge, challengeSubmission } = response.data;

      if (challengeSubmission.isComplete) {
        navigate(`/challenge-history/`);
      } else {
        // Navigate to play-daily/:challengeId
        navigate(`play-daily/${currentChallenge.id}`, {
          state: {
            currentChallenge: currentChallenge,
            challengeSubmission: challengeSubmission,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return <Loading isFullPage={true} />;
  }

  return (
    userData &&
    !demoToken && (
      <>
        <div className="dashboard-wrapper">
          <div className="play">
            <div className="play-intro">
              Daily Challenge{" "}
              {isComplete ? <span>COMPLETE</span> : <span>AVAILABLE</span>}
            </div>
            {isComplete ? (
              <div className="play-complete-button" onClick={handlePlay}>
                Summary
              </div>
            ) : (
              <div className="play-challenge-button" onClick={handlePlay}>
                Play
              </div>
            )}

            <div>New challenge generated in:</div>
            <Timer
              timeRemaining={timeRemaining!}
              setTimeRemaining={setTimeRemaining}
            />
            <div className="streak">
              Current DailyGeo streak:{" "}
              <span>
                {userData?.challengeStreak}{" "}
                {userData.challengeStreak > 0 ? "🔥" : ""}
              </span>
            </div>
          </div>
        </div>
      </>
    )
  );
};
