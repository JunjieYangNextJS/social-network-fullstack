import React, { useState, useRef } from "react";

import {
  Card,
  Image,
  Text,
  Button,
  ActionIcon,
  Group,
  Center,
  Avatar,
  useMantineTheme,
  createStyles,
  Menu,
} from "@mantine/core";
import { calcMonthAndYear } from "./../../../utility/calcTimeAgo";
import {
  CalendarStats,
  CameraPlus,
  Location,
  Settings,
} from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import { useDidUpdate } from "@mantine/hooks";
import { usePatchUserWithFormData } from "./../../../react-query-hooks/useUser/usePatchUser";

const useStyles = createStyles((theme) => ({
  card: {
    position: "relative",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  avatar: {
    position: "absolute",
    top: 110,
    left: theme.spacing.xs + 5,
    pointerEvents: "none",
  },
  names: {
    position: "absolute",
    top: 180,
    left: 160,
    pointerEvents: "none",
  },
  editor: {
    position: "absolute",
    top: 190,
    right: 15,
  },

  title: {
    fontWeight: 500,
    fontSize: 22,
    // marginTop: theme.spacing.md,
    marginBottom: -theme.spacing.xs / 2,
  },

  bio: {
    marginTop: 70,
    marginBottom: 10,
    size: theme.spacing.md,
    color: theme.colors.dark[5],
    whiteSpace: "pre-wrap",
  },

  action: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
  },

  footer: {
    marginTop: theme.spacing.md,
  },
}));

export default function MyProfileIntroCard({ user, setOpened }) {
  const {
    username,
    profileName,
    photo,
    profileImage,
    createdAt,
    following,
    followers,
    gender,
    bio,
    id,
    sexuality,
    location,
  } = user;

  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { mutate: updateMyProfileImage } = usePatchUserWithFormData();

  const profileImageRef = useRef();
  const [profileImageIsHovered, setProfileImageIsHovered] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);

  const handleSelectedProfileImage = (e) => {
    setSelectedProfileImage(e.target.files[0]);
  };

  useDidUpdate(() => {
    const fd = new FormData();

    fd.append("profileImage", selectedProfileImage);

    updateMyProfileImage(fd);
  }, [selectedProfileImage]);

  return (
    <Card withBorder radius="md" className={cx(classes.card)}>
      <Card.Section>
        <Image
          src={profileImage}
          height={180}
          onMouseEnter={() => setProfileImageIsHovered(true)}
          onMouseLeave={() => setProfileImageIsHovered(false)}
          sx={{
            opacity: profileImageIsHovered ? 0.7 : 1,
            transition: "0.5s ease-in-out",
            cursor: "default",
          }}
        />
        <ActionIcon
          variant="light"
          size="lg"
          onClick={() => profileImageRef.current.click()}
          onMouseEnter={() => setProfileImageIsHovered(true)}
          onMouseLeave={() => setProfileImageIsHovered(false)}
          sx={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,

            marginLeft: "auto",
            marginRight: "auto",
            opacity: profileImageIsHovered ? 1 : 0,
            transition: "0.5s ease-in-out",
          }}
        >
          <CameraPlus size={25} color="black" strokeWidth={1.5} />
          <input
            type="file"
            hidden
            accept="image/*"
            name="profileImage"
            ref={profileImageRef}
            onChange={(e) => handleSelectedProfileImage(e)}
          />
        </ActionIcon>
      </Card.Section>

      <Avatar
        src={photo}
        size={130}
        radius={130}
        mr="xl"
        className={classes.avatar}
      />

      <div className={classes.names}>
        <Text className={classes.title}>{profileName}</Text>

        <Text color={theme.colors.gray[7]}>@{username}</Text>
      </div>
      <Button
        variant="subtle"
        size={16}
        className={classes.editor}
        compact
        onClick={() => setOpened(true)}
      >
        Edit
      </Button>

      <Text className={classes.bio} lineClamp={4} color={theme.colors.gray[7]}>
        {bio}
      </Text>
      <Group>
        <Center>
          <CalendarStats size={18} color={theme.colors.gray[7]} />
          <Text sx={{ marginLeft: "5px" }} color={theme.colors.gray[7]}>
            Joined in {calcMonthAndYear(createdAt)}
          </Text>
        </Center>
      </Group>
      {location && (
        <Group>
          <Center>
            <Location size={18} color={theme.colors.gray[7]} />
            <Text sx={{ marginLeft: "5px" }} color={theme.colors.gray[7]}>
              {location}
            </Text>
          </Center>
        </Group>
      )}

      <Group>
        {gender && <Text color={theme.colors.gray[7]}>Gender: {gender}</Text>}
        {sexuality && (
          <Text color={theme.colors.gray[7]}>Sexuality: {sexuality}</Text>
        )}
      </Group>
      <Group>
        <Text
          onClick={() => navigate(`/me/${username}/following`)}
          color={theme.colors.gray[7]}
          sx={{
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          <Text component="span" weight={500}>
            {following.length}
          </Text>{" "}
          Following
        </Text>

        <Text
          onClick={() => navigate(`/me/${username}/followers`)}
          color={theme.colors.gray[7]}
          sx={{
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          <Text component="span" weight={500}>
            {followers.length}
          </Text>{" "}
          Followers
        </Text>
        {/* </Center> */}
      </Group>
    </Card>
  );
}
