import AppLayout from "@/layouts/app-layout"
import DashboardPage from "@/pages/dashboard"
import UsersPage from "@/pages/users"
import UserFormPage from "@/pages/user-form" // single form component

const routes = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true, // '/'
        element: <DashboardPage />,
      },

      // /users routes
      {
        path: "users",
        children: [
          {
            index: true, // '/users'
            element: <UsersPage />,
          },
          {
            path: "create", // '/users/create'
            element: <UserFormPage />,
          },
          {
            path: ":id/edit", // '/users/:id/edit'
            element: <UserFormPage />,
          },
        ],
      },
    ],
  },
]

export default routes
