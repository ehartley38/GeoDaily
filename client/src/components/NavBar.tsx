import "./navbar.css";

type NavBarProps = {
  username: string;
};

export const NavBar = ({ username }: NavBarProps) => {
  return (
    <header className="primary-header">
      <div className="user-info">Welcome {username}</div>
      <nav className="primary-navigation">
        <div className="play-button">
          <a>Play</a>
        </div>
        <div className="friends-button">
          <a>Friends</a>
        </div>
        <div className="leaderboards-button">
          <a>Leaderboards</a>
        </div>
        <div className="history-button">
          <a>History</a>
        </div>
        <div className="about-button">
          <a>About</a>
        </div>
      </nav>
    </header>
  );
};

// <nav className="navbar">
//   <ul>
//     <div className="website-title">
//       <a href="#">DailyGeo</a>
//     </div>

//     <li>
//       <a href="#">Play</a>
//     </li>
//     <li>
//       <a href="#">Friends</a>
//     </li>
//     <li>
//       <a href="#">History</a>
//     </li>
//     <li>
//       <a href="#">Leaderboard</a>
//     </li>
//     <li>
//       <a href="#">About </a>
//     </li>
//     <li className="last-item">
//       <a href="#">Profile </a>
//     </li>
//   </ul>
// </nav>
