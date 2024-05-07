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
  UnstyledButton
} from '@mantine/core';
import { ArrowBigDown, ArrowBigTop } from 'tabler-icons-react';
import { useDebouncedValue, useDidUpdate } from '@mantine/hooks';
import isRichTextEmpty from './../../../utility/isRichTextEmpty';
import calcTimeAgo from './../../../utility/calcTimeAgo';
import { Link } from 'react-router-dom';
import BookmarkLikeMoreIconGroups from './../../../components/IconGroups/BookmarkLikeMoreIconGroups';

import RichTextEditor from '@mantine/rte';

import { useGetHoverOtherUser } from '../../../react-query-hooks/useOtherUsers/useOtherUser';
import { useNavigate } from 'react-router-dom';
import AvatarComponent from './../../AvatarComponent';

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

const StoryCommentCard = ({ storyComment, user }) => {
  const {
    commenter,
    content,
    createdAt,
    editedAt,
    id,
    likes,
    story,
    replyCount
  } = storyComment;

  const { classes } = useStyles();
  const navigate = useNavigate();

  const edited = ' (edited)';

  // story comment

  //   const [richText, setRichText] = useState("");

  // debounced user data trigger on hover
  // const [mouseEnterUserId, setMouseEnterUserId] = useState(null);
  // const [debouncedUserId] = useDebouncedValue(mouseEnterUserId, 500);

  // const { data: debouncedUserData } = useGetHoverOtherUser(debouncedUserId);

  //   useEffect(() => {
  //     setRichText(content);
  //   }, [content]);

  // const handleNavigateToComment = () => {
  //   if (!readOnly) return;
  //   navigate(`/story-comment/${id}`);
  // };

  return (
    <>
      {storyComment && commenter && (
        <Card
          radius="md"
          className={classes.card}
          component={Link}
          to={`/story-comment/${id}`}
          rel="noopener noreferrer"
          withBorder={true}
        >
          {commenter?._id === '627d8f9bbdda690fac7970d4' ? (
            <Group>
              <Avatar
                src={commenter?.photo}
                alt={commenter?.profileName}
                radius="xl"
              />

              <div>
                <Text size="sm">{commenter?.profileName}</Text>
                <Text size="xs" color="dimmed">
                  {editedAt && 'deleted ' + calcTimeAgo(editedAt)}
                </Text>
              </div>
            </Group>
          ) : (
            <Group>
              <AvatarComponent
                creator={commenter}
                username={commenter?.username}
                profileName={commenter?.profileName}
                role={commenter?.role}
                photo={commenter?.photo}
                id={commenter?._id}
                creationId={id}
                myId={user?.id}
              />

              <div>
                <Text size="sm">{commenter?.profileName}</Text>
                <Text size="xs" color="dimmed">
                  {editedAt
                    ? calcTimeAgo(editedAt) + edited
                    : calcTimeAgo(createdAt)}
                </Text>
              </div>
            </Group>
          )}

          <div className={classes.commentBody}>
            <RichTextEditor
              // placeholder="Story comment content"
              // mt="md"
              onClick={e =>
                e.target.currentSrc &&
                window.open(e.target.currentSrc, '_blank', 'noopener')
              }
              id={`storyCommentContent${id}`}
              name={`storyCommentContent${id}`}
              key={`storyCommentContent${id}`}
              value={content}
              //   onChange={setRichText}
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
              <BookmarkLikeMoreIconGroups
                itemLikes={likes}
                itemId={id}
                navigate={navigate}
                user={user}
                userLikedItems={user?.likedStoryComments}
                arrayMethod="StoryComment"
                patchEndPoint="storyComments"
                userBookmarkedItems={user?.bookmarkedStoryComments}
                bookmarkAddMethod="addBookmarkedStoryComment"
                bookmarkRemoveMethod="removeBookmarkedStoryComment"
                queryName={['story', story?._id, 'comments']}
                likedProperty="likedStoryComments"
                bookmarkedProperty="bookmarkedStoryComments"
                itemModel="StoryComment"
                notFunctional={true}
              />
            </Group>
          </div>
        </Card>
      )}
    </>
  );
};

export default StoryCommentCard;
