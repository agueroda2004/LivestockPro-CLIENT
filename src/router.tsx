import { createBrowserRouter } from "react-router";
import Login from "@/features/auth/pages/Login";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import Layout from "./components/layout/Layout";
import Land from "./features/land/pages/Land";
import Race from "./features/race/pages/Race";
import Cattle from "./features/cattle/pages/Cattle";
import Transaction from "./features/transaction/pages/Transaction";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "/lands", element: <Land /> },
          { path: "/races", element: <Race /> },
          { path: "/cattle", element: <Cattle /> },
          { path: "/transactions", element: <Transaction /> },
        ],
      },
    ],
  },
]);
