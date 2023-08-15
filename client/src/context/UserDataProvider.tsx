import { useState, createContext, ReactNode } from "react";

import { UserDataType } from "../customTypings/userData";

type UserDataProviderProps = {
  children: ReactNode;
};

type UserDataContextType = {
  userData: UserDataType | undefined;
  setUserData: React.Dispatch<React.SetStateAction<UserDataType | undefined>>;
};

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export const UserDataProvider = ({ children }: UserDataProviderProps) => {
  const [userData, setUserData] = useState<UserDataType>();

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContext;
