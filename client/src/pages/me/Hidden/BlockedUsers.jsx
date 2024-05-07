import React, { useState, useEffect } from "react";
import {
  Container,
  Pagination,
  createStyles,
  Box,
  Textarea,
  Group,
  Indicator,
  Text,
  Avatar,
  UnstyledButton,
  Divider,
  Title,
  Button,
} from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
import { Link, useNavigate } from "react-router-dom";
import SideNavbarNested from "./../components/SideNavbarNested";
import { useGetBlockedUsers } from "./../../../react-query-hooks/useUser/useGetBlocked";
import { usePatchArrayMethod } from "./../../../react-query-hooks/useUser/usePatchUser";

const useStyles = createStyles((theme) => ({
  root: {
    // backgroundColor: theme.colors.red[1],
    paddingTop: 60,
    minHeight: "100vh",
  },

  container: {
    marginTop: 60,

    maxWidth: 800,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  unstyledButton: {
    display: "block",
    width: "95%",
    padding: theme.spacing.xl,
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },

  pagination: {
    marginTop: 80,
  },
}));

export default function BlockedUsers() {
  const { data: blockedUsers } = useGetBlockedUsers();
  const { mutate: removeBlockUser, isLoading } =
    usePatchArrayMethod("removeBlockedUser");

  const navigate = useNavigate();
  const { theme, classes } = useStyles();

  //   useDidUpdate(() => {
  //     if (removeLoading) {
  //       setOpened(false);
  //     }
  //   }, [addLoading, removeLoading]);

  return (
    <Box className={classes.root}>
      <SideNavbarNested />

      <Container className={classes.container}>
        <Text color="#373A40" size="xl" weight={700}>
          Blocked Users
        </Text>

        <Divider />
        <div>
          {blockedUsers &&
            blockedUsers.map(({ username, profileName, role, _id, photo }) => {
              // const comment = postComment || storyComment || secretComment;
              // const reply = postReply || storyReply;

              return (
                <div key={_id} className={classes.unstyledButton}>
                  <Group sx={{ justifyContent: "space-between" }}>
                    <Group>
                      <Indicator
                        inline
                        size={10}
                        offset={5}
                        position="bottom-end"
                        color="red"
                        withBorder
                        disabled={role !== "admin"}
                      >
                        <Avatar
                          src={photo}
                          alt={profileName}
                          radius="xl"
                          component={Link}
                          size="lg"
                          to={`/users/${username}`}
                        />
                      </Indicator>
                      <div
                        onClick={() => navigate(`/users/${username}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <Text
                          weight={400}
                          color={theme.colors.dark[8]}
                          size="md"
                        >
                          {profileName}
                        </Text>
                        <Text size="md" color="dimmed">
                          @{username}
                        </Text>
                      </div>
                    </Group>

                    <Button
                      size="sm"
                      variant="subtle"
                      onClick={() => removeBlockUser()}
                      disabled={isLoading}
                    >
                      Unblock
                    </Button>
                  </Group>
                </div>
              );
            })}
        </div>
      </Container>
    </Box>
  );
}
