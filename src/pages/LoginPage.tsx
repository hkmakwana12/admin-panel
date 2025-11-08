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
  EyeOpenIcon,
  EyeClosedIcon,
  LockClosedIcon,
  EnvelopeClosedIcon,
  ExclamationTriangleIcon,
  RocketIcon
} from '@radix-ui/react-icons';
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
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Login failed. Please try again.';
      setError(errorMessage);
    },
  });

  const onSubmit = (data: LoginForm) => {
    setError('');
    loginMutation.mutate(data);
  };

  // Demo credentials for testing
  const fillDemoCredentials = () => {
    const demoEmail = 'admin@example.com';
    const demoPassword = 'password';

    // This would typically set form values, but for simplicity we'll log them
    console.log('Demo credentials:', { email: demoEmail, password: demoPassword });
    setError('Use the demo credentials in your form inputs');
  };

  return (
    <Flex
      height="100vh"
      align="center"
      justify="center"
      style={{
        backgroundColor: 'var(--gray-1)',
        backgroundImage: 'radial-gradient(var(--gray-5) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
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
                <RocketIcon width="24" height="24" />
              </Box>
              <Heading size="7" weight="bold">
                Admin Panel
              </Heading>
            </Flex>
            <Text size="3" color="gray" align="center">
              Sign in to access your dashboard and manage your platform
            </Text>
          </Flex>

          {/* Login Card */}
          <Card style={{ maxWidth: 400, width: '100%' }} size="3">
            <Flex direction="column" gap="4">
              {/* Demo Credentials Callout */}
              <Callout.Root color="blue">
                <Callout.Icon>
                  <RocketIcon />
                </Callout.Icon>
                <Callout.Text>
                  <Flex direction="column" gap="1">
                    <Text weight="bold">Demo Access</Text>
                    <Text size="1">
                      Use admin@example.com / password to test the login
                    </Text>
                    <Button
                      size="1"
                      variant="ghost"
                      onClick={fillDemoCredentials}
                      style={{ marginTop: '4px' }}
                    >
                      Auto-fill demo credentials
                    </Button>
                  </Flex>
                </Callout.Text>
              </Callout.Root>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column" gap="4">
                  {error && (
                    <Callout.Root color="red" size="1">
                      <Callout.Icon>
                        <ExclamationTriangleIcon />
                      </Callout.Icon>
                      <Callout.Text>
                        {error}
                      </Callout.Text>
                    </Callout.Root>
                  )}

                  {/* Email Field */}
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="bold" htmlFor="email">
                      Email Address
                    </Text>
                    <TextField.Root
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      size="3"
                      {...register('email')}
                      disabled={loginMutation.isPending}
                    >
                      <TextField.Slot>
                        <EnvelopeClosedIcon />
                      </TextField.Slot>
                    </TextField.Root>
                    {errors.email && (
                      <Text size="1" color="red" style={{ marginTop: '4px' }}>
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
                      placeholder="Enter your password"
                      size="3"
                      {...register('password')}
                      disabled={loginMutation.isPending}
                    >
                      <TextField.Slot>
                        <LockClosedIcon />
                      </TextField.Slot>
                      <TextField.Slot>
                        <Button
                          type="button"
                          variant="ghost"
                          size="1"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: 'pointer' }}
                        >
                          {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                        </Button>
                      </TextField.Slot>
                    </TextField.Root>
                    {errors.password && (
                      <Text size="1" color="red" style={{ marginTop: '4px' }}>
                        {errors.password.message}
                      </Text>
                    )}
                  </Flex>

                  {/* Remember Me & Forgot Password */}
                  <Flex justify="between" align="center">
                    <Flex align="center" gap="2">
                      {/* You can add a checkbox here for "Remember me" if needed */}
                    </Flex>
                    <Button type="button" variant="ghost" size="1">
                      Forgot password?
                    </Button>
                  </Flex>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="3"
                    disabled={loginMutation.isPending}
                    style={{ width: '100%' }}
                  >
                    {loginMutation.isPending ? (
                      <Flex align="center" gap="2">
                        <Spinner />
                        Signing in...
                      </Flex>
                    ) : (
                      'Sign in to your account'
                    )}
                  </Button>
                </Flex>
              </form>

              {/* Additional Help Text */}
              <Box>
                <Text size="1" color="gray" align="center">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </Text>
              </Box>
            </Flex>
          </Card>

          {/* Footer */}
          <Flex direction="column" gap="2" align="center">
            <Text size="1" color="gray">
              Need help? Contact support@yourapp.com
            </Text>
            <Text size="1" color="gray">
              © {new Date().getFullYear()} Your Company Name. All rights reserved.
            </Text>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
}