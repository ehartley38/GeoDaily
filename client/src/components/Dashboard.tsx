import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { currentChallenge } from "../customTypings/currentChallenge";
import { challengeSubmission } from "../customTypings/challengeSubmission";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

type UserDataType = {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  refreshToken: string;
  roleList: string[];
};

type ResponseDataType = {
  currentChallenge: currentChallenge;
  challengeSubmission: challengeSubmission;
};

export const Dashboard = () => {
  const [userData, setUserData] = useState<UserDataType>();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await axiosPrivate.get("/users/data", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setUserData(userData.data);
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

      console.log(currentChallenge);
      console.log(challengeSubmission);

      // Navigate to play-daily/:challengeId
      navigate(`play-daily/${currentChallenge.id}`, {
        state: {
          currentChallenge: currentChallenge,
          challengeSubmission: challengeSubmission,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1>Dashboard</h1>
      {userData?.username}
      <div className="p-2">
        <button
          className="relative rounded px-5 py-2.5 overflow-hidden group bg-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
          onClick={handlePlay}
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative">Play</span>
        </button>
      </div>
    </>
  );
};
