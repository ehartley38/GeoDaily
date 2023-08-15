import { useContext } from "react";
import UserDataContext from "../context/UserDataProvider";

const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within an UserDataProvider");
  }
  return context;
};

export default useUserData;
