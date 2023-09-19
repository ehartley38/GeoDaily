import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "./leaderboards.css";
import { Loading } from "./Loading";

type TopDailyType = {
  playerId: string;
  player: {
    username: string;
    profilePicture: number;
  };
  totalScore: number;
};

type HighestStreakType = {
  id: string;
  username: string;
  challengeStreak: number;
  profilePicture: number;
};

type TotalScoreType = {
  id: string;
  username: string;
  totalScoreSum: number;
  profilePicture: number;
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
  // const [userType, setUserType] = useState<UserType>("all");
  const [isUserScopeFriend, setIsUserScopeFriend] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getTopDaily(isUserScopeFriend);
  }, []);

  const getTopDaily = async (friendScope: boolean) => {
    setIsLoading(true);
    try {
      const res = await axiosPrivate.post(
        "/leaderboards/top-daily",
        { friendScope },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setTopDailyData(res.data.topDaily);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getHighestStreak = async (friendScope: boolean) => {
    setIsLoading(true);
    try {
      const res = await axiosPrivate.post(
        "/leaderboards/highest-streak",
        { friendScope },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setHighestStreakData(res.data.highestStreak);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalScoreMonthly = async (friendScope: boolean) => {
    setIsLoading(true);
    try {
      const res = await axiosPrivate.post(
        "/leaderboards/total-score/monthly",
        { friendScope },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setTotalScoreData(res.data.totalScoreMonthly);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalScoreAllTime = async (friendScope: boolean) => {
    setIsLoading(true);
    try {
      const res = await axiosPrivate.post(
        "/leaderboards/total-score/all-time",
        { friendScope },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setTotalScoreData(res.data.totalScoreAllTime);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Identify what leaderboard data to fetch
  const leaderboardRouter = async (
    type: LeaderboardType,
    timeframe: TimeframeType,
    friendScope: boolean
  ) => {
    setSelectedType(type);
    setSelectedTimeframe(timeframe);
    setIsUserScopeFriend(friendScope);

    if (type === "topDaily") return await getTopDaily(friendScope);

    if (type === "highestStreak") return await getHighestStreak(friendScope);

    if (type === "totalScore" && timeframe === "monthly")
      return await getTotalScoreMonthly(friendScope);

    if (type === "totalScore" && timeframe === "allTime")
      return await getTotalScoreAllTime(friendScope);
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
                  leaderboardRouter(selectedType, "allTime", isUserScopeFriend)
                }
              >
                All Time
              </a>
              <a
                className={`timeframe-lower ${
                  selectedTimeframe === "monthly" ? "selected-timeframe" : ""
                }`}
                onClick={() =>
                  leaderboardRouter(selectedType, "monthly", isUserScopeFriend)
                }
              >
                Current Month
              </a>
            </div>
          )}
          <div className="settings-right-content">
            <div className="friend-all-picker">
              <a
                className={`${isUserScopeFriend ? "selected" : ""}`}
                onClick={() =>
                  leaderboardRouter(selectedType, selectedTimeframe, true)
                }
              >
                Friends
              </a>
              <a
                className={`${!isUserScopeFriend ? "selected" : ""}`}
                onClick={() =>
                  leaderboardRouter(selectedType, selectedTimeframe, false)
                }
              >
                All Users
              </a>
            </div>
            <div className="leaderboard-type">
              <a
                className={`${selectedType === "topDaily" ? "selected" : ""}`}
                onClick={() =>
                  leaderboardRouter("topDaily", "", isUserScopeFriend)
                }
              >
                Top Daily
              </a>
              <a
                className={`${
                  selectedType === "highestStreak" ? "selected" : ""
                }`}
                onClick={() =>
                  leaderboardRouter("highestStreak", "", isUserScopeFriend)
                }
              >
                Highest Streak
              </a>
              <a
                className={`${selectedType === "totalScore" ? "selected" : ""}`}
                onClick={() =>
                  leaderboardRouter("totalScore", "allTime", isUserScopeFriend)
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
            {isLoading ? (
              <Loading isFullPage={false} />
            ) : (
              <div className="leaderboard-data">
                {topDailyData && selectedType === "topDaily" ? (
                  topDailyData.map((submission, i) => (
                    <div className="submission" key={i}>
                      <div className="submission-left">
                        <div>{i + 1}</div>
                        <img
                          src={`https://geodaily.s3.eu-west-2.amazonaws.com/avatars/${submission.player.profilePicture}.png`}
                          alt="avatar"
                        ></img>

                        <div> {submission.player.username}</div>
                      </div>

                      <div>{submission.totalScore}</div>
                    </div>
                  ))
                ) : (
                  <></>
                )}

                {highestStreakData && selectedType === "highestStreak" ? (
                  highestStreakData.map((user, i) => (
                    <div className="submission" key={i}>
                      <div className="submission-left">
                        <div>{i + 1}</div>
                        <img
                          src={`https://geodaily.s3.eu-west-2.amazonaws.com/avatars/${user.profilePicture}.png`}
                          alt="avatar"
                        ></img>

                        <div> {user.username}</div>
                      </div>

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
                      <div className="submission-left">
                        <div>{i + 1}</div>
                        <img
                          src={`https://geodaily.s3.eu-west-2.amazonaws.com/avatars/${user.profilePicture}.png`}
                          alt="avatar"
                        ></img>

                        <div> {user.username}</div>
                      </div>

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
                      <div className="submission-left">
                        <div>{i + 1}</div>
                        <img
                          src={`https://geodaily.s3.eu-west-2.amazonaws.com/avatars/${user.profilePicture}.png`}
                          alt="avatar"
                        ></img>

                        <div> {user.username}</div>
                      </div>

                      <div>{user.totalScoreSum}</div>
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
