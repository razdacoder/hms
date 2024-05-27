import { Navigate, Outlet } from "react-router-dom";

export default function Protected() {
  // is Authenticated
  const localStorageToken = localStorage.getItem("token");
  return localStorageToken ? <Outlet /> : <Navigate to="/login" replace />;
}
