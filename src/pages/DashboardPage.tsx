// src/pages/DashboardPage.tsx
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Flex,
  Grid,
  Card,
  Text,
  Heading,
  Button,
  Badge,
  Avatar
} from '@radix-ui/themes';
import {
  PersonIcon,
  CubeIcon,
  ShoppingCartIcon,
  DollarSignIcon,
  DownloadIcon
} from '@radix-ui/react-icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { dashboardService } from '../services/dashboard-service';

const COLORS = ['var(--green-9)', 'var(--red-9)', 'var(--yellow-9)', 'var(--blue-9)'];

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardService.getStats,
  });

  if (isLoading) {
    return (
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Box>
            <Heading size="7">Dashboard</Heading>
            <Text color="gray">Welcome to your admin dashboard</Text>
          </Box>
          <Button disabled>
            <DownloadIcon />
            Download Report
          </Button>
        </Flex>

        {/* Loading skeletons */}
        <Grid columns={{ initial: '1', sm: '2', lg: '4' }} gap="4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <Flex gap="3" align="center">
                <Box width="6" height="6" style={{ backgroundColor: 'var(--gray-5)', borderRadius: '50%' }} />
                <Box>
                  <Box width="8" height="4" style={{ backgroundColor: 'var(--gray-5)', borderRadius: 'var(--radius-1)' }} mb="1" />
                  <Box width="12" height="3" style={{ backgroundColor: 'var(--gray-4)', borderRadius: 'var(--radius-1)' }} />
                </Box>
              </Flex>
            </Card>
          ))}
        </Grid>
      </Flex>
    );
  }

  const userDistribution = data ? [
    { name: 'Active', value: data.user_stats.active },
    { name: 'Inactive', value: data.user_stats.inactive },
    { name: 'Suspended', value: data.user_stats.suspended },
  ] : [];

  const stats = [
    {
      title: 'Total Users',
      value: data?.user_stats.total || 0,
      icon: PersonIcon,
      description: `${data?.user_stats.active || 0} active users`,
      color: 'blue'
    },
    {
      title: 'Total Products',
      value: data?.product_stats.total || 0,
      icon: CubeIcon,
      description: `${data?.product_stats.published || 0} published`,
      color: 'green'
    },
    {
      title: 'Total Orders',
      value: data?.order_stats.total || 0,
      icon: ShoppingCartIcon,
      description: `${data?.order_stats.pending || 0} pending`,
      color: 'orange'
    },
    {
      title: 'Total Revenue',
      value: `$${(data?.order_stats.total_revenue || 0).toLocaleString()}`,
      icon: DollarSignIcon,
      description: 'Lifetime revenue',
      color: 'purple'
    },
  ];

  return (
    <Flex direction="column" gap="6">
      <Flex justify="between" align="center">
        <Box>
          <Heading size="7">Dashboard</Heading>
          <Text color="gray" size="2">
            Welcome to your admin dashboard
          </Text>
        </Box>
        <Button>
          <DownloadIcon />
          Download Report
        </Button>
      </Flex>

      {/* Stats Grid */}
      <Grid columns={{ initial: '1', sm: '2', lg: '4' }} gap="4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <Flex gap="3" align="center">
              <Flex
                align="center"
                justify="center"
                style={{
                  backgroundColor: `var(--${stat.color}-3)`,
                  color: `var(--${stat.color}-11)`,
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-3)'
                }}
              >
                <stat.icon />
              </Flex>
              <Box>
                <Text as="div" size="2" weight="bold">
                  {stat.value}
                </Text>
                <Text as="div" size="1" color="gray">
                  {stat.title}
                </Text>
                <Text as="div" size="1" color="gray">
                  {stat.description}
                </Text>
              </Box>
            </Flex>
          </Card>
        ))}
      </Grid>

      {/* Charts Grid */}
      <Grid columns={{ initial: '1', lg: '2' }} gap="6">
        <Card>
          <Heading size="4" mb="4">Revenue Overview</Heading>
          <Box height="300px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.revenue_data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--accent-9)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        <Card>
          <Heading size="4" mb="4">User Distribution</Heading>
          <Box height="300px">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="4">
        {/* Recent Users */}
        <Card>
          <Heading size="4" mb="4">Recent Users</Heading>
          <Flex direction="column" gap="3">
            {data?.recent_activities.recent_users.map((user) => (
              <Flex key={user.id} align="center" gap="3">
                <Avatar
                  size="2"
                  radius="full"
                  fallback={user.name.split(' ').map(n => n[0]).join('')}
                />
                <Box flexGrow="1">
                  <Text weight="bold" size="2">{user.name}</Text>
                  <Text color="gray" size="1">{user.email}</Text>
                </Box>
                <Badge color={user.status === 'active' ? 'green' : 'red'}>
                  {user.status}
                </Badge>
              </Flex>
            ))}
          </Flex>
        </Card>

        {/* Recent Orders */}
        <Card>
          <Heading size="4" mb="4">Recent Orders</Heading>
          <Flex direction="column" gap="3">
            {data?.recent_activities.recent_orders.map((order) => (
              <Flex key={order.id} justify="between" align="center">
                <Box>
                  <Text weight="bold" size="2">{order.order_number}</Text>
                  <Text color="gray" size="1">{order.user?.name}</Text>
                </Box>
                <Flex direction="column" align="end" gap="1">
                  <Text weight="bold">${order.total_amount}</Text>
                  <Badge variant="outline">{order.status}</Badge>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <Heading size="4" mb="4">Low Stock</Heading>
          <Flex direction="column" gap="3">
            {data?.recent_activities.low_stock_products.map((product) => (
              <Flex key={product.id} justify="between" align="center">
                <Box flexGrow="1">
                  <Text weight="bold" size="2">{product.name}</Text>
                  <Text color="gray" size="1">Stock: {product.stock}</Text>
                </Box>
                <Badge color="red">Low</Badge>
              </Flex>
            ))}
          </Flex>
        </Card>
      </Grid>
    </Flex>
  );
}