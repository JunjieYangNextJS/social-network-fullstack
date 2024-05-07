import React, { useEffect, useState } from 'react';
import {
  Container,
  createStyles,
  Text,
  Avatar,
  Group,
  Button,
  Menu,
  Loader,
  Center,
  Indicator,
  Card,
  Box,
  UnstyledButton,
  useMantineTheme,
  Tooltip,
  ActionIcon
} from '@mantine/core';
import { ArrowBigDown, ArrowBigTop, Heart } from 'tabler-icons-react';
import { useDebouncedValue, useDidUpdate } from '@mantine/hooks';
import isRichTextEmpty from './../../../utility/isRichTextEmpty';
import calcTimeAgo from './../../../utility/calcTimeAgo';
import { Link } from 'react-router-dom';
import BookmarkLikeMoreIconGroups from './../../../components/IconGroups/BookmarkLikeMoreIconGroups';

import RichTextEditor from '@mantine/rte';

import { useGetHoverOtherUser } from '../../../react-query-hooks/useOtherUsers/useOtherUser';
import { useNavigate } from 'react-router-dom';
import AvatarComponent from '../../AvatarComponent';

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    position: 'relative',
    cursor: 'pointer',
    // padding: "16px",
    // borderRadius: 8,
    // border: "1px solid #e9ecef",
    // overflow: "hidden",

    transition: 'transform 100ms ease, box-shadow 100ms ease',
    // padding: theme.spacing.xl,
    // paddingLeft: theme.spacing.xl * 2,
    marginBottom: theme.spacing.lg,
    maxWidth: '600px',

    '&:hover': {
      boxShadow: theme.shadows.md,
      transform: 'scale(1.01)'
    }
  },

  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm
  },

  commentBody: {
    marginLeft: 18,
    marginTop: 7,
    paddingLeft: 2,
    borderWidth: 4,
    borderRadius: 5,
    borderStyle: 'solid',
    borderRight: 'none',
    // borderImage: "black",
    borderImage: `linear-gradient(
      to bottom,
      #d9e1ecf8,
      rgba(0, 0, 0, 0)
    ) 1 100%;`
  }
}));

const StoryReplyCard = ({ storyReply, user }) => {
  const {
    replier,
    content,
    createdAt,
    editedAt,
    id,
    likes,
    storyComment,
    replyCount
  } = storyReply;

  const { classes, theme } = useStyles();
  const navigate = useNavigate();

  const edited = ' (edited)';

  return (
    <>
      {storyReply && replier && (
        <Card
          radius="md"
          className={classes.card}
          component={Link}
          to={`/story-comment/${storyComment}`}
          rel="noopener noreferrer"
          withBorder={true}
        >
          <Group>
            <AvatarComponent
              creator={replier}
              username={replier?.username}
              profileName={replier?.profileName}
              role={replier?.role}
              photo={replier?.photo}
              id={replier?._id}
              creationId={id}
              myId={user?.id}
            />

            <div>
              <Text size="sm">{replier?.profileName}</Text>
              <Text size="xs" color="dimmed">
                {editedAt
                  ? calcTimeAgo(editedAt) + edited
                  : calcTimeAgo(createdAt)}
              </Text>
            </div>
          </Group>

          <div className={classes.commentBody}>
            <RichTextEditor
              // placeholder="Story comment content"
              // mt="md"
              onClick={e =>
                e.target.currentSrc &&
                window.open(e.target.currentSrc, '_blank', 'noopener')
              }
              id={`storyReplyContent${id}`}
              name={`storyReplyContent${id}`}
              key={`storyReplyContent${id}`}
              value={content}
              // onChange={setRichText}
              readOnly={true}
              sx={{
                border: 'none',
                fontSize: 15,
                color: ' #343a40'
              }}
            />

            <Group spacing="xs">
              <Button variant="white" color="gray" size="xs">
                Replies {replyCount > 0 && replyCount}
              </Button>
              <Tooltip
                wrapLines
                withArrow
                transition="fade"
                transitionDuration={200}
                label="Likes"
              >
                <ActionIcon aria-label="like" variant="transparent">
                  <Heart
                    size={16}
                    color={
                      likes?.includes(user?.id)
                        ? theme.colors.red[6]
                        : '#343a40'
                    }
                  />
                  {likes?.length}
                </ActionIcon>
              </Tooltip>
            </Group>
          </div>
        </Card>
      )}
    </>
  );
};

export default StoryReplyCard;
