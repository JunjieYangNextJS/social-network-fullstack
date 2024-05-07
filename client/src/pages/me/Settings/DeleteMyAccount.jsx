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
import {
  useChangePassword,
  useDeleteMyAccount
} from '../../../react-query-hooks/useUser/useAuth';
import { useChangeEmailOrUsername } from './../../../react-query-hooks/useUser/useAuth';
import DeleteMyAccountModal from '../../../components/Modals/UserRelated/DeleteMyAccountModal';

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

export default function DeleteMyAccount() {
  const { data: user } = useUser();

  const { classes } = useStyles();
  const [password, setPassword] = useState('');

  const [opened, setOpened] = useState(false);

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
              Delete My Account
            </Title>
            <Text color="dimmed" size="sm" align="center">
              Please enter your password to proceed
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
              <PasswordInput
                label="Password"
                required
                value={password}
                onChange={event => setPassword(event.currentTarget.value)}
              />

              <Group position="right" mt="lg" className={classes.controls}>
                <Button
                  className={classes.control}
                  onClick={() => setOpened(true)}
                  disabled={!password}
                >
                  Delete my account
                </Button>
              </Group>
            </Paper>
            <DeleteMyAccountModal
              setOpened={setOpened}
              opened={opened}
              password={password}
            />
          </Container>
        </Container>
      )}
    </Box>
  );
}
