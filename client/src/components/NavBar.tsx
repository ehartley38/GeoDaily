import "./navbar.css";

export const NavBar = () => {
  return (
    <nav className="navbar">
      <ul>
        <div className="website-title">
          <a href="#">DailyGeo</a>
        </div>

        <li>
          <a href="#">Play</a>
        </li>
        <li>
          <a href="#">Friends</a>
        </li>
        <li>
          <a href="#">History</a>
        </li>
        <li>
          <a href="#">Leaderboard</a>
        </li>
        <li>
          <a href="#">About </a>
        </li>
        <li className="last-item">
          <a href="#">Profile </a>
        </li>
      </ul>
      <a href="#" className="toggle-button">
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </a>
    </nav>
  );
};
