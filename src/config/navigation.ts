import {
  IconDashboard,
  IconListDetails,
  IconChartBar,
  IconFolder,
  IconUsers,
  type Icon,
} from "@tabler/icons-react";

export type NavItem = {
  title: string;
  url: string;
  icon?: Icon;
};

export type NavigationConfig = {
  navMain: NavItem[];
};

export const navigation: NavigationConfig = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Categories",
      url: "/categories",
      icon: IconListDetails,
    },
    {
      title: "Users",
      url: "/users",
      icon: IconUsers,
    },
    {
      title: "Products",
      url: "/products",
      icon: IconFolder,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: IconChartBar,
    },
  ],
};
