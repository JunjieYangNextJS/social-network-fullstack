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

export default function ChangePassword() {
  const params = useParams();
  const { data: user } = useUser();

  const { classes } = useStyles();
  const [oldValue, setOldValue] = useState('');
  const [value, setValue] = useState('');
  const [confirmValue, setConfirmValue] = useState('');

  const [disable, setDisable] = useState(false);
  const { mutate, isLoading, isSuccess, isError } = useChangePassword();

  useDidUpdate(() => {
    if (isLoading) {
      setDisable(true);
    }
    if (isSuccess) {
      showSuccess('Your password has been changed');
      setOldValue('');
      setValue('');
      setConfirmValue('');
      setDisable(false);
    }
    if (isError) {
      setDisable(false);
    }
  }, [isLoading, isSuccess, isError]);

  const handleChangePassword = () => {
    if (!disable)
      mutate({
        passwordCurrent: oldValue,
        password: value,
        passwordConfirm: confirmValue
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
              Change my password
            </Title>
            <Text color="dimmed" size="sm" align="center">
              Enter your new password
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
              <PasswordInput
                label="Current password"
                required
                value={oldValue}
                onChange={event => setOldValue(event.currentTarget.value)}
              />
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
                // styles={{
                //   innerInput: {
                //     color: value !== confirmValue && "red",
                //   },
                //   // root: { borderColor: "red" },
                // }}

                error={
                  confirmValue &&
                  value !== confirmValue &&
                  "You new passwords don't match"
                }
              />

              <Group position="right" mt="lg" className={classes.controls}>
                <Button
                  className={classes.control}
                  onClick={() => handleChangePassword()}
                  disabled={
                    disable ||
                    !oldValue ||
                    !value ||
                    !confirmValue ||
                    !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value) ||
                    value !== confirmValue
                  }
                >
                  Change my password
                </Button>
              </Group>
            </Paper>
          </Container>
        </Container>
      )}
    </Box>
  );
}
