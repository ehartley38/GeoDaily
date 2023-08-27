import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "./leaderboards.css";

type LeaderboardDataType = {
  playerId: string;
  player: {
    username: string;
  };
  totalScore: number;
};

export const Leaderboards = () => {
  const axiosPrivate = useAxiosPrivate();
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardDataType[]>();
  const [selectedType, setSelectedType] = useState<string>();

  const getTopDaily = async () => {
    const res = await axiosPrivate.get("/leaderboards/top-daily", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    setLeaderboardData(res.data.testData);
    setSelectedType("topDaily");
  };

  const getTotalScoreAllTime = async () => {
    const res = await axiosPrivate.get("/leaderboards/total-score/all-time", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    setLeaderboardData(res.data.totalScoreAllTime);
    setSelectedType("totalScore");
    console.log(res.data.totalScoreAllTime);
  };

  const getHighestStreak = async () => {
    const res = await axiosPrivate.get("/leaderboards/highest-streak", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    setLeaderboardData(res.data.highestStreak);
    setSelectedType("highestStreak");
  };

  return (
    <div className="leaderboards-page">
      <div className="leaderboard-card-wrapper">
        <div className="leaderboard-settings">
          <div className="timeframe-wrapper">
            <div className="timeframe-upper">All Time</div>
            <div className="timeframe-lower">Current Month</div>
          </div>
          <div className="leaderboard-type">
            <a
              className={`${selectedType === "topDaily" ? "selected" : ""}`}
              onClick={getTopDaily}
            >
              Top Daily
            </a>
            <a
              className={`${selectedType === "totalScore" ? "selected" : ""}`}
              onClick={getTotalScoreAllTime}
            >
              Total Score
            </a>
            <a
              className={`${
                selectedType === "highestStreak" ? "selected" : ""
              }`}
              onClick={getHighestStreak}
            >
              Highest Streak
            </a>
          </div>
        </div>

        <div className="leaderboard-card">
          <div className="leaderboard-card-inner-upper"></div>
          <div className="leaderboard-card-inner-lower">
            <div className="leaderboard-data">
              {/* {leaderboardData &&
                leaderboardData.map((submission, i) => (
                  <div className="submission" key={i}>
                    <div>{`${i + 1} ${submission.player.username}`}</div>
                    <div>{submission.totalScore}</div>
                  </div>
                ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
