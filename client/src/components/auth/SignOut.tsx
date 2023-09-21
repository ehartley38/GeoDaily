import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";

export const SignOut = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const logoutUser = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <button onClick={logoutUser}>Logout</button>
    </>
  );
};
