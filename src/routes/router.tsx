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
import ProductForm from "@/modules/products/pages/product-form";

import Orders from "@/modules/orders/pages/orders-page";
import OrderForm from "@/modules/orders/pages/order-form";

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
            children: [
              {
                index: true,
                element: <Products />,
              },
              {
                path: 'create',
                element: <ProductForm />
              },
              {
                path: ':id/edit',
                element: <ProductForm />
              }
            ]
          },
          {
            path: "/orders",
            children: [
              {
                index: true,
                element: <Orders />,
              },
              {
                path: 'create',
                element: <OrderForm />
              },
              {
                path: ':id/edit',
                element: <OrderForm />
              }
            ]
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
