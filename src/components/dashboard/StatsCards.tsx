// src/components/dashboard/StatsCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardStats } from '@/types';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';

interface StatsCardsProps {
  data: DashboardStats | undefined;
  isLoading: boolean;
}

export function StatsCards({ data, isLoading }: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Users',
      value: data?.user_stats.total || 0,
      icon: Users,
      description: `${data?.user_stats.active || 0} active users`,
    },
    {
      title: 'Total Products',
      value: data?.product_stats.total || 0,
      icon: Package,
      description: `${data?.product_stats.published || 0} published`,
    },
    {
      title: 'Total Orders',
      value: data?.order_stats.total || 0,
      icon: ShoppingCart,
      description: `${data?.order_stats.pending || 0} pending`,
    },
    {
      title: 'Total Revenue',
      value: `$${(data?.order_stats.total_revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      description: 'Lifetime revenue',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px] mb-2" />
              <Skeleton className="h-4 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}