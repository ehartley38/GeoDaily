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

type LeaderboardType = "topDaily" | "totalScore" | "highestStreak";
type TimeframeType = "monthly" | "allTime" | "";

export const Leaderboards = () => {
  const axiosPrivate = useAxiosPrivate();
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardDataType[]>();
  const [selectedType, setSelectedType] = useState<LeaderboardType>("topDaily");
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeType>("");

  const getTopDaily = async () => {
    const res = await axiosPrivate.get("/leaderboards/top-daily", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    console.log("Top daily");
    setLeaderboardData(res.data.testData);
  };

  const getTotalScoreMonthly = async () => {
    const res = await axiosPrivate.get("/leaderboards/total-score/monthly", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    console.log("Total score monthly");
    setLeaderboardData(res.data.totalScoreMonthly);
  };

  const getTotalScoreAllTime = async () => {
    const res = await axiosPrivate.get("/leaderboards/total-score/all-time", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    console.log("Total score all time");

    setLeaderboardData(res.data.totalScoreAllTime);
  };

  const getHighestStreak = async () => {
    const res = await axiosPrivate.get("/leaderboards/highest-streak", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    console.log("Highest streak");
    console.log(res.data.highestStreak);

    setLeaderboardData(res.data.highestStreak);
  };

  // Check what leaderboard data to fetch
  const leaderboardRouter = async (
    type: LeaderboardType,
    timeframe: TimeframeType
  ) => {
    setSelectedType(type);
    setSelectedTimeframe(timeframe);

    if (type === "topDaily") return await getTopDaily();

    if (type === "highestStreak") return await getHighestStreak();

    if (type === "totalScore" && timeframe === "monthly")
      return await getTotalScoreMonthly();

    if (type === "totalScore" && timeframe === "allTime")
      return await getTotalScoreAllTime();
  };

  return (
    <div className="leaderboards-page">
      <div className="leaderboard-card-wrapper">
        <div className="leaderboard-settings">
          {selectedType === "topDaily" || selectedType === "highestStreak" ? (
            <div className="timeframe-not-allowed-wrapper">
              <div className="timeframe-upper">All Time</div>
              <div className="timeframe-lower">Current Month</div>
            </div>
          ) : (
            <div className="timeframe-wrapper">
              <div
                className={`timeframe-upper ${
                  selectedTimeframe === "allTime" ? "selected" : ""
                }`}
                onClick={() => leaderboardRouter(selectedType, "allTime")}
              >
                All Time
              </div>
              <div
                className={`timeframe-lower ${
                  selectedTimeframe === "monthly" ? "selected" : ""
                }`}
                onClick={() => leaderboardRouter(selectedType, "monthly")}
              >
                Current Month
              </div>
            </div>
          )}

          <div className="leaderboard-type">
            <a
              className={`${selectedType === "topDaily" ? "selected" : ""}`}
              onClick={() => leaderboardRouter("topDaily", "")}
            >
              Top Daily
            </a>
            <a
              className={`${
                selectedType === "highestStreak" ? "selected" : ""
              }`}
              onClick={() => leaderboardRouter("highestStreak", "")}
            >
              Highest Streak
            </a>
            <a
              className={`${selectedType === "totalScore" ? "selected" : ""}`}
              onClick={() => leaderboardRouter("totalScore", "allTime")}
            >
              Total Score
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
