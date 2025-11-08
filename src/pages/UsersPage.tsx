// src/pages/UsersPage.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Badge,
  Avatar,
  Table,
  TextField,
  Select,
  Card,
  AlertDialog,
  DropdownMenu,
  Checkbox,
  Spinner
} from '@radix-ui/themes';
import {
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
  Download,
  RefreshCw,
  UserPlus,
  Shield,
  ShieldOff,
  Ban
} from 'lucide-react';
import { usersService } from '../services/users-service';
import type { User } from '../types';
import { Link } from 'react-router-dom';

export function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Fetch users with filters
  const {
    data: users,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users', { search, role: roleFilter, status: statusFilter }],
    queryFn: () => usersService.getUsers({
      search: search || undefined,
      role: roleFilter !== 'all' ? roleFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
    }),
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    },
  });

  // Bulk actions mutation
  const bulkActionsMutation = useMutation({
    mutationFn: usersService.bulkActions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSelectedUsers([]);
    },
  });

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && users?.data) {
      setSelectedUsers(users.data.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) return;
    bulkActionsMutation.mutate({ ids: selectedUsers, action });
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'moderator': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'yellow';
      case 'suspended': return 'red';
      default: return 'gray';
    }
  };

  if (error) {
    return (
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Box>
            <Heading size="7">Users</Heading>
            <Text color="gray" size="2">
              Manage your users and permissions
            </Text>
          </Box>
        </Flex>
        <Card>
          <Flex direction="column" gap="3" align="center" p="6">
            <Text color="red" size="2">
              Failed to load users. Please try again.
            </Text>
            <Button onClick={() => refetch()} variant="soft">
              <RefreshCw size={16} />
              Retry
            </Button>
          </Flex>
        </Card>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="4">
      {/* Header */}
      <Flex justify="between" align="center">
        <Box>
          <Heading size="7">Users</Heading>
          <Text color="gray" size="2">
            Manage your users and permissions
          </Text>
        </Box>
        <Flex gap="3">
          <Button variant="soft" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/users/create">
              <UserPlus size={16} />
              Add User
            </Link>
          </Button>
        </Flex>
      </Flex>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <Card>
          <Flex align="center" justify="between" p="3">
            <Flex align="center" gap="3">
              <Text size="2">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </Text>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="soft" size="2">
                    <Filter size={16} />
                    Actions
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item
                    onClick={() => handleBulkAction('activate')}
                    disabled={bulkActionsMutation.isPending}
                  >
                    <Shield size={16} />
                    Activate
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={() => handleBulkAction('deactivate')}
                    disabled={bulkActionsMutation.isPending}
                  >
                    <ShieldOff size={16} />
                    Deactivate
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    color="red"
                    onClick={() => handleBulkAction('delete')}
                    disabled={bulkActionsMutation.isPending}
                  >
                    <Trash2 size={16} />
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Flex>
            <Button
              variant="ghost"
              size="1"
              onClick={() => setSelectedUsers([])}
            >
              Clear
            </Button>
          </Flex>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <Flex gap="3" align="center" p="4">
          <TextField.Root
            placeholder="Search by name or email..."
            style={{ flex: 1 }}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          >
            <TextField.Slot>
              <Search size={16} />
            </TextField.Slot>
          </TextField.Root>
          <Select.Root value={roleFilter} onValueChange={handleRoleFilter}>
            <Select.Trigger placeholder="Role" />
            <Select.Content>
              <Select.Item value="all">All Roles</Select.Item>
              <Select.Item value="admin">Admin</Select.Item>
              <Select.Item value="user">User</Select.Item>
              <Select.Item value="moderator">Moderator</Select.Item>
            </Select.Content>
          </Select.Root>
          <Select.Root value={statusFilter} onValueChange={handleStatusFilter}>
            <Select.Trigger placeholder="Status" />
            <Select.Content>
              <Select.Item value="all">All Status</Select.Item>
              <Select.Item value="active">Active</Select.Item>
              <Select.Item value="inactive">Inactive</Select.Item>
              <Select.Item value="suspended">Suspended</Select.Item>
            </Select.Content>
          </Select.Root>
          <Button variant="soft">
            <Download size={16} />
            Export
          </Button>
        </Flex>
      </Card>

      {/* Users Table */}
      <Card>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell style={{ width: '40px' }}>
                <Checkbox
                  checked={selectedUsers.length > 0 && selectedUsers.length === users?.data.length}
                  onCheckedChange={handleSelectAll}
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Last Login</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell style={{ width: '80px' }}>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={7}>
                  <Flex justify="center" align="center" p="6">
                    <Spinner size="3" />
                    <Text ml="2">Loading users...</Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : users?.data.map((user) => (
              <Table.Row key={user.id} style={{
                backgroundColor: selectedUsers.includes(user.id) ? 'var(--accent-3)' : 'transparent'
              }}>
                <Table.Cell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="3">
                    <Avatar
                      size="2"
                      radius="full"
                      fallback={user.name.charAt(0)}
                      color={getRoleColor(user.role)}
                    />
                    <Box>
                      <Text weight="bold">{user.name}</Text>
                      <Text size="1" color="gray">{user.email}</Text>
                    </Box>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2">
                    {new Date(user.created_at).toLocaleDateString()}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button variant="ghost" size="1">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item asChild>
                        <Link to={`/users/edit/${user.id}`}>
                          <Flex align="center" gap="2">
                            <Edit size={14} />
                            <Text size="1">Edit</Text>
                          </Flex>
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item>
                        <Flex align="center" gap="2">
                          <Shield size={14} />
                          <Text size="1">Activate</Text>
                        </Flex>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item>
                        <Flex align="center" gap="2">
                          <Ban size={14} />
                          <Text size="1">Suspend</Text>
                        </Flex>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item
                        color="red"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Flex align="center" gap="2">
                          <Trash2 size={14} />
                          <Text size="1">Delete</Text>
                        </Flex>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {/* Empty State */}
        {!isLoading && users?.data.length === 0 && (
          <Flex direction="column" justify="center" align="center" p="8" gap="3">
            <Box style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'var(--gray-3)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserPlus size={24} color="var(--gray-9)" />
            </Box>
            <Text weight="bold" size="3">No users found</Text>
            <Text color="gray" size="2" align="center">
              {search || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first user'
              }
            </Text>
            {!search && roleFilter === 'all' && statusFilter === 'all' && (
              <Button mt="2">
                <UserPlus size={16} />
                Add User
              </Button>
            )}
          </Flex>
        )}

        {/* Pagination Info */}
        {users && users.data.length > 0 && (
          <Flex justify="between" align="center" p="4" style={{ borderTop: '1px solid var(--gray-6)' }}>
            <Text size="2" color="gray">
              Showing {users.from} to {users.to} of {users.total} users
            </Text>
            <Flex gap="2">
              <Button variant="soft" size="1" disabled={users.current_page === 1}>
                Previous
              </Button>
              <Button variant="soft" size="1" disabled={users.current_page === users.last_page}>
                Next
              </Button>
            </Flex>
          </Flex>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Delete User</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure you want to delete <Text weight="bold">{userToDelete?.name}</Text>?
            This action cannot be undone.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                variant="solid"
                color="red"
                onClick={confirmDelete}
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? <Spinner /> : <Trash2 size={16} />}
                Delete User
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Flex>
  );
}