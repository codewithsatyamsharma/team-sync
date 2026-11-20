import React, { useEffect } from "react";
import { createBrowserRouter, Link, RouterProvider } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../../features/auth/ui/pages/Login";
import Register from "../../features/auth/ui/pages/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../../features/dashboard/ui/pages/Home";
import { useDispatch } from "react-redux";
import { currentLoggedEmployee } from "../../features/auth/state/auth/authAction";
import PublicRoute from "../protectedRoutes/PublicRoute";
import ProtectedRoute from "../protectedRoutes/ProtectedRoute";
import { commonRoutes } from "./commonRoutes";
import RoleBaseRoute from "../protectedRoutes/RoleBaseRoute";
import { adminRoutes } from "./adminRoutes";
import { employeeRoutes } from "./employeeRoutes";

const AppRoutes = () => {
  let dispatch = useDispatch();

  useEffect(() => {
    (() => {
      dispatch(currentLoggedEmployee());
    })();
  }, [dispatch]);

  let router = createBrowserRouter([
    {
      path: "/",
      element: <PublicRoute />,
      children: [
        {
          path: "",
          element: <AuthLayout />,
          children: [
            {
              path: "",
              element: <Login />,
            },
            {
              path: "register",
              element: <Register />,
            },
          ],
        },
      ],
    },

    {
      path: "/home",
      element: <ProtectedRoute />,
      children: [
        {
          path: "",
          element: <DashboardLayout />,
          children: [
            ...commonRoutes,
            {
              element: <RoleBaseRoute allowedRoles={"admin"} />,
              children: adminRoutes,
            },
            {
              element: <RoleBaseRoute allowedRoles={"employee"} />,
              children: employeeRoutes,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: (
        <main className="grid min-h-screen place-items-center bg-[var(--bg-main)] p-6 text-center text-[var(--text-primary)]">
          <div><h1 className="text-3xl font-bold">Page not found</h1><p className="mt-2 text-[var(--text-secondary)]">That page is unavailable or your role cannot open it.</p><Link className="mt-5 inline-block rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white" to="/home">Return to workspace</Link></div>
        </main>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
