import { useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";
import IMAGES from "../images/images";
import useLogout from "../hooks/useLogout";

type NavBarProps = {
  username: string;
};

export const NavBar = ({ username }: NavBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();

  const logoutUser = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="primary-header">
      <div className="user-info">
        <div className="avatar">
          <img src={IMAGES.profilePicture} alt="avatar"></img>
        </div>
        <div className="username"> {username}</div>
      </div>
      <nav className="primary-navigation">
        <div className="play-button" onClick={() => navigate("/")}>
          <a>Play</a>
        </div>
        <div
          className={`friends-button ${
            location.pathname === "/friends" ? "active" : ""
          }`}
          onClick={() => navigate("friends")}
        >
          <a>Friends</a>
        </div>
        <div
          className={`leaderboards-button ${
            location.pathname === "/leaderboards" ? "active" : ""
          }`}
          onClick={() => navigate("/leaderboards")}
        >
          <a>Leaderboards</a>
        </div>
        <div
          className={`history-button ${
            location.pathname === "/challenge-history" ? "active" : ""
          }`}
          onClick={() => navigate("challenge-history")}
        >
          <a>History</a>
        </div>
        <div className="logout-button" onClick={logoutUser}>
          <a>Logout</a>
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
