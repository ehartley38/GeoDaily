import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { currentChallenge } from "../customTypings/currentChallenge";
import { challengeSubmission } from "../customTypings/challengeSubmission";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { SignOut } from "./auth/SignOut";
import { NavBar } from "./NavBar";
import "./Dashboard.css";
import { Timer } from "./Timer";

type UserDataType = {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  refreshToken: string;
  roleList: string[];
  challengeStreak: number;
};

type ResponseDataType = {
  currentChallenge: currentChallenge;
  challengeSubmission: challengeSubmission;
};

export const Dashboard = () => {
  const [userData, setUserData] = useState<UserDataType>();
  const [timeRemaining, setTimeRemaining] = useState<number>();
  const [isLoading, setIsLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await axiosPrivate.get("/users/data", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        const timeRemaining = await axiosPrivate.get("/play/time-remaining", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        setUserData(userData.data);
        setTimeRemaining(timeRemaining.data.timeRemaining);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handlePlay = async () => {
    try {
      const response: AxiosResponse<ResponseDataType> = await axiosPrivate.get(
        "/play",
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const { currentChallenge, challengeSubmission } = response.data;

      if (challengeSubmission.isComplete) {
        navigate(`/challenge-history/${currentChallenge.id}`);
      } else {
        // Navigate to play-daily/:challengeId
        navigate(`play-daily/${currentChallenge.id}`, {
          state: {
            currentChallenge: currentChallenge,
            challengeSubmission: challengeSubmission,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return <div>Loading!</div>;
  }

  return (
    <>
      <NavBar username={userData!.username} />

      <div className="center-content">
        <div className="website-name">DailyGeo</div>
        <div className="play">
          <div className="play-intro">
            Daily Challenge <span>AVAILABLE</span>
          </div>
          <div className="play-challenge-button" onClick={handlePlay}>
            Play
          </div>
          <div>New challenge generated in:</div>
          <Timer
            timeRemaining={timeRemaining!}
            setTimeRemaining={setTimeRemaining}
          />
          <div className="streak">
            Current DailyGeo streak: <span>{userData?.challengeStreak}</span>
          </div>
        </div>
      </div>

      {/* <h1>Dashboard</h1>
      <SignOut />
      <h2>{userData?.username}</h2>
      <div className="p-2">
        <button
          className="relative rounded px-5 py-2.5 overflow-hidden group bg-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
          onClick={handlePlay}
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative">Play</span>
        </button>

        <button
          className="relative rounded px-5 py-2.5 overflow-hidden group bg-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
          onClick={() => navigate("friends")}
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative">Friends</span>
        </button>

        <button
          className="relative rounded px-5 py-2.5 overflow-hidden group bg-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
          onClick={() => navigate("/challenge-history")}
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative">History</span>
        </button>
      </div> */}
    </>
  );
};
