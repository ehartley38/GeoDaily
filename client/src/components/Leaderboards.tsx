import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "./leaderboards.css";

type TopDailyType = {
  playerId: string;
  player: {
    username: string;
  };
  totalScore: number;
};

type HighestStreakType = {
  id: string;
  username: string;
  challengeStreak: number;
};

type TotalScoreType = {
  id: string;
  username: string;
  totalScoreSum: number;
};

type LeaderboardType = "topDaily" | "totalScore" | "highestStreak";
type TimeframeType = "monthly" | "allTime" | "";

export const Leaderboards = () => {
  const axiosPrivate = useAxiosPrivate();

  const [topDailyData, setTopDailyData] = useState<TopDailyType[]>();
  const [highestStreakData, setHighestStreakData] =
    useState<HighestStreakType[]>();
  const [totalScoreData, setTotalScoreData] = useState<TotalScoreType[]>();

  const [selectedType, setSelectedType] = useState<LeaderboardType>("topDaily");
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeType>("");

  const getTopDaily = async () => {
    const res = await axiosPrivate.get("/leaderboards/top-daily", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    setTopDailyData(res.data.topDaily);
  };

  const getHighestStreak = async () => {
    const res = await axiosPrivate.get("/leaderboards/highest-streak", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    setHighestStreakData(res.data.highestStreak);
  };

  const getTotalScoreMonthly = async () => {
    const res = await axiosPrivate.get("/leaderboards/total-score/monthly", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    setTotalScoreData(res.data.totalScoreMonthly);
  };

  const getTotalScoreAllTime = async () => {
    const res = await axiosPrivate.get("/leaderboards/total-score/all-time", {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    setTotalScoreData(res.data.totalScoreAllTime);
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
          <div className="leaderboard-card-inner-upper">
            {selectedType === "topDaily" ? (
              <div>Today's Top Scores</div>
            ) : (
              <></>
            )}
            {selectedType === "highestStreak" ? (
              <div>Highest GeoDaily Streak</div>
            ) : (
              <></>
            )}

            {selectedType === "totalScore" &&
            selectedTimeframe === "monthly" ? (
              <div>Largest Total Score - Monthly</div>
            ) : (
              <></>
            )}
            {selectedType === "totalScore" &&
            selectedTimeframe === "allTime" ? (
              <div>Largest Total Score - All Time</div>
            ) : (
              <></>
            )}
          </div>
          <div className="leaderboard-card-inner-lower">
            <div className="leaderboard-data">
              {topDailyData && selectedType === "topDaily" ? (
                topDailyData.map((submission, i) => (
                  <div className="submission" key={i}>
                    <div>{`${i + 1} ${submission.player.username}`}</div>
                    <div>{submission.totalScore}</div>
                  </div>
                ))
              ) : (
                <></>
              )}

              {highestStreakData && selectedType === "highestStreak" ? (
                highestStreakData.map((user, i) => (
                  <div className="submission" key={i}>
                    <div>{`${i + 1} ${user.username}`}</div>
                    <div>{user.challengeStreak}</div>
                  </div>
                ))
              ) : (
                <></>
              )}

              {totalScoreData &&
              selectedType === "totalScore" &&
              selectedTimeframe === "allTime" ? (
                totalScoreData.map((user, i) => (
                  <div className="submission" key={i}>
                    <div>{`${i + 1} ${user.username}`}</div>
                    <div>{user.totalScoreSum}</div>
                  </div>
                ))
              ) : (
                <></>
              )}

              {totalScoreData &&
              selectedType === "totalScore" &&
              selectedTimeframe === "monthly" ? (
                totalScoreData.map((user, i) => (
                  <div className="submission" key={i}>
                    <div>{`${i + 1} ${user.username}`}</div>
                    <div>{user.totalScoreSum}</div>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
