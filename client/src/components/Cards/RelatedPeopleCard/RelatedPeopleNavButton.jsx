import React, { useState, useEffect } from "react";
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
import FollowButton from "./../../Buttons/FollowButton";

const useStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    height: 60,
    // width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,
    color: theme.black,
    fontSize: theme.fontSizes.sm,

    "&:hover": {
      backgroundColor: theme.colors.gray[0],
      color: theme.black,
    },
  },
}));

export default function RelatedPeopleNavButton({ person, myId }) {
  const { classes, theme } = useStyles();
  const navigate = useNavigate();
  const [maxWidth, setMaxWidth] = useState(170);

  const { role, profileName, username, photo, _id, followers, allowFollowing } =
    person;

  return (
    <Group className={classes.control}>
      <Group position="apart">
        <Group
          spacing={10}
          noWrap
          sx={{
            overflow: "hidden",
            maxWidth,
            height: 42,
            cursor: "pointer",
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
            <Avatar src={photo} alt={profileName} radius="xl" size="md" />
          </Indicator>
          <div>
            <Text weight={400} color={theme.colors.dark[8]} size="sm">
              {profileName}
            </Text>
            <Text size="xs" color="dimmed">
              @{username}
            </Text>
          </div>
        </Group>
        <FollowButton
          myId={myId}
          otherUserId={_id}
          otherUserUsername={username}
          otherUserFollowers={followers}
          allowFollowing={allowFollowing}
          compact={true}
          setMaxWidth={setMaxWidth}
        />
      </Group>
    </Group>
  );
}
