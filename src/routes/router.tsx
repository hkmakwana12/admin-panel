import {
  createBrowserRouter,
} from "react-router-dom";
import AppLayout from "@/layouts/app-layout";

import GuestRoute from "@/auth/guest-route";
import ProtectedRoute from "@/auth/protected-route";

import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";

import Categories from "@/modules/categories/pages/categories-page";
import Users from "@/modules/users/pages/users-page";
import Products from "@/modules/products/pages/products-page";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <GuestRoute />,
    children: [
      {
        path: "login",
        element: <Login />,
      }
    ]
  },
  /*
  | -----------------------
  | Protected routes
  | -----------------------
  */
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/categories",
            element: <Categories />,
          },
          {
            path: "/products",
            element: <Products />,
          },
          {
            path: "/users",
            element: <Users />,
          },
        ],
      },
    ],
  },
]);

export default router;
