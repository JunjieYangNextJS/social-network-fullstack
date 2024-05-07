import React, { useState } from 'react';
import { BrandGoogle } from 'tabler-icons-react';
import { GoogleLogin, googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useFormik } from 'formik';
import * as yup from 'yup';

import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import backendApi from '../utility/backendApi';
import { useDidUpdate } from '@mantine/hooks';
import { useLogin } from '../react-query-hooks/useUser/useAuth';
import { useMutation, useQueryClient } from 'react-query';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Tooltip,
  LoadingOverlay
} from '@mantine/core';

const validationSchema = yup.object({
  username: yup.string().required('Name is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required')
});

const LoginPage = () => {
  const [responseError, setResponseError] = useState('');
  const [checked, setChecked] = useState(true);
  const [tooltipOpened, setTooltipOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { mutate: loginUser, status } = useLogin();
  const queryClient = useQueryClient();

  useDidUpdate(() => {
    if (status === 'loading') setLoading(true);
    if (status === 'error') {
      setResponseError('Incorrect username or password');
      setLoading(false);
    }
    if (status === 'success') navigate('/', { push: true });
  }, [status]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      rememberMe: checked
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      values.rememberMe = checked;
      loginUser(values);
    }
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      setLoading(true);

      await axios
        .post(
          `${backendApi}users/googleLogin`,
          {
            // http://localhost:3001/auth/google backend that will exchange the code
            code
          },
          {
            withCredentials: true,
            credentials: 'include'
          }
        )
        .then(res => queryClient.setQueryData(['user'], res.data.data.user));

      navigate('/', { push: true });
    },
    flow: 'auth-code'
  });

  return (
    <Container size={420} my={40} sx={{ paddingTop: 100 }}>
      <Title
        align="center"
        sx={theme => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900
        })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor href="#" size="sm" component={Link} to="/signup">
          Create account
        </Anchor>
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <LoadingOverlay visible={loading} />
          <>
            <TextInput
              label="Username"
              id="username"
              name="username"
              placeholder="Your username"
              required
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
            />
            <Tooltip
              label={
                'Password must include at least 8 characters with at least 1 uppercase'
              }
              position="bottom"
              placement="start"
              withArrow
              opened={tooltipOpened}
              sx={{ display: 'block', width: '100%' }}
            >
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                mt="md"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                onFocus={() => setTooltipOpened(true)}
                onBlur={() => setTooltipOpened(false)}
              />
            </Tooltip>
            <Group position="apart" mt="md">
              {responseError && (
                <div
                  style={{
                    color: 'red'
                  }}
                >
                  {responseError}
                </div>
              )}
              <Checkbox
                type="checkbox"
                // value={formik.values.rememberMe}
                label="Remember me"
                id="checked"
                name="rememberMe"
                checked={checked}
                onChange={event => setChecked(event.currentTarget.checked)}
              />
              <Anchor
                href="#"
                size="sm"
                component={Link}
                to="/forgot-my-password"
              >
                Forgot password?
              </Anchor>
            </Group>
            <Button fullWidth mt="xl" type="submit">
              Sign in
            </Button>
            {/* <GoogleLogin
              onSuccess={credentialResponse => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              auto_select={false}
              // useOneTap
            /> */}
            <Button
              variant="outline"
              // color="#000000"
              sx={{ border: '1px solid #dadce0', color: '#212529' }}
              fullWidth
              mt="xs"
              onClick={() => googleLogin()}
              leftIcon={
                <BrandGoogle size={18} strokeWidth={3} color={'#228BE6'} />
                // <svg
                //   version="1.1"
                //   xmlns="http://www.w3.org/2000/svg"
                //   viewBox="0 0 48 48"
                //   class="LgbsSe-Bz112c"
                // >
                //   <g>
                //     <path
                //       fill="#EA4335"
                //       d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                //     />
                //     <path
                //       fill="#4285F4"
                //       d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                //     />
                //     <path
                //       fill="#FBBC05"
                //       d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                //     />
                //     <path
                //       fill="#34A853"
                //       d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                //     />
                //     <path fill="none" d="M0 0h48v48H0z" />
                //   </g>
                // </svg>
              }
            >
              Sign in with Google
            </Button>
          </>
        </Paper>
      </form>
    </Container>
  );
};

export default LoginPage;
