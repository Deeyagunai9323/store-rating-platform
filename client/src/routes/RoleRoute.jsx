import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles }) => {
  const {
    role,
    isAuthenticated,
  } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const hasAccess = allowedRoles.some(
    (allowedRole) =>
      role === allowedRole.toUpperCase()
  );

  if (!hasAccess) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
};

export default RoleRoute;