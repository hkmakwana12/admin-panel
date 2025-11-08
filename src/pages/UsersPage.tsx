// src/pages/UsersPage.tsx
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Flex,
  Card,
  Text,
  Heading,
  Button,
  Badge,
  Avatar,
  Table,
  TextField,
  Select
} from '@radix-ui/themes';
import { PlusIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { usersService } from '../services/users-service';
import { User } from '../types';

export function UsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getUsers(),
  });

  return (
    <Flex direction="column" gap="4">
      <Flex justify="between" align="center">
        <Box>
          <Heading size="7">Users</Heading>
          <Text color="gray" size="2">
            Manage your users and permissions
          </Text>
        </Box>
        <Button>
          <PlusIcon />
          Add User
        </Button>
      </Flex>

      {/* Filters */}
      <Card>
        <Flex gap="3" align="center">
          <TextField.Root
            placeholder="Search users..."
            style={{ flex: 1 }}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon />
            </TextField.Slot>
          </TextField.Root>
          <Select.Root defaultValue="all">
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="all">All Roles</Select.Item>
              <Select.Item value="admin">Admin</Select.Item>
              <Select.Item value="user">User</Select.Item>
              <Select.Item value="moderator">Moderator</Select.Item>
            </Select.Content>
          </Select.Root>
          <Select.Root defaultValue="all">
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="all">All Status</Select.Item>
              <Select.Item value="active">Active</Select.Item>
              <Select.Item value="inactive">Inactive</Select.Item>
              <Select.Item value="suspended">Suspended</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Card>

      {/* Users Table */}
      <Card>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Last Login</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {isLoading ? (
              // Loading state
              Array.from({ length: 5 }).map((_, i) => (
                <Table.Row key={i}>
                  <Table.Cell>
                    <Flex gap="3" align="center">
                      <Box width="8" height="8" style={{ backgroundColor: 'var(--gray-5)', borderRadius: '50%' }} />
                      <Box>
                        <Box width="20" height="4" style={{ backgroundColor: 'var(--gray-5)', borderRadius: 'var(--radius-1)' }} mb="1" />
                        <Box width="16" height="3" style={{ backgroundColor: 'var(--gray-4)', borderRadius: 'var(--radius-1)' }} />
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Box width="12" height="4" style={{ backgroundColor: 'var(--gray-5)', borderRadius: 'var(--radius-1)' }} />
                  </Table.Cell>
                  <Table.Cell>
                    <Box width="10" height="4" style={{ backgroundColor: 'var(--gray-5)', borderRadius: 'var(--radius-1)' }} />
                  </Table.Cell>
                  <Table.Cell>
                    <Box width="16" height="4" style={{ backgroundColor: 'var(--gray-5)', borderRadius: 'var(--radius-1)' }} />
                  </Table.Cell>
                  <Table.Cell>
                    <Box width="20" height="6" style={{ backgroundColor: 'var(--gray-5)', borderRadius: 'var(--radius-1)' }} />
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              users?.data.map((user: User) => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    <Flex gap="3" align="center">
                      <Avatar
                        size="2"
                        radius="full"
                        src={user.avatar}
                        fallback={user.name.split(' ').map(n => n[0]).join('')}
                      />
                      <Box>
                        <Text weight="bold">{user.name}</Text>
                        <Text color="gray" size="1">{user.email}</Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={
                        user.role === 'admin' ? 'red' :
                          user.role === 'moderator' ? 'blue' : 'gray'
                      }
                    >
                      {user.role}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={
                        user.status === 'active' ? 'green' :
                          user.status === 'inactive' ? 'yellow' : 'red'
                      }
                    >
                      {user.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2">
                      <Button size="1" variant="soft">Edit</Button>
                      <Button size="1" variant="soft" color="red">Delete</Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Card>
    </Flex>
  );
}