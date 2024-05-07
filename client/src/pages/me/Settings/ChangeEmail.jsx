import React, { useState } from "react";

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
  PasswordInput,
} from "@mantine/core";
import { ArrowLeft } from "tabler-icons-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDidUpdate, useInterval } from "@mantine/hooks";
import { showError, showSuccess } from "../../../utility/showNotifications";
import useUser from "./../../../react-query-hooks/useUser/useUser";
import SideNavbarNested from "./../components/SideNavbarNested";
import { useChangePassword } from "../../../react-query-hooks/useUser/useAuth";
import { useChangeEmailOrUsername } from "./../../../react-query-hooks/useUser/useAuth";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column-reverse",
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      width: "100%",
      textAlign: "center",
    },
  },
}));

export default function ChangeEmail() {
  const params = useParams();
  const { data: user } = useUser();

  const { classes } = useStyles();
  const [password, setPassword] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [disable, setDisable] = useState(false);
  const { mutate, isLoading, isSuccess, isError } =
    useChangeEmailOrUsername("email");

  useDidUpdate(() => {
    if (isLoading) {
      setDisable(true);
    }
    if (isSuccess) {
      showSuccess("Your email has been changed");
      setPassword("");
      setOldEmail("");
      setNewEmail("");
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
        emailCurrent: oldEmail,
        email: newEmail,
      });
  };

  return (
    <Box
      sx={{
        // backgroundColor: "#F1F3F5",
        paddingTop: 115,
        minHeight: `calc(100vh - 115px)`,
      }}
    >
      {user && (
        <Container>
          <SideNavbarNested />
          <Container size={460} my={30}>
            <Title className={classes.title} align="center">
              Change my email
            </Title>
            <Text color="dimmed" size="sm" align="center">
              Enter your new email
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
              <PasswordInput
                label="Current password"
                required
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
              <TextInput
                label="Current email"
                required
                value={oldEmail}
                onChange={(event) => setOldEmail(event.currentTarget.value)}
                error={
                  oldEmail &&
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(oldEmail) &&
                  "You must enter a valid email address"
                }
              />
              {/* <PasswordInputWithStrength
          oldEmail={oldEmail}
          setOldEmail={setOldEmail}
          label="New Password"
        /> */}
              <TextInput
                label="New email"
                required
                value={newEmail}
                onChange={(event) => setNewEmail(event.currentTarget.value)}
                error={
                  ((newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) ||
                    (newEmail && oldEmail === newEmail)) &&
                  "You must enter a valid email address"
                }
                // styles={{
                //   innerInput: {
                //     color: oldEmail !== newEmail && "red",
                //   },
                //   // root: { borderColor: "red" },
                // }}
              />

              <Group position="right" mt="lg" className={classes.controls}>
                <Button
                  className={classes.control}
                  onClick={() => handleChangePassword()}
                  disabled={
                    disable ||
                    !password ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(oldEmail) ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) ||
                    oldEmail === newEmail
                  }
                >
                  Change my email
                </Button>
              </Group>
            </Paper>
          </Container>
        </Container>
      )}
    </Box>
  );
}
