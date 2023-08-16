import { Outlet } from "react-router-dom";
import useUserData from "../hooks/useUserData";
import { NavBar } from "./NavBar";
import "./mainContent.css";

export const MainContent = () => {
  const { userData } = useUserData();

  return (
    <div className="main-container">
      <div className="left-div">
        {/* Navbar */}
        {userData && <NavBar username={userData?.username} />}
      </div>
      <div className="right-div">
        {/* Main page content */}
        <Outlet />
      </div>
    </div>
  );
};
