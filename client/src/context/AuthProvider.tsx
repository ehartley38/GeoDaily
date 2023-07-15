import { useState, createContext, ReactNode } from "react";
import { AuthType } from "../customTypings/auth";

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextType = {
  auth: AuthType | {};
  setAuth: React.Dispatch<React.SetStateAction<AuthType | {}>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthType | {}>({});

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
