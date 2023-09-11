import { useState, useEffect } from "react";
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
type UserType = "friend" | "all";

export const Leaderboards = () => {
  const axiosPrivate = useAxiosPrivate();
  const [topDailyData, setTopDailyData] = useState<TopDailyType[]>();
  const [highestStreakData, setHighestStreakData] =
    useState<HighestStreakType[]>();
  const [totalScoreData, setTotalScoreData] = useState<TotalScoreType[]>();
  const [selectedType, setSelectedType] = useState<LeaderboardType>("topDaily");
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeType>("");
  const [userType, setUserType] = useState<UserType>("all");

  useEffect(() => {
    getTopDaily();
  }, []);

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
    timeframe: TimeframeType,
    user: UserType
  ) => {
    setSelectedType(type);
    setSelectedTimeframe(timeframe);
    setUserType(user);

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
              <a className="timeframe-upper">All Time</a>
              <a className="timeframe-lower">Current Month</a>
            </div>
          ) : (
            <div className="timeframe-wrapper">
              <a
                className={`timeframe-upper ${
                  selectedTimeframe === "allTime" ? "selected-timeframe" : ""
                }`}
                onClick={() =>
                  leaderboardRouter(selectedType, "allTime", userType)
                }
              >
                All Time
              </a>
              <a
                className={`timeframe-lower ${
                  selectedTimeframe === "monthly" ? "selected-timeframe" : ""
                }`}
                onClick={() =>
                  leaderboardRouter(selectedType, "monthly", userType)
                }
              >
                Current Month
              </a>
            </div>
          )}
          <div className="settings-right-content">
            <div className="friend-all-picker">
              <a
                className={`${userType === "friend" ? "selected" : ""}`}
                onClick={() =>
                  leaderboardRouter(selectedType, selectedTimeframe, "friend")
                }
              >
                Friends
              </a>
              <a
                className={`${userType === "all" ? "selected" : ""}`}
                onClick={() =>
                  leaderboardRouter(selectedType, selectedTimeframe, "all")
                }
              >
                All Users
              </a>
            </div>
            <div className="leaderboard-type">
              <a
                className={`${selectedType === "topDaily" ? "selected" : ""}`}
                onClick={() => leaderboardRouter("topDaily", "", userType)}
              >
                Top Daily
              </a>
              <a
                className={`${
                  selectedType === "highestStreak" ? "selected" : ""
                }`}
                onClick={() => leaderboardRouter("highestStreak", "", userType)}
              >
                Highest Streak
              </a>
              <a
                className={`${selectedType === "totalScore" ? "selected" : ""}`}
                onClick={() =>
                  leaderboardRouter("totalScore", "allTime", userType)
                }
              >
                Total Score
              </a>
            </div>
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
