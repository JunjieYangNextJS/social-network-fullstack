import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import backendApi from '../utility/backendApi';
import { useDidUpdate } from '@mantine/hooks';
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Tooltip,
  Group,
  NumberInput
} from '@mantine/core';
import ReCAPTCHA from 'react-google-recaptcha';

const useStyles = createStyles(theme => ({
  wrapper: {
    minHeight: 900,
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://s3.us-west-1.amazonaws.com/priders.net-images-bucket/bfc086cd-a2c4-41af-90b5-ec4b548af0c8.jpeg)'
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: 900,
    maxWidth: 450,
    padding: '100px 30px 0 30px',

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%'
    }
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  },

  logo: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    width: 120,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}));

const validationSchema = yup.object({
  username: yup.string().required('Name is required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(
      8,
      'Password should be of minimum 8 characters length and has an uppercase and an number'
    )
    .test('isValidPass', ' is not valid', (value, context) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);

      if (hasUpperCase && hasNumber) {
        return true;
      }
      return false;
    })
    .required('Password is required'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password is required')
});

const SignUpPage = () => {
  const [responseError, setResponseError] = useState('');
  const [checked, setChecked] = useState(true);
  const [tooltipOpened, setTooltipOpened] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);

  const reRef = useRef();

  const navigate = useNavigate();

  // useDidUpdate(() => {
  //   if (status === "error") setResponseError("Incorrect username or password");
  //   if (status === "success") navigate("/", { push: true });
  // }, [status]);
  const createNewUser = async values => {
    try {
      await axios.post(`${backendApi}users/signup`, values, {
        withCredentials: true,
        credentials: 'include'
      });
      navigate('/posts', { push: true });

      window.location.reload();
    } catch (err) {
      // Handle Error Here
      if (err.response.status === 400) {
        setResponseError('Your username or email is taken.');
      } else if (err.response.status === 401) {
        setResponseError('Human verify failed');
      } else if (err.response.status === 403) {
        setResponseError('This username is not allowed');
      } else {
        setResponseError("Registration wasn't successful");
      }

      // setResponseError(
      //   err.response.data.message[0].toUpperCase() +
      //     err.response.data.message.slice(1).toLowerCase()
      // );
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
      email: ''
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      const reCAPTCHAToken = await reRef.current.executeAsync();
      reRef.current.reset();

      if (reCAPTCHAToken) {
        createNewUser({
          username: values.username,
          profileName: values.username,
          password: values.password,
          passwordConfirm: values.passwordConfirm,
          email: values.email,
          reCAPTCHAToken,
          rememberMe: checked,
          birthMonth: month,
          birthDay: day,
          birthYear: year
        });
      }
    }
  });

  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0}>
        <Title
          order={2}
          className={classes.title}
          align="center"
          mt="md"
          mb={50}
        >
          Welcome to Priders!
        </Title>
        <form onSubmit={formik.handleSubmit}>
          <TextInput
            label="Username"
            id="username"
            name="username"
            placeholder="Your username"
            size="md"
            mt="md"
            required
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
          />
          <Tooltip
            label={
              'Password should be of minimum 8 characters length and has an uppercase and a number'
            }
            position="top"
            placement="start"
            withArrow
            opened={tooltipOpened}
            sx={{ display: 'block', width: '100%' }}
          >
            <PasswordInput
              label="Password"
              placeholder="Your password"
              mt="md"
              size="md"
              required
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onFocus={() => setTooltipOpened(true)}
              onBlur={() => setTooltipOpened(false)}
              error={formik.touched.password && Boolean(formik.errors.password)}
            />
          </Tooltip>

          <PasswordInput
            label="Confirm your password"
            placeholder="Confirm your password"
            mt="md"
            size="md"
            required
            id="passwordConfirm"
            name="passwordConfirm"
            value={formik.values.passwordConfirm}
            onChange={formik.handleChange}
            error={
              formik.touched.passwordConfirm &&
              Boolean(formik.errors.passwordConfirm)
            }
          />
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            mt="md"
            id="email"
            name="email"
            required
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
          />
          <Group align="flex-end" mt="md">
            <NumberInput
              hideControls
              label="Birthday"
              placeholder="Month"
              styles={{
                input: {
                  width: 70,
                  textAlign: 'center',
                  color: (month > 12 || month < 1) && 'red'
                },
                label: { fontSize: 16 }
              }}
              max={12}
              min={1}
              value={month}
              onChange={val => setMonth(val)}
            />
            <NumberInput
              hideControls
              placeholder="Day"
              styles={{
                input: {
                  width: 70,
                  textAlign: 'center',
                  color: (day > 31 || day < 1) && 'red'
                }
              }}
              max={31}
              min={1}
              value={day}
              onChange={val => setDay(val)}
            />
            <NumberInput
              hideControls
              placeholder="Year"
              max={new Date().getFullYear()}
              min={1920}
              styles={{
                input: {
                  width: 70,
                  textAlign: 'center',
                  color:
                    (year > new Date().getFullYear() || year < 1920) && 'red'
                }
                // root: { borderColor: "red" },
              }}
              value={year}
              onChange={val => setYear(val)}
            />
          </Group>
          <Checkbox
            type="checkbox"
            // size="md"
            mt="md"
            // value={formik.values.rememberMe}
            label="Remember me"
            id="checked"
            name="rememberMe"
            checked={checked}
            onChange={event => setChecked(event.currentTarget.checked)}
          />
          <Checkbox
            // size="md"
            checked={agreed}
            onChange={event => setAgreed(event.currentTarget.checked)}
            mt="xs"
            label={
              <>
                I agree to Priders'{' '}
                <Anchor size="sm" href="/terms-of-service" target="_blank">
                  terms of service
                </Anchor>{' '}
                and{' '}
                <Anchor size="sm" href="/privacy" target="_blank">
                  privacy policy
                </Anchor>
              </>
            }
          />

          {responseError && (
            <div
              style={{
                color: 'red',
                marginTop: 10,
                marginBottom: -10
              }}
            >
              {responseError}
            </div>
          )}

          <ReCAPTCHA
            sitekey={'6LeqC3wgAAAAAPZWR3bBBXFADr-qXPBRhC9J_Z4Y'}
            size="invisible"
            ref={reRef}
          />

          <Button
            fullWidth
            mt="xl"
            size="md"
            type="submit"
            disabled={
              !agreed ||
              !formik.values.username ||
              !formik.values.password ||
              !formik.values.passwordConfirm ||
              !formik.values.email
            }
          >
            Register
          </Button>

          <Text align="center" mt="md">
            Registered already?{' '}
            <Anchor
              href="#"
              weight={700}
              component={Link}
              to="/login"
              // onClick={(event) => event.preventDefault()}
            >
              Login
            </Anchor>
          </Text>
        </form>
      </Paper>
    </div>
    // <Container>
    //   <SignUpForm />
    // </Container>
  );
};

export default SignUpPage;
