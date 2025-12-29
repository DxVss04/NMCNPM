import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../localStorage/authStorage";

export default function ProtectedRoute() {
  // Kiểm tra authentication từ sessionStorage
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
