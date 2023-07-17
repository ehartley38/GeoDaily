import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

type UserDataType = {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  refreshToken: string;
  roleList: string[];
};

export const Dashboard = () => {
  const [userData, setUserData] = useState<UserDataType>();
  const axiosPrivate = useAxiosPrivate();

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

  return (
    <>
      <h1>Dashboard</h1>
      {userData?.username}
      <div className="p-2">
        <a
          href="#_"
          className="relative rounded px-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300"
        >
          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
          <span className="relative">Play</span>
        </a>
      </div>
    </>
  );
};
