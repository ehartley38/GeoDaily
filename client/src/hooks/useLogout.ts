import axios from "../services/axios";
import useAuth from "./useAuth";
import useUserData from "./useUserData";

const useLogout = () => {
  const { setAuth } = useAuth();
  const { setUserData } = useUserData();

  const logout = async () => {
    setAuth({});
    setUserData(undefined);
    try {
      const response = await axios("/logout", {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return logout;
};

export default useLogout;
