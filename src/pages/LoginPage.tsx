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
  Callout,
  Container,
  Heading,
  Spinner
} from '@radix-ui/themes';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertTriangle,
  Rocket,
} from 'lucide-react';
import { useAuthStore } from '../stores/auth-store';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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
      setError(error.message || 'Login failed. Please try again.');
    },
  });

  const onSubmit = (data: LoginForm) => {
    setError('');
    loginMutation.mutate(data);
  };

  // Demo credentials for testing
  const fillDemoCredentials = () => {
    setValue('email', 'admin@example.com');
    setValue('password', 'password');
    setError('');
  };

  return (
    <Flex
      height="100vh"
      align="center"
      justify="center"
      style={{
        backgroundColor: 'var(--gray-1)',
      }}
      p="4"
    >
      <Container size="1">
        <Flex direction="column" gap="6" align="center">
          {/* Header */}
          <Flex direction="column" gap="2" align="center">
            <Flex align="center" gap="3">
              <Box
                style={{
                  backgroundColor: 'var(--accent-9)',
                  color: 'white',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Rocket size={24} />
              </Box>
              <Heading size="7" weight="bold">
                Admin Panel
              </Heading>
            </Flex>
            <Text as="div" size="3" color="gray" align="center">
              Sign in to access your dashboard
            </Text>
          </Flex>

          {/* Login Card */}
          <Card style={{ maxWidth: 400, width: '100%' }} size="3">
            <Flex direction="column" gap="4">
              {/* Demo Credentials Callout */}
              <Callout.Root color="blue">
                <Callout.Icon>
                  <Rocket size={16} />
                </Callout.Icon>
                <Callout.Text>
                  <Text weight="bold">Demo Access</Text>
                  <Text size="1">
                    Use admin@example.com / password to test
                  </Text>
                  <Button
                    size="1"
                    variant="ghost"
                    onClick={fillDemoCredentials}
                    style={{
                      marginTop: '4px',
                      display: 'block'
                    }}
                  >
                    Auto-fill demo credentials
                  </Button>
                </Callout.Text>
              </Callout.Root>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap="4">
                  {error && (
                    <Callout.Root color="red" size="1">
                      <Callout.Icon>
                        <AlertTriangle size={16} />
                      </Callout.Icon>
                      <Callout.Text>
                        {error}
                      </Callout.Text>
                    </Callout.Root>
                  )}

                  {/* Email Field */}
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="bold" htmlFor="email">
                      Email
                    </Text>
                    <TextField.Root
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      size="3"
                      {...register('email')}
                      disabled={loginMutation.isPending}
                    >
                      <TextField.Slot>
                        <Mail size={16} />
                      </TextField.Slot>
                    </TextField.Root>
                    {errors.email && (
                      <Text as="p" size="1" color="red" style={{ marginTop: '4px' }}>
                        {errors.email.message}
                      </Text>
                    )}
                  </Flex>

                  {/* Password Field */}
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="bold" htmlFor="password">
                      Password
                    </Text>
                    <TextField.Root
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="password"
                      size="3"
                      {...register('password')}
                      disabled={loginMutation.isPending}
                    >
                      <TextField.Slot>
                        <Lock size={16} />
                      </TextField.Slot>
                      <TextField.Slot>
                        <Button
                          type="button"
                          variant="ghost"
                          size="1"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: 'pointer' }}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </TextField.Slot>
                    </TextField.Root>
                    {errors.password && (
                      <Text as="p" size="1" color="red" style={{ marginTop: '4px' }}>
                        {errors.password.message}
                      </Text>
                    )}
                  </Flex>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="3"
                    disabled={loginMutation.isPending}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    {loginMutation.isPending ? (
                      <Flex align="center" gap="2">
                        <Spinner />
                        Signing in...
                      </Flex>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Flex>
              </form>
            </Flex>
          </Card>

          {/* Footer */}
          <Flex direction="column" gap="2" align="center">
            <Text as="div" size="1" color="gray">
              Need help? Contact support@yourapp.com
            </Text>
            <Text as="div" size="1" color="gray">
              © {new Date().getFullYear()} Your Company Name. All rights reserved.
            </Text>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
}