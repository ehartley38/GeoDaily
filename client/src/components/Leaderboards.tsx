import "./leaderboards.css";

export const Leaderboards = () => {
  return (
    <div className="leaderboards-page">
      <div className="page-header">
        <div className="page-title">Leaderboards</div>
        <div className="title-bar"></div>
      </div>
      <div className="leaderboard-cards">
        <div className="leaderboard-card-outer daily-score">
          <div className="leaderboard-card-inner-upper"></div>
          <div className="leaderboard-card-inner-lower"></div>
        </div>
        <div className="leaderboard-card-outer daily-score">
          <div className="leaderboard-card-inner-upper"></div>
          <div className="leaderboard-card-inner-lower"></div>
        </div>
        <div className="leaderboard-card-outer daily-score">
          <div className="leaderboard-card-inner-upper"></div>
          <div className="leaderboard-card-inner-lower"></div>
        </div>
      </div>
    </div>
  );
};
