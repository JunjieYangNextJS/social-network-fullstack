import React, { useState } from 'react';
import axios from 'axios';
import backendApi from '../utility/backendApi';
import {
  createStyles,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
  PasswordInput
} from '@mantine/core';
import { ArrowLeft } from 'tabler-icons-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDidUpdate, useInterval } from '@mantine/hooks';
import { useResetPassword } from './../react-query-hooks/useUser/useAuth';
import { showSuccess } from './../utility/showNotifications';
import PasswordInputWithStrength from '../components/PasswordInputWithStrength';

const useStyles = createStyles(theme => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  },

  controls: {
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column-reverse'
    }
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      width: '100%',
      textAlign: 'center'
    }
  }
}));

export default function ResetMyPasswordPage() {
  const params = useParams();

  const { classes } = useStyles();
  const [value, setValue] = useState('');
  const [confirmValue, setConfirmValue] = useState('');

  const [disable, setDisable] = useState(false);
  const { mutate, isLoading, isSuccess } = useResetPassword(params.token);
  const navigate = useNavigate();

  useDidUpdate(() => {
    if (isLoading) {
      setDisable(true);
    }
    if (isSuccess) {
      showSuccess('Your password has been changed');
      navigate('/login');
    }
  }, [isLoading, isSuccess]);

  const handlePostEmail = () => {
    if (!disable) mutate({ password: value, passwordConfirm: confirmValue });
  };

  return (
    <Container size={460} my={30} sx={{ paddingTop: 100 }}>
      <Title className={classes.title} align="center">
        Reset password
      </Title>
      <Text color="dimmed" size="sm" align="center">
        Enter your new password
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <PasswordInput
          label="New password"
          required
          value={value}
          onChange={event => setValue(event.currentTarget.value)}
          error={
            value &&
            !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value) &&
            'Your password must be at least eight characters including one uppercase letter and one number'
          }
        />
        {/* <PasswordInputWithStrength
          value={value}
          setValue={setValue}
          label="New Password"
        /> */}
        <PasswordInput
          label="Confirm new password"
          required
          value={confirmValue}
          onChange={event => setConfirmValue(event.currentTarget.value)}
          error={
            confirmValue &&
            value !== confirmValue &&
            "You new passwords don't match"
          }
        />

        <Group position="apart" mt="lg" className={classes.controls}>
          <Anchor
            color="dimmed"
            size="sm"
            className={classes.control}
            component={Link}
            to="/login"
          >
            <Center inline>
              <ArrowLeft size={12} />
              <Box ml={5}>Back to login page</Box>
            </Center>
          </Anchor>
          <Button
            className={classes.control}
            onClick={() => handlePostEmail()}
            disabled={disable}
          >
            Reset password
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
