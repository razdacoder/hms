import DashboardLayout from "@/components/DashboardLayout";
import BookingDetail from "@/features/bookings/components/BookingDetail";
import NewBooking from "@/features/bookings/components/NewBooking";
import Booking from "@/pages/Booking";
import Dashboard from "@/pages/Dashboard";
import ErrorPage from "@/pages/ErrorPage";
import Guest from "@/pages/Guest";
import Login from "@/pages/Login";
import ManageUsers from "@/pages/ManageUser";
import Protected from "@/pages/Protected";
import Room from "@/pages/Room";
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
        path: "/manage-users",
        element: <ManageUsers />,
      },
      {
        path: "/bookings/new",
        element: <NewBooking />,
      },
      {
        path: "/bookings/:id",
        element: <BookingDetail />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
