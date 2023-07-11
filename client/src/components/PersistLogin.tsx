import { useEffect, useState } from "react";
import { useRefreshToken } from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import { Outlet } from "react-router-dom";
import { AuthType } from "../customTypings/auth";

export const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  const authType = auth as AuthType;

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // If we do not have an access token, then attempt to generate new one
    !authType?.accessToken && persist
      ? verifyRefreshToken()
      : setIsLoading(false);
  }, []);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  );
};
