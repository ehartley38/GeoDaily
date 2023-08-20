import { Outlet } from "react-router-dom";
import useUserData from "../hooks/useUserData";
import { NavBar } from "./NavBar";
import "./mainContent.css";

export const MainContent = () => {
  const { userData } = useUserData();

  return (
    <div className="main-container">
      <div className="left-content">
        <div className="nav-bar-wrapper">
          {/* Navbar */}
          {userData && <NavBar username={userData?.username} />}
        </div>
      </div>
      <div className="right-content">
        <header className="main-header">
          <div className="website-name">DailyGeo</div>
        </header>
        <div className="right-lower-wrapper">
          <div className="right-lower-content">
            {/* Main page content */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
