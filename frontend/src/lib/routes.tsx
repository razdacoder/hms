import DashboardLayout from "@/components/DashboardLayout";
import Booking from "@/pages/Booking";
import Dashboard from "@/pages/Dashboard";
import ErrorPage from "@/pages/ErrorPage";
import Guest from "@/pages/Guest";
import Login from "@/pages/Login";
import Protected from "@/pages/Protected";
import Room from "@/pages/Room";
import Settings from "@/pages/Settings";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    element: (
      <DashboardLayout>
        <Protected />
      </DashboardLayout>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/rooms",
        element: <Room />,
      },
      {
        path: "/guests",
        element: <Guest />,
      },
      {
        path: "/bookings",
        element: <Booking />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
