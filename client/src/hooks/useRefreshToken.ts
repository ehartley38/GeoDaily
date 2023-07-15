import axios from "../services/axios";
import useAuth from "./useAuth";

export const useRefreshToken = () => {
  const { setAuth, auth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refreshTokens", {
      withCredentials: true,
    });
    setAuth({
      ...auth,
      roleList: response.data.roleList,
      accessToken: response.data.accessToken,
    });
    return response.data.accessToken;
  };

  return refresh;
};
