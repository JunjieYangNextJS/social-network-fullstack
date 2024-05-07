import React from 'react';

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
  Menu
} from '@mantine/core';
import { calcMonthAndYear } from '../../../../utility/calcTimeAgo';
import { CalendarStats, Location } from 'tabler-icons-react';
import OtherUserProfileMenu from '../../../../components/Menus/OtherUserProfileMenu';
import AddFriendButton from '../../../../components/Buttons/AddFriendButton';
import FollowButton from './../../../../components/Buttons/FollowButton';
import ChatButton from '../../../../components/Buttons/ChatButton';

const useStyles = createStyles(theme => ({
  card: {
    position: 'relative',
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  },

  avatar: {
    position: 'absolute',
    top: 110,
    left: theme.spacing.xs + 5
    // pointerEvents: 'auto'
  },
  names: {
    position: 'absolute',
    top: 180,
    left: 160
    // pointerEvents: 'none'
  },

  title: {
    fontWeight: 500,
    fontSize: 22,
    // marginTop: theme.spacing.md,
    marginBottom: -theme.spacing.xs / 2
  },

  bio: {
    marginTop: 70,
    marginBottom: 10,
    size: theme.spacing.md,
    color: theme.colors.dark[5],
    whiteSpace: 'pre-wrap'
  },

  action: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]
  },

  footer: {
    marginTop: theme.spacing.md
  }
}));

export default function OtherUserIntroCard({ otherUser, user, navigate }) {
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
    friendList,

    sexuality,
    location,
    twitter,
    allowFollowing,
    allowFriending,

    whoCanMessageMe
  } = otherUser;

  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  return (
    <>
      {otherUser && (
        <Card withBorder radius="md" className={cx(classes.card)}>
          <Card.Section>
            <Image src={profileImage} height={180} />
          </Card.Section>

          <Avatar
            src={photo}
            alt={'avatar'}
            size={130}
            radius={130}
            mr="xl"
            className={classes.avatar}
          />

          <div className={classes.names}>
            <Text className={classes.title}>{profileName}</Text>

            <Text color={theme.colors.gray[7]}>@{username}</Text>
          </div>

          <Text className={classes.bio} lineClamp={4}>
            {bio}
          </Text>
          <Group>
            <Center>
              <CalendarStats size={18} color={theme.colors.gray[7]} />
              <Text sx={{ marginLeft: '5px' }} color={theme.colors.gray[7]}>
                Joined in {calcMonthAndYear(createdAt)}
              </Text>
            </Center>
          </Group>
          {location && (
            <Group>
              <Center>
                <Location size={18} color={theme.colors.gray[7]} />
                <Text sx={{ marginLeft: '5px' }} color={theme.colors.gray[7]}>
                  {location}
                </Text>
              </Center>
            </Group>
          )}

          <Group>
            {gender && (
              <Text color={theme.colors.gray[7]}>Gender: {gender}</Text>
            )}
            {sexuality && (
              <Text color={theme.colors.gray[7]}>Sexuality: {sexuality}</Text>
            )}
          </Group>

          <Group>
            <Text
              onClick={() => navigate(`/users/${username}/following`)}
              color={theme.colors.gray[7]}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              <Text component="span" weight={500}>
                {following.length}
              </Text>{' '}
              Following
            </Text>

            <Text
              color={theme.colors.gray[7]}
              onClick={() => navigate(`/users/${username}/followers`)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              <Text component="span" weight={500}>
                {followers.length}
              </Text>{' '}
              Followers
            </Text>
            {/* </Center> */}
          </Group>

          <Group className={classes.footer}>
            <FollowButton
              myId={user?.id}
              otherUserId={id}
              navigate={navigate}
              otherUserUsername={username}
              otherUserFollowers={followers}
              allowFollowing={allowFollowing}
            />
            <ChatButton
              user={user}
              otherUser={otherUser}
              navigate={navigate}
              // allowChatting={allowChatting}
              whoCanMessageMe={whoCanMessageMe}
            />

            <AddFriendButton
              user={user}
              otherUser={otherUser}
              navigate={navigate}
              allowFriending={allowFriending}
            />
            <OtherUserProfileMenu
              theme={theme}
              username={username}
              friendList={friendList}
              id={id}
              me={user}
              bio={bio}
            />
          </Group>
        </Card>
      )}
    </>
  );
}
