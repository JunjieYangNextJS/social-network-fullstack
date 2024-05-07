import React from "react";
import {
  Navbar,
  Group,
  Code,
  ScrollArea,
  createStyles,
  UnstyledButton,
  Indicator,
  Avatar,
  Text,
  Menu,
  ActionIcon,
  Box,
  Divider,
} from "@mantine/core";
import {
  Notes,
  CalendarStats,
  Gauge,
  PresentationAnalytics,
  FileAnalytics,
  Adjustments,
  Lock,
  DotsVertical,
  Eye,
  Flag,
} from "tabler-icons-react";

import FriendMenu from "./FriendMenu";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
    position: "fixed",
    gap: "10px",
    marginTop: 15,
    left: 300,
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  control: {
    fontWeight: 500,
    display: "block",
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.black,
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor: theme.colors.gray[0],
      color: theme.black,
    },
  },
}));

export default function FriendListSideBar({ user }) {
  const { classes, theme } = useStyles();

  return (
    <Navbar
      height={"100%"}
      width={{ base: 300 }}
      p="md"
      className={classes.navbar}
    >
      <Navbar.Section>
        <Text color="#373A40" size="xl" weight={700}>
          Friend List
        </Text>
      </Navbar.Section>
      <Divider />
      {user && user.friendList && (
        <Navbar.Section grow className={classes.links} component={ScrollArea}>
          <div className={classes.linksInner}>
            {user.friendList.map(
              ({ role, photo, profileName, username, id }) => (
                <Group key={id} className={classes.control}>
                  <Group position="apart">
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
                          size="md"
                        />
                      </Indicator>
                      <div
                        style={{
                          cursor: "pointer",

                          maxWidth: "140px",
                          overflow: "hidden",
                        }}
                      >
                        <Text
                          weight={400}
                          color={theme.colors.dark[8]}
                          size="sm"
                        >
                          {profileName}
                        </Text>
                        <Text size="xs" color="dimmed">
                          @{username}
                        </Text>
                      </div>
                    </Group>
                    <FriendMenu
                      profileName={profileName}
                      username={username}
                      id={id}
                      me={user}
                      theme={theme}
                    />
                  </Group>
                </Group>
              )
            )}
          </div>
        </Navbar.Section>
      )}
    </Navbar>
  );
}
