import React, { useState } from "react";
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
} from "@mantine/core";
import { useQuery } from "react-query";
import useUser from "./../../../react-query-hooks/useUser/useUser";
import SideNavbarNested from "./../components/SideNavbarNested";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import backendApi from "./../../../utility/backendApi";
import { Heart } from "tabler-icons-react";
import calcTimeAgo from "./../../../utility/calcTimeAgo";
import AcceptDeclineButtons from "./AcceptDeclineButtons";
import FriendListSideBar from "./FriendListSideBar";

const useStyles = createStyles((theme) => ({
  root: {
    // backgroundColor: theme.colors.red[1],
    paddingTop: 60,
    minHeight: "100vh",
  },

  container: {
    marginTop: 60,
    marginLeft: 650,
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

const FriendListPage = () => {
  const { theme, classes } = useStyles();
  const { data: user } = useUser();

  const navigate = useNavigate();

  return (
    <Box className={classes.root}>
      <SideNavbarNested />
      <FriendListSideBar user={user} />
      <Container className={classes.container}>
        <Text color="#373A40" size="xl" weight={700}>
          Friend Requests
        </Text>

        <Divider />
        <div>
          {user &&
            user.incomingFriendRequests.map(
              ({
                message,
                userId,
                username,
                profileName,
                role,
                _id,
                photo,
              }) => {
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

                      <AcceptDeclineButtons
                        requesterId={userId}
                        requesterUsername={username}
                      />
                    </Group>

                    <Text sx={{ marginTop: 10, marginBottom: 20 }}>
                      {message}
                    </Text>
                  </div>
                );
              }
            )}
        </div>
      </Container>
    </Box>
  );
};

export default FriendListPage;
