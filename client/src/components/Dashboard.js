import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../services/axios";

export const Dashboard = () => {
  const { auth } = useAuth();
  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get("/users/data", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setUserData(data);
    };
    console.log("Dashboard auth is", auth);
    // fetchData();
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      {/* {userData} */}
    </>
  );
};
