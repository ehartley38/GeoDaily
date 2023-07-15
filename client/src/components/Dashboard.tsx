import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export const Dashboard = () => {
  const { auth } = useAuth();
  const [userData, setUserData] = useState();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await axiosPrivate.get("/users/data", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setUserData(userData.data);
        // console.log(userData.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
};
