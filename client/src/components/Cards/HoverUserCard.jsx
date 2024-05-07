import React from 'react';
import {
  createStyles,
  Card,
  Avatar,
  Text,
  Group,
  Button,
  SimpleGrid,
  Stack
} from '@mantine/core';
import FollowButton from '../Buttons/FollowButton';

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  },

  avatar: {
    border: `2px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
    }`
  }
}));

export default function HoverUserCard({ debouncedUserData, myId, commenter }) {
  const {
    postStoryCount,
    commentReplyCount,
    followers,
    followingCount,
    allowFollowing
  } = debouncedUserData;
  const {
    _id,
    profileName,
    username,
    photo,
    createdAt,
    role,
    profileImage
  } = commenter;

  const { classes, theme } = useStyles();

  // const items = stats.map((stat) => (
  //   <div key={stat.label}>
  //     <Text align="center" size="lg" weight={500}>
  //       {stat.value}
  //     </Text>
  //     <Text align="center" size="sm" color="dimmed">
  //       {stat.label}
  //     </Text>
  //   </div>
  // ));

  return (
    <>
      {commenter && debouncedUserData && (
        <Card radius="md" className={classes.card}>
          <Card.Section
            sx={{
              height: 50
            }}
          />
          <Avatar
            src={photo}
            size={80}
            radius={80}
            mx="auto"
            mt={-30}
            className={classes.avatar}
          />
          <Text align="center" size="lg" weight={500} mt="sm">
            {profileName}{' '}
            <Text component="span" size="md" color="red">
              {role === 'admin' && '(admin)'}
            </Text>
          </Text>
          <Text align="center" size="sm" color="dimmed">
            @{username}
          </Text>
          <SimpleGrid cols={2} spacing={'xs'} style={{ marginBottom: 10 }}>
            <Stack spacing={0}>
              <Text size="md" align="center">
                {postStoryCount}
              </Text>
              <Text size="xs" align="center">
                Posts/Stories{' '}
              </Text>
            </Stack>
            <Stack spacing={0}>
              <Text size="md" align="center">
                {followingCount}
              </Text>
              <Text size="xs" align="center">
                Following
              </Text>
            </Stack>
            <Stack spacing={0}>
              <Text size="md" align="center">
                {commentReplyCount}
              </Text>
              <Text size="xs" align="center">
                Comments
              </Text>
            </Stack>
            <Stack spacing={0}>
              <Text size="md" align="center">
                {followers.length}
              </Text>
              <Text size="xs" align="center">
                Followers
              </Text>
            </Stack>
          </SimpleGrid>
          {/* <Group mt="md" position="center" spacing={30}>
        <Text>Posts/Stories: {postStoryCount}</Text>
        <Text>Comments: {commentReplyCount}</Text>
        <Text>Following: {followingCount}</Text>
        <Text>Followers: {followers.length}</Text>
      </Group> */}

          {/* <Button
        fullWidth
        radius="md"
        mt="xl"
        size="md"
        color={theme.colorScheme === "dark" ? undefined : "dark"}
      >
        Follow
      </Button> */}
          {_id !== myId && (
            <FollowButton
              otherUserId={_id}
              otherUserUsername={username}
              otherUserFollowers={followers}
              myId={myId}
              fullWidth={true}
              allowFollowing={allowFollowing}
              hoverQueryName={['user', _id, 'hover']}
            />
          )}
        </Card>
      )}
    </>
  );
}
