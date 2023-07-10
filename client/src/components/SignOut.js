import useLogout from "../hooks/useLogout";

export const SignOut = () => {
  const logout = useLogout();

  const logoutUser = async () => {
    await logout();
  };

  return (
    <>
      <button onClick={logoutUser}>Logout</button>
    </>
  );
};
