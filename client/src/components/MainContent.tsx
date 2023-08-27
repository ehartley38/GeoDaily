import { Outlet } from "react-router-dom";
import useUserData from "../hooks/useUserData";
import { NavBar } from "./NavBar";
import "./mainContent.css";
import IMAGES from "../images/images";

export const MainContent = () => {
  const { userData } = useUserData();

  return (
    <div className="main-container">
      <header className="main-header">
        <img className="logo" src={IMAGES.logo}></img>
        {/* <div className="website-name">DailyGeo</div> */}
        <div className="user-info">
          <div className="avatar">
            <img src={IMAGES.profilePicture} alt="avatar"></img>
          </div>
          <div className="username"> {userData?.username}</div>
        </div>
      </header>
      <div className="lower-content">
        <div className="left-lower-content">
          <div className="nav-bar-wrapper">
            {/* Navbar */}
            {userData && <NavBar username={userData?.username} />}
          </div>
        </div>
        <div className="right-lower-content">
          {/* Main page content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};