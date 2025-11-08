// src/pages/UserFormPage.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Flex,
  Text,
  TextField,
  Button,
  Select,
  Card,
  Spinner,
  Heading,
  Container,
  Badge
} from '@radix-ui/themes';
import {
  Save,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  User as UserIcon
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/users-service';
import type { User } from '../types';

// Validation schema
const userSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  role: z.enum(['admin', 'user', 'moderator']),
  status: z.enum(['active', 'inactive', 'suspended']),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEditMode = !!id;

  // Fetch user data if in edit mode
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', id],
    queryFn: () => usersService.getUser(id!),
    enabled: isEditMode,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'user',
      status: 'active',
    },
  });

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: usersService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/users');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      navigate('/users');
    },
  });

  // Reset form when user data is loaded (edit mode) or when mode changes
  useEffect(() => {
    if (isEditMode && user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else if (!isEditMode) {
      reset({
        name: '',
        email: '',
        role: 'user',
        status: 'active',
        phone: '',
        address: '',
      });
    }
  }, [user, isEditMode, reset]);

  const handleFormSubmit = (data: UserFormData) => {
    if (isEditMode && id) {
      // Remove email from data in edit mode since it can't be changed
      const { email, ...updateData } = data;
      updateUserMutation.mutate({ id, data: updateData });
    } else {
      createUserMutation.mutate(data);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };

  const isLoading = isLoadingUser || createUserMutation.isPending || updateUserMutation.isPending;

  // Helper functions
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

  const currentRole = watch('role');
  const currentStatus = watch('status');

  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="6">
        {/* Header */}
        <Flex direction="column" gap="4">
          <Flex align="center" gap="4">
            <Button variant="ghost" asChild>
              <Link to="/users">
                <ArrowLeft size={16} />
                Back to Users
              </Link>
            </Button>
          </Flex>

          <Flex justify="between" align="start">
            <Box>
              <Heading size="7">
                {isEditMode ? 'Edit User' : 'Create New User'}
              </Heading>
              <Text color="gray" size="2">
                {isEditMode ? 'Update user information and permissions' : 'Add a new user to the system'}
              </Text>
            </Box>
            {isEditMode && user && (
              <Flex gap="2">
                <Badge color={getRoleColor(currentRole)}>
                  {currentRole}
                </Badge>
                <Badge color={getStatusColor(currentStatus)}>
                  {currentStatus}
                </Badge>
              </Flex>
            )}
          </Flex>
        </Flex>

        <Flex gap="6" direction={{ initial: 'column', lg: 'row' }}>
          {/* Form */}
          <Box flex="1">
            <Card>
              {isEditMode && isLoadingUser ? (
                <Flex justify="center" align="center" p="6">
                  <Spinner size="3" />
                  <Text ml="2">Loading user data...</Text>
                </Flex>
              ) : (
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                  <Flex direction="column" gap="5" p="4">
                    {/* Name Field */}
                    <Box>
                      <Text as="label" size="2" weight="bold" htmlFor="name">
                        Full Name *
                      </Text>
                      <TextField.Root
                        id="name"
                        placeholder="Enter full name"
                        {...register('name')}
                        disabled={isLoading}
                        mt="1"
                        size="3"
                      >
                        <TextField.Slot>
                          <UserIcon size={16} />
                        </TextField.Slot>
                      </TextField.Root>
                      {errors.name && (
                        <Text size="1" color="red" mt="1">
                          {errors.name.message}
                        </Text>
                      )}
                    </Box>

                    {/* Email Field */}
                    <Box>
                      <Text as="label" size="2" weight="bold" htmlFor="email">
                        Email Address {!isEditMode && '*'}
                      </Text>
                      <TextField.Root
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        {...register('email')}
                        disabled={isLoading || isEditMode} // Disable in edit mode
                        mt="1"
                        size="3"
                      >
                        <TextField.Slot>
                          <Mail size={16} />
                        </TextField.Slot>
                      </TextField.Root>
                      {errors.email && (
                        <Text size="1" color="red" mt="1">
                          {errors.email.message}
                        </Text>
                      )}
                      {isEditMode && (
                        <Text size="1" color="gray" mt="1">
                          Email address cannot be changed
                        </Text>
                      )}
                    </Box>

                    {/* Phone Field */}
                    <Box>
                      <Text as="label" size="2" weight="bold" htmlFor="phone">
                        Phone Number
                      </Text>
                      <TextField.Root
                        id="phone"
                        placeholder="Enter phone number"
                        {...register('phone')}
                        disabled={isLoading}
                        mt="1"
                        size="3"
                      >
                        <TextField.Slot>
                          <Phone size={16} />
                        </TextField.Slot>
                      </TextField.Root>
                      {errors.phone && (
                        <Text size="1" color="red" mt="1">
                          {errors.phone.message}
                        </Text>
                      )}
                    </Box>

                    {/* Address Field */}
                    <Box>
                      <Text as="label" size="2" weight="bold" htmlFor="address">
                        Address
                      </Text>
                      <TextField.Root
                        id="address"
                        placeholder="Enter address"
                        {...register('address')}
                        disabled={isLoading}
                        mt="1"
                        size="3"
                      >
                        <TextField.Slot>
                          <MapPin size={16} />
                        </TextField.Slot>
                      </TextField.Root>
                      {errors.address && (
                        <Text size="1" color="red" mt="1">
                          {errors.address.message}
                        </Text>
                      )}
                    </Box>

                    {/* Role and Status in a grid */}
                    <Flex gap="4" direction={{ initial: 'column', sm: 'row' }}>
                      {/* Role Field */}
                      <Box flex="1">
                        <Text as="label" size="2" weight="bold" htmlFor="role">
                          Role *
                        </Text>
                        <Select.Root
                          defaultValue={isEditMode ? user?.role : 'user'}
                          onValueChange={(value) => register('role').onChange({
                            target: { value, name: 'role' }
                          })}
                          disabled={isLoading}
                        >
                          <Select.Trigger id="role" mt="1" size="3" style={{ width: '100%' }} />
                          <Select.Content>
                            <Select.Item value="user">User</Select.Item>
                            <Select.Item value="moderator">Moderator</Select.Item>
                            <Select.Item value="admin">Admin</Select.Item>
                          </Select.Content>
                        </Select.Root>
                        {errors.role && (
                          <Text size="1" color="red" mt="1">
                            {errors.role.message}
                          </Text>
                        )}
                      </Box>

                      {/* Status Field */}
                      <Box flex="1">
                        <Text as="label" size="2" weight="bold" htmlFor="status">
                          Status *
                        </Text>
                        <Select.Root
                          defaultValue={isEditMode ? user?.status : 'active'}
                          onValueChange={(value) => register('status').onChange({
                            target: { value, name: 'status' }
                          })}
                          disabled={isLoading}
                        >
                          <Select.Trigger id="status" mt="1" size="3" style={{ width: '100%' }} />
                          <Select.Content>
                            <Select.Item value="active">Active</Select.Item>
                            <Select.Item value="inactive">Inactive</Select.Item>
                            <Select.Item value="suspended">Suspended</Select.Item>
                          </Select.Content>
                        </Select.Root>
                        {errors.status && (
                          <Text size="1" color="red" mt="1">
                            {errors.status.message}
                          </Text>
                        )}
                      </Box>
                    </Flex>

                    {/* Form Actions */}
                    <Flex gap="3" justify="end" mt="4" pt="4" style={{ borderTop: '1px solid var(--gray-6)' }}>
                      <Button
                        type="button"
                        variant="soft"
                        color="gray"
                        onClick={handleCancel}
                        disabled={isLoading}
                        size="3"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading || (isEditMode && !isDirty)}
                        size="3"
                      >
                        {isLoading ? (
                          <Spinner />
                        ) : (
                          <Save size={16} />
                        )}
                        {isEditMode ? 'Save Changes' : 'Create User'}
                      </Button>
                    </Flex>
                  </Flex>
                </form>
              )}
            </Card>
          </Box>

          {/* User Info Sidebar (only in edit mode) */}
          {isEditMode && user && (
            <Box style={{ width: '300px' }}>
              <Card>
                <Flex direction="column" gap="4" p="4">
                  <Text size="2" weight="bold" color="gray">
                    User Information
                  </Text>

                  <Flex direction="column" gap="3">
                    <Flex justify="between" align="center">
                      <Text size="1">Member since</Text>
                      <Flex align="center" gap="1">
                        <Calendar size={12} />
                        <Text size="1" weight="medium">
                          {new Date(user.created_at).toLocaleDateString()}
                        </Text>
                      </Flex>
                    </Flex>

                    {user.last_login && (
                      <Flex justify="between" align="center">
                        <Text size="1">Last login</Text>
                        <Text size="1" weight="medium">
                          {new Date(user.last_login).toLocaleDateString()}
                        </Text>
                      </Flex>
                    )}

                    {user.orders_count !== undefined && (
                      <Flex justify="between" align="center">
                        <Text size="1">Total orders</Text>
                        <Flex align="center" gap="1">
                          <ShoppingCart size={12} />
                          <Text size="1" weight="medium">
                            {user.orders_count}
                          </Text>
                        </Flex>
                      </Flex>
                    )}

                    {user.updated_at && (
                      <Flex justify="between" align="center">
                        <Text size="1">Last updated</Text>
                        <Text size="1" weight="medium">
                          {new Date(user.updated_at).toLocaleDateString()}
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </Card>
            </Box>
          )}
        </Flex>
      </Flex>
    </Container>
  );
}