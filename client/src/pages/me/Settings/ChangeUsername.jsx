import React, { useState } from 'react';

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
import { showError, showSuccess } from '../../../utility/showNotifications';
import useUser from './../../../react-query-hooks/useUser/useUser';
import SideNavbarNested from './../components/SideNavbarNested';
import { useChangePassword } from '../../../react-query-hooks/useUser/useAuth';
import { useChangeEmailOrUsername } from './../../../react-query-hooks/useUser/useAuth';

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

export default function ChangeUsername() {
  const params = useParams();
  const { data: user } = useUser();

  const { classes } = useStyles();
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');

  const [disable, setDisable] = useState(false);
  const { mutate, isLoading, isSuccess, isError } = useChangeEmailOrUsername(
    'username'
  );

  useDidUpdate(() => {
    if (isLoading) {
      setDisable(true);
    }
    if (isSuccess) {
      showSuccess('Your username has been changed');
      setPassword('');
      setNewUsername('');

      setDisable(false);
    }
    if (isError) {
      setDisable(false);
    }
  }, [isLoading, isSuccess, isError]);

  const handleChangePassword = () => {
    if (!disable)
      mutate({
        passwordCurrent: password,
        username: newUsername
      });
  };

  return (
    <Box
      sx={{
        // backgroundColor: "#F1F3F5",
        paddingTop: 115,
        minHeight: `calc(100vh - 115px)`
      }}
    >
      {user && (
        <Container>
          <SideNavbarNested />
          <Container size={460} my={30}>
            <Title className={classes.title} align="center">
              Change my username
            </Title>
            <Text color="dimmed" size="sm" align="center">
              Enter your new username
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
              <PasswordInput
                label="Current password"
                required
                value={password}
                onChange={event => setPassword(event.currentTarget.value)}
              />
              <TextInput
                label="New username"
                required
                value={newUsername}
                onChange={event => setNewUsername(event.currentTarget.value)}
              />
              <Group position="right" mt="lg" className={classes.controls}>
                <Button
                  className={classes.control}
                  onClick={() => handleChangePassword()}
                  disabled={disable || !password || !newUsername}
                >
                  Change my username
                </Button>
              </Group>
            </Paper>
          </Container>
        </Container>
      )}
    </Box>
  );
}
