import "./leaderboards.css";

export const Leaderboards = () => {
  return (
    <div className="leaderboards-page">
      <div className="leaderboard-card-wrapper">
        <div className="leaderboard-settings">
          <div className="timeframe-wrapper">
            <div className="timeframe-upper"></div>
            <div className="timeframe-lower"></div>
          </div>
          <div className="leaderboard-type">
            <div>Top Daily</div>
            <div>Total Score</div>
            <div>Highest Streak</div>
          </div>
        </div>

        <div className="leaderboard-card">
          <div className="leaderboard-card-inner-upper"></div>
          <div className="leaderboard-card-inner-lower"></div>
        </div>
      </div>
    </div>
  );
};
