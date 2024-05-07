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
  Box
} from '@mantine/core';
import { ArrowLeft } from 'tabler-icons-react';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../react-query-hooks/useUser/useAuth';
import { useDidUpdate, useInterval } from '@mantine/hooks';

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

export default function ForgotMyPassword() {
  const { classes } = useStyles();
  const [value, setValue] = useState('');

  const [disable, setDisable] = useState(false);
  const { mutate, isLoading } = useForgotPassword();

  const [seconds, setSeconds] = useState(60);
  const interval = useInterval(() => setSeconds(s => s - 1), 1000);

  useDidUpdate(() => {
    if (isLoading) {
      // setValue("");
      interval.start();
      setDisable(true);
    }
  }, [isLoading]);

  useDidUpdate(() => {
    if (!disable) return;
    if (seconds === 0) {
      interval.stop();
      setDisable(false);
      setSeconds(60);
    }
  }, [seconds]);

  const handlePostEmail = () => {
    if (!disable) mutate({ email: value });
  };

  return (
    <Container size={460} my={30} sx={{ paddingTop: 100 }}>
      <Title className={classes.title} align="center">
        Forgot your password?
      </Title>
      <Text color="dimmed" size="sm" align="center">
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <TextInput
          label="Your email"
          placeholder="me@priders.net"
          required
          value={value}
          onChange={event => setValue(event.currentTarget.value)}
        />
        {seconds !== 60 && (
          <Text sx={{ fontSize: 14, paddingTop: 5 }}>
            A link will been sent to your email shortly, you can try again in{' '}
            {seconds} seconds
          </Text>
        )}

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
            disabled={disable || seconds !== 60}
          >
            Reset password
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
