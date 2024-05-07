import React, { useState } from "react";
import {
  createStyles,
  Header,
  Autocomplete,
  Group,
  Burger,
  Anchor,
  Center,
  Text,
  ActionIcon,
} from "@mantine/core";
import {
  Search,
  BuildingCarousel,
  Bulb,
  Sunrise,
  BrightnessUp,
} from "tabler-icons-react";
import { Link, useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  // header: {
  //   paddingLeft: theme.spacing.md,
  //   paddingRight: theme.spacing.md,
  // },

  inner: {
    height: 56,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  //   search: {
  //     [theme.fn.smallerThan("xs")]: {
  //       display: "none",
  //     },
  //   },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    cursor: "pointer",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
}));

export default function OtherUserCreationsNavbar({ username }) {
  const { classes, theme } = useStyles();

  const navigate = useNavigate();

  const links = [
    { label: "Posts", toURL: `/users/${username}` },
    { label: "Stories", toURL: `/users/${username}/stories` },
    // { label: "Secrets", toURL: `/users/${username}/secrets` },
  ];

  const items = links.map((link) => (
    <Anchor
      key={link.label}
      component={Link}
      to={link.toURL}
      className={classes.link}

      // sx={{
      //   backgroundColor:
      //     link.toURL === window.location.pathname &&
      //     theme.colors[theme.primaryColor][0],
      //   color:
      //     link.toURL === window.location.pathname &&
      //     theme.colors[theme.primaryColor][7],
      // }}

      //   onClick={(event) => event.preventDefault()}
    >
      <Group spacing={3}>
        <Text underline={link.toURL === window.location.pathname}>
          {link.label}
        </Text>
      </Group>
    </Anchor>
  ));

  return (
    <div className={classes.inner}>
      <Group>
        <Group ml={50} spacing={5} className={classes.links}>
          {items}
        </Group>
      </Group>
    </div>
  );
}
