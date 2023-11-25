import { useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";
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
    // <header className="primary-header">
    <nav className="primary-navigation">
      <div
        className={`play-button ${location.pathname === "/" ? "active" : ""}`}
        onClick={() => navigate("/")}
      >
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
    // </header>
  );
};
