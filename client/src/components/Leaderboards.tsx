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
    setSelectedType("top-daily");
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
              className={`${selectedType === "top-daily" ? "selected" : ""}`}
              onClick={getTopDaily}
            >
              Top Daily
            </a>
            <a>Total Score</a>
            <a>Highest Streak</a>
          </div>
        </div>

        <div className="leaderboard-card">
          <div className="leaderboard-card-inner-upper"></div>
          <div className="leaderboard-card-inner-lower">
            <div className="leaderboard-data">
              {leaderboardData &&
                leaderboardData.map((submission, i) => (
                  <div className="submission" key={i}>
                    <div>{`${i + 1} ${submission.player.username}`}</div>
                    <div>{submission.totalScore}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
