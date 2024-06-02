import useUser from "@/hooks/useUser";
import { Navigate, Outlet } from "react-router-dom";

export default function Protected() {
  // is Authenticated
  const { isAuthenticated } = useUser();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
