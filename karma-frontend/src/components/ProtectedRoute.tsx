import { ReactNode } from "react";
import { Role } from "../global";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: Role[];
}) {
  const { user, status } = useAuth();

  if (status !== "resolved") {
    <p>Loading user...</p>;
  } else if (!user || (roles && !roles.includes(user.role))) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
