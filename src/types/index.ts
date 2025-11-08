// src/types/index.ts
export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive" | "suspended";
  avatar?: string;
  last_login?: string;
  created_at: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type DashboardStats = {
  user_stats: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  };
  product_stats: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    total_stock: number;
  };
  order_stats: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    total_revenue: number;
  };
  revenue_data: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  recent_activities: {
    recent_users: User[];
    recent_orders: any[];
    low_stock_products: any[];
  };
};
