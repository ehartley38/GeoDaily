import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";

export const SignOut = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const logoutUser = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <button onClick={logoutUser}>Logout</button>
    </>
  );
};
