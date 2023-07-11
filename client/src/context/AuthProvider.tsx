import { useState, createContext, ReactNode } from "react";
import { AuthType, PersistType } from "../customTypings/auth";

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextType = {
  auth: AuthType | {};
  setAuth: React.Dispatch<React.SetStateAction<AuthType | {}>>;
  persist: PersistType;
  setPersist: React.Dispatch<React.SetStateAction<PersistType>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthType | {}>({});
  // const [persist, setPersist] = useState<PersistType>(
  //   JSON.parse(localStorage.getItem("persist") || "{}") || false
  // );
  const [persist, setPersist] = useState<PersistType>(
    Boolean(localStorage.getItem("persist")) || false
  );

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        persist,
        setPersist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
