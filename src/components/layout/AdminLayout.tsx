// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Flex,
  Card,
  Text,
  TextField,
  Button,
  Callout
} from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useAuthStore } from '../../stores/auth-store';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../services/auth-service';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem('admin_token', data.token);
      setUser(data.user);
      navigate('/');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Login failed');
    },
  });

  const onSubmit = (data: LoginForm) => {
    setError('');
    loginMutation.mutate(data);
  };

  return (
    <Flex
      height="100vh"
      align="center"
      justify="center"
      style={{ backgroundColor: 'var(--gray-1)' }}
      p="4"
    >
      <Card style={{ maxWidth: 400, width: '100%' }}>
        <Flex direction="column" gap="4">
          <Box>
            <Text as="div" size="6" weight="bold" align="center">
              Admin Panel
            </Text>
            <Text as="div" size="2" color="gray" align="center" mt="1">
              Sign in to access your dashboard
            </Text>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="3">
              {error && (
                <Callout.Root color="red">
                  <Callout.Icon>
                    <InfoCircledIcon />
                  </Callout.Icon>
                  <Callout.Text>
                    {error}
                  </Callout.Text>
                </Callout.Root>
              )}

              <Box>
                <Text as="label" size="2" weight="bold">
                  Email
                </Text>
                <TextField.Root
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  mt="1"
                />
                {errors.email && (
                  <Text as="p" size="1" color="red" mt="1">
                    {errors.email.message}
                  </Text>
                )}
              </Box>

              <Box>
                <Text as="label" size="2" weight="bold">
                  Password
                </Text>
                <TextField.Root
                  type="password"
                  placeholder="Enter your password"
                  {...register('password')}
                  mt="1"
                />
                {errors.password && (
                  <Text as="p" size="1" color="red" mt="1">
                    {errors.password.message}
                  </Text>
                )}
              </Box>

              <Button
                type="submit"
                size="3"
                disabled={loginMutation.isPending}
                style={{ width: '100%' }}
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
              </Button>
            </Flex>
          </form>
        </Flex>
      </Card>
    </Flex>
  );
}