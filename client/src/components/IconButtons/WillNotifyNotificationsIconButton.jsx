import React, { useState, useMemo, useEffect } from 'react';
import {
  Bell,
  Heart,
  ThumbUp,
  Friends,
  CameraSelfie,
  MoodHappy,
  MoodSmile
} from 'tabler-icons-react';
import {
  ActionIcon,
  Indicator,
  Tooltip,
  Menu,
  ScrollArea,
  MenuLabel,
  Divider,
  Text,
  Group,
  Avatar
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import useGetWillNotifyNotifications from '../../react-query-hooks/useNotifications/useGetWillNotifyNotifications';
import StopNotificationsIconButton from './StopNotificationsIconButton';
import usePatchWillNotifyNotifications from '../../react-query-hooks/useNotifications/usePatchWillNotify';
import calcTimeAgo from '../../utility/calcTimeAgo';
import { Link, useNavigate } from 'react-router-dom';
import usePatchNotification from './../../react-query-hooks/useNotifications/usePatchNotification';

export default function WillNotifyNotificationsIconButton({ user }) {
  const { data } = useGetWillNotifyNotifications();
  const { mutate: patchReadNotifications } = usePatchWillNotifyNotifications();
  const { mutate: patchNotification } = usePatchNotification();

  const handleReadNotifications = () => {
    if (!data) return;
    const ids = data?.docs.map(el => el._id);

    patchReadNotifications({ ids });
  };

  const [opened, handlers] = useDisclosure(false);
  // const [friendRequestOpened, setFriendRequestOpened] = useState(false);

  const navigate = useNavigate();

  const navigateToTarget = (
    id,
    route,
    PSSId,
    commentId,
    replyId,
    isFriendRequest,
    isFollow,
    senderUsername
  ) => {
    handlers.close();
    patchNotification(id);

    if (isFollow) {
      navigate(`/users/${senderUsername}`);
      return;
    }

    if (isFriendRequest) {
      navigate(`/me/friend-list`);
      return;
    }

    if (route === 'postComments' && replyId && commentId) {
      localStorage.setItem('highlightedReply', replyId);
      navigate(`/post-comment/${commentId}`);
      return;
    }
    if (route === 'storyComments' && replyId && commentId) {
      localStorage.setItem('highlightedReply', replyId);
      navigate(`/story-comment/${commentId}`);
      return;
    }
    if (route === 'postComments') return navigate(`/post-comment/${commentId}`);
    if (route === 'storyComments')
      return navigate(`/story-comment/${commentId}`);

    if (route === 'secretCommentsFromTeller')
      return navigate(`/tree-hollow/${PSSId}`);
    if (route === 'secretCommentsFromCommenter')
      return navigate(`/tree-hollow/private/${commentId}`);

    if (route === 'posts') return navigate(`/posts/${PSSId}`);
    if (route === 'stories') return navigate(`/stories/${PSSId}`);
    if (route === 'secrets') return navigate(`/secrets/${PSSId}`);
  };

  return (
    <Tooltip
      wrapLines
      withArrow
      transition="fade"
      transitionDuration={200}
      label="Notifications"
      color="#909296"
      disabled={opened}
    >
      <Menu
        placement="end"
        transition="pop-top-right"
        opened={opened}
        onOpen={handlers.open}
        onClose={handlers.close}
        onClick={() => handleReadNotifications()}
        closeOnItemClick={false}
        size={450}
        control={
          data?.unreadCount > 0 ? (
            <Indicator
              inline
              label={data?.unreadCount > 99 ? '99+' : data?.unreadCount}
              size={12}
              offset={3}
              withBorder
            >
              <ActionIcon aria-label="Notifications">
                <Bell size={22} color={'black'} strokeWidth={1} />
              </ActionIcon>
            </Indicator>
          ) : (
            <ActionIcon aria-label="Notifications">
              <Bell size={22} color={'black'} strokeWidth={1} />
            </ActionIcon>
          )
        }
      >
        <Menu.Item
          component={Link}
          to="/me/notifications"
          onClick={() => handlers.close()}
        >
          <Text size="md" color={theme => theme.colors.dark[6]}>
            Notifications
          </Text>
        </Menu.Item>
        <Divider />
        <ScrollArea style={{ height: 500 }}>
          {data &&
            data.docs.map(
              ({
                sender,
                content,
                createdAt,
                receiver,
                _id,
                route,
                postId,
                storyId,
                secretId,
                commentId,
                replyId,
                someoneLiked,
                isFriendRequest,
                isFollow
              }) => {
                // const comment = postComment || storyComment || secretComment;
                // const reply = postReply || storyReply;
                const PSSId = postId || storyId || secretId;

                const isChecked = receiver.some(
                  el => el.receiver === user.id && el.checked
                );

                let creation;
                switch (route) {
                  case 'posts':
                    creation = 'post';
                    break;
                  case 'stories':
                    creation = 'story';
                    break;
                  case 'secrets':
                    creation = 'secret';
                    break;
                  case 'postComments':
                    creation = 'comment';
                    break;
                  case 'storyComments':
                    creation = 'comment';
                    break;
                  case 'secretComments':
                    creation = 'comment';
                    break;

                  default:
                    break;
                }
                return (
                  <Menu.Item
                    key={_id}
                    onClick={() =>
                      navigateToTarget(
                        _id,
                        route,
                        PSSId,
                        commentId,
                        replyId,
                        isFriendRequest,
                        isFollow,
                        sender?.username
                      )
                    }
                  >
                    {sender &&
                      (someoneLiked ? (
                        <Group>
                          <span
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: 100,
                              backgroundColor: '#228BE6',
                              marginRight: '-25px',
                              marginLeft: '5px',
                              visibility: isChecked ? 'hidden' : 'visible'
                            }}
                          />
                          <span
                            style={{
                              width: '60px',
                              textAlign: 'center'
                            }}
                          >
                            <Heart
                              size={25}
                              strokeWidth={1.5}
                              color={'#d80b00'}
                            />
                          </span>
                          <span style={{ width: '330px' }}>
                            <Text
                              size="sm"
                              color={theme => theme.colors.dark[6]}
                            >
                              Someone liked your {creation}: "{content}"
                            </Text>
                            <Text
                              size="xs"
                              sx={{ marginTop: 5 }}
                              color="dimmed"
                            >
                              {calcTimeAgo(createdAt)}
                            </Text>
                          </span>
                        </Group>
                      ) : isFriendRequest ? (
                        <Group>
                          <span
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: 100,
                              backgroundColor: '#228BE6',
                              marginRight: '-25px',
                              marginLeft: '5px',
                              visibility: isChecked ? 'hidden' : 'visible'
                            }}
                          />
                          <span
                            style={{
                              width: '60px',
                              textAlign: 'center'
                            }}
                          >
                            <Friends
                              size={25}
                              strokeWidth={1.5}
                              color={'#94D82D'}
                            />
                          </span>
                          <span style={{ width: '330px' }}>
                            <Text
                              size="sm"
                              color={theme => theme.colors.dark[6]}
                            >
                              {sender.profileName} wants to add you as a friend
                            </Text>
                            <Text
                              size="xs"
                              sx={{ marginTop: 5 }}
                              color="dimmed"
                            >
                              {calcTimeAgo(createdAt)}
                            </Text>
                          </span>
                        </Group>
                      ) : isFollow ? (
                        <Group>
                          <span
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: 100,
                              backgroundColor: '#228BE6',
                              marginRight: '-25px',
                              marginLeft: '5px',
                              visibility: isChecked ? 'hidden' : 'visible'
                            }}
                          />
                          <span
                            style={{
                              width: '60px',
                              textAlign: 'center'
                            }}
                          >
                            <MoodSmile
                              size={25}
                              strokeWidth={1.5}
                              color={'#f58326'}
                            />
                          </span>
                          <span style={{ width: '330px' }}>
                            <Text
                              size="sm"
                              color={theme => theme.colors.dark[6]}
                            >
                              {sender.profileName} just followed you
                            </Text>
                            <Text
                              size="xs"
                              sx={{ marginTop: 5 }}
                              color="dimmed"
                            >
                              {calcTimeAgo(createdAt)}
                            </Text>
                          </span>
                        </Group>
                      ) : (
                        <Group>
                          <span
                            style={{
                              width: '60px',

                              alignSelf: 'flex-start'
                            }}
                          >
                            <Indicator
                              inline
                              size={4}
                              offset={5}
                              position="top-start"
                              color="blue"
                              withBorder
                              disabled={isChecked}
                            >
                              <Avatar
                                src={sender.photo}
                                alt={sender?.username}
                                radius="xl"
                                size="lg"
                              />
                            </Indicator>
                          </span>
                          <span style={{ width: '330px' }}>
                            <Text
                              size="sm"
                              color={theme => theme.colors.dark[6]}
                            >
                              {sender.profileName}: "{content}"
                            </Text>
                            <Text
                              size="xs"
                              sx={{ marginTop: 5 }}
                              color="dimmed"
                            >
                              {calcTimeAgo(createdAt)}
                            </Text>
                          </span>
                        </Group>
                      ))}
                  </Menu.Item>
                );
              }
            )}
        </ScrollArea>
      </Menu>
    </Tooltip>
  );
}
