import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { AuthType } from "../customTypings/auth";

type RequireAuthProps = {
  allowedRoles: string[];
};

export const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const { auth } = useAuth();
  const authType = auth as AuthType;

  const location = useLocation();

  return authType?.roleList?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : authType?.accessToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
