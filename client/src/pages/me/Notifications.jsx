import React, { useState } from 'react';
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
  Title
} from '@mantine/core';
import { useQuery } from 'react-query';
import useUser from './../../react-query-hooks/useUser/useUser';
import SideNavbarNested from './components/SideNavbarNested';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backendApi from '../../utility/backendApi';
import usePatchNotification from './../../react-query-hooks/useNotifications/usePatchNotification';
import NotificationCard from './../../components/Cards/FooterlessCards/NotificationCard';
import { Heart } from 'tabler-icons-react';
import calcTimeAgo from '../../utility/calcTimeAgo';

const useStyles = createStyles(theme => ({
  root: {
    // backgroundColor: theme.colors.red[1],
    paddingTop: 60,
    minHeight: '100vh'
  },

  container: {
    marginTop: 60,
    marginLeft: 400,
    maxWidth: 1100,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },

  unstyledButton: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.xl,
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[8]
          : theme.colors.gray[0]
    }
  },

  pagination: {
    marginTop: 80
  }
}));

const Notifications = () => {
  const { theme, classes } = useStyles();
  const { data: user } = useUser();
  const [page, setPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  const fetchNotifications = () => {
    return axios
      .get(`${backendApi}users/notifications?limit=${limit}&page=${page}`, {
        withCredentials: true
      })
      .then(res => res.data);
  };

  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData
  } = useQuery(['notifications', page], () => fetchNotifications(page), {
    keepPreviousData: true
  });

  const { mutate: patchNotification } = usePatchNotification();

  const navigateToTarget = (id, route, PSSId, commentId, replyId) => {
    patchNotification(id);

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
    <Box className={classes.root}>
      <SideNavbarNested />

      <Container className={classes.container}>
        <Text color="#373A40" size="xl" weight={700}>
          Notifications
        </Text>

        <Divider />
        <div>
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
                someoneLiked
              }) => {
                // const comment = postComment || storyComment || secretComment;
                // const reply = postReply || storyReply;
                const PSSId = postId || storyId || secretId;

                const isChecked = receiver.some(
                  el => el.receiver === user?.id && el.checked
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
                  <UnstyledButton
                    key={_id}
                    onClick={() =>
                      navigateToTarget(_id, route, PSSId, commentId, replyId)
                    }
                    className={classes.unstyledButton}
                  >
                    {someoneLiked ? (
                      <Group>
                        <span
                          style={{
                            width: '60px',
                            textAlign: 'center'
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
                            <Heart
                              size={25}
                              strokeWidth={1.5}
                              color={'#d80b00'}
                            />
                          </Indicator>
                        </span>
                        <span style={{ maxWidth: '950px' }}>
                          <Text size="md" color={theme => theme.colors.dark[6]}>
                            Someone liked your {creation}: "{content}"
                          </Text>
                          <Text size="xs" sx={{ marginTop: 5 }} color="dimmed">
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
                              src={sender?.photo}
                              alt={sender?.username}
                              radius="xl"
                              size="lg"
                            />
                          </Indicator>
                        </span>
                        <span style={{ maxWidth: '950px' }}>
                          <Text size="md" color={theme => theme.colors.dark[6]}>
                            {sender?.profileName}: "{content}"
                          </Text>
                          <Text size="xs" sx={{ marginTop: 5 }} color="dimmed">
                            {calcTimeAgo(createdAt)}
                          </Text>
                        </span>
                      </Group>
                    )}
                  </UnstyledButton>
                );
              }
            )}
        </div>
        <Pagination
          className={classes.pagination}
          color="cyan"
          page={page}
          onChange={setPage}
          total={Math.ceil(data?.totalDocsInDB / limit)}
        />
      </Container>
    </Box>
  );
};

export default Notifications;
