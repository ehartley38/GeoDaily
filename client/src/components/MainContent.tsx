import { Outlet, useLocation } from "react-router-dom";
import useUserData from "../hooks/useUserData";
import { NavBar } from "./NavBar";
import "./mainContent.css";
import IMAGES from "../images/images";
import { PlayDaily } from "./PlayDaily";
import { Loading } from "./Loading";
import { useEffect } from "react";
import useIsBackgroundDisabled from "../hooks/useIsBackgroundDisabled";

export const MainContent = () => {
  const { userData } = useUserData();
  const { isBackgroundDisabled } = useIsBackgroundDisabled();
  const location = useLocation();

  const isNotPlayDailyRoute = !location.pathname.startsWith("/play-daily");

  // if (!userData) return <Loading isFullPage={true} />;

  return (
    <>
      {isNotPlayDailyRoute ? (
        <div
          className={
            isBackgroundDisabled
              ? "main-container pointer-events-disabled"
              : "main-container"
          }
        >
          <header className="main-header">
            <img className="logo" src={IMAGES.logo}></img>
            <div className="user-info-wrapper">
              <div className="user-info">
                <div className="avatar">
                  <img
                    src={`https://geodaily.s3.eu-west-2.amazonaws.com/avatars/${userData?.profilePicture}.png`}
                    alt="avatar"
                  ></img>
                </div>
                <div className="username"> {userData?.username}</div>
              </div>
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
      ) : (
        <div className={isBackgroundDisabled ? "pointer-events-disabled" : ""}>
          <PlayDaily />
        </div>
      )}
    </>
  );
};
