import React from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  createStyles,
  UnstyledButton,
  Indicator,
  Avatar,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    marginTop: 10,
    // border: "1px solid black",
    maxHeight: 90,
    // width: "100%",
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    color: theme.black,
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor: theme.colors.gray[0],
      color: theme.black,
    },
  },
}));

export default function FollowBlock({
  role,
  profileName,
  username,
  photo,
  bio,
  gender,
  sexuality,
  id,
}) {
  const { classes, theme } = useStyles();
  const navigate = useNavigate();

  return (
    <Group
      className={classes.control}
      onClick={() => navigate(`/users/${username}`)}
    >
      <Group position="apart">
        <Group
          spacing={10}
          noWrap
          sx={{
            overflow: "hidden",
            // maxWidth: 700,
            width: 700,
            height: 70,
            cursor: "pointer",
            alignItems: "flex-start",
          }}
        >
          <Indicator
            inline
            size={10}
            offset={5}
            position="bottom-end"
            color="red"
            withBorder
            disabled={role !== "admin"}
          >
            <Avatar src={photo} alt={profileName} radius="xl" size="lg" />
          </Indicator>
          <div>
            <Text weight={500} color={theme.colors.dark[8]} size="md">
              {profileName}
            </Text>
            <Text size="sm" color="dimmed" weight={400}>
              @{username}
            </Text>
            <Group spacing={7}>
              {sexuality && (
                <Text size="xs" weight={400}>
                  {sexuality} ,
                </Text>
              )}
              <Text size="xs" weight={400}>
                {gender}
              </Text>
            </Group>
          </div>

          <Text
            weight={400}
            size="sm"
            color={theme.colors.dark[8]}
            sx={{ marginLeft: 20 }}
          >
            {bio}
          </Text>
        </Group>
      </Group>
    </Group>
  );
}
