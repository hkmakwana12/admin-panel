// src/components/layout/AdminLayout.tsx
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Avatar,
  DropdownMenu,
  Button,
  Separator,
  Badge,
  Container
} from '@radix-ui/themes';
import {
  Menu,
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  LogOut,
  Settings,
  Bell,
  Mail,
  User as UserIcon
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../stores/auth-store';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth-service';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      navigate('/login');
    },
  });

  const NavItem = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = location.pathname === item.href;

    return (
      <Link to={item.href} onClick={() => setSidebarOpen(false)}>
        <Button
          variant={isActive ? 'solid' : 'ghost'}
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            backgroundColor: isActive ? 'var(--accent-9)' : 'transparent',
            color: isActive ? 'white' : 'var(--gray-11)',
          }}
          size="3"
        >
          <item.icon size={16} />
          {item.name}
        </Button>
      </Link>
    );
  };

  return (
    <Flex height="100vh">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <Box
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--black-a9)',
            zIndex: 40,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Box
        style={{
          width: '280px',
          backgroundColor: 'var(--color-panel)',
          borderRight: '1px solid var(--gray-6)',
          display: { initial: sidebarOpen ? 'block' : 'none', md: 'block' },
          position: { initial: 'fixed', md: 'static' },
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
        }}
      >
        <Flex direction="column" height="100%">
          {/* Logo/Sidebar Header */}
          <Box p="5" style={{ borderBottom: '1px solid var(--gray-6)' }}>
            <Flex align="center" gap="3">
              <Box
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--accent-9)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <LayoutDashboard size={16} />
              </Box>
              <Box>
                <Text weight="bold" size="4">Admin Panel</Text>
                <Text size="1" color="gray">v1.0.0</Text>
              </Box>
            </Flex>
          </Box>

          {/* User Info */}
          <Box p="4" style={{ borderBottom: '1px solid var(--gray-6)' }}>
            <Flex align="center" gap="3">
              <Avatar
                size="3"
                radius="full"
                fallback={user?.name?.charAt(0) || 'U'}
                color="blue"
              />
              <Box flexGrow="1">
                <Text weight="bold" size="2">{user?.name}</Text>
                <Text size="1" color="gray">{user?.email}</Text>
              </Box>
              <Badge color={user?.role === 'admin' ? 'red' : 'blue'} size="1">
                {user?.role}
              </Badge>
            </Flex>
          </Box>

          {/* Navigation */}
          <Box flexGrow="1" p="4">
            <Flex direction="column" gap="2">
              <Text size="1" weight="bold" color="gray" style={{ padding: '8px 12px' }}>
                MAIN MENU
              </Text>
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </Flex>
          </Box>

          {/* Sidebar Footer */}
          <Box p="4" style={{ borderTop: '1px solid var(--gray-6)' }}>
            <Button
              variant="ghost"
              style={{ width: '100%', justifyContent: 'flex-start' }}
              size="3"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut size={16} />
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </Box>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box flexGrow="1" display="flex" direction="column">
        {/* Header */}
        <Box
          style={{
            borderBottom: '1px solid var(--gray-6)',
            backgroundColor: 'var(--color-panel)',
          }}
        >
          <Container size="4" p="4">
            <Flex align="center" justify="between">
              <Flex align="center" gap="4">
                <Button
                  variant="ghost"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  style={{ display: { md: 'none' } }}
                >
                  <Menu size={16} />
                </Button>
                <Box>
                  <Text weight="bold" size="5">
                    {navigation.find((nav) => nav.href === location.pathname)?.name || 'Dashboard'}
                  </Text>
                  <Text size="2" color="gray">
                    Welcome back, {user?.name}
                  </Text>
                </Box>
              </Flex>

              <Flex align="center" gap="3">
                {/* Notifications */}
                <Button variant="ghost" size="2">
                  <Bell size={16} />
                </Button>

                {/* Messages */}
                <Button variant="ghost" size="2">
                  <Mail size={16} />
                </Button>

                {/* User Menu */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="ghost">
                      <Flex align="center" gap="2">
                        <Avatar
                          size="2"
                          radius="full"
                          fallback={user?.name?.charAt(0) || 'U'}
                        />
                        <Box display={{ initial: 'none', sm: 'block' }}>
                          <Text size="2">{user?.name}</Text>
                        </Box>
                      </Flex>
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item>
                      <Flex align="center" gap="2">
                        <UserIcon size={16} />
                        <Text>Profile</Text>
                      </Flex>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                      <Flex align="center" gap="2">
                        <Settings size={16} />
                        <Text>Settings</Text>
                      </Flex>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item
                      color="red"
                      onClick={() => logoutMutation.mutate()}
                      disabled={logoutMutation.isPending}
                    >
                      <Flex align="center" gap="2">
                        <LogOut size={16} />
                        <Text>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</Text>
                      </Flex>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Flex>
            </Flex>
          </Container>
        </Box>

        {/* Page Content */}
        <Box flexGrow="1" style={{ overflow: 'auto', backgroundColor: 'var(--gray-1)' }}>
          <Container size="4" p={{ initial: '4', md: '6' }}>
            <Outlet />
          </Container>
        </Box>

        {/* Footer */}
        <Box
          style={{
            borderTop: '1px solid var(--gray-6)',
            backgroundColor: 'var(--color-panel)',
          }}
          p="4"
        >
          <Container size="4">
            <Flex justify="between" align="center">
              <Text size="2" color="gray">
                © 2024 Admin Panel. All rights reserved.
              </Text>
              <Flex gap="4">
                <Button variant="ghost" size="1">
                  Privacy
                </Button>
                <Button variant="ghost" size="1">
                  Terms
                </Button>
                <Button variant="ghost" size="1">
                  Support
                </Button>
              </Flex>
            </Flex>
          </Container>
        </Box>
      </Box>
    </Flex>
  );
}