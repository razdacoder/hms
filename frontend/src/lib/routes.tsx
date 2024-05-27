import Dashboard from "@/pages/Dashboard";
import ErrorPage from "@/pages/ErrorPage";
import Login from "@/pages/Login";
import Protected from "@/pages/Protected";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    element: <Protected />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
