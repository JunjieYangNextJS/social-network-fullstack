import React from 'react';
import {
  createStyles,
  Card,
  Group,
  Text,
  Title,
  Button,
  Tooltip
} from '@mantine/core';
import calcTimeAgo from './../../utility/calcTimeAgo';
import { Link, useNavigate } from 'react-router-dom';
import { Speakerphone, ThumbUp } from 'tabler-icons-react';
import BookmarkLikeMoreIconGroups from '../IconGroups/BookmarkLikeMoreIconGroups';
import PostStoryActionMenu from './../Menus/PostStoryActionMenu';
import useDeletePost from '../../react-query-hooks/usePosts/useDeletePost';
import CommentsCountIconButton from '../IconButtons/CommentsCountIconButton';
import RichTextEditor from '@mantine/rte';
import AvatarComponent from '../AvatarComponent';

const useStyles = createStyles(theme => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    position: 'relative',
    cursor: 'pointer',
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

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.colors.dark[6],
    padding: 10,
    textOverflow: 'ellipsis'
    // whiteSpace: "nowrap",
  },

  richTextEditor: {
    border: 'none',
    maxHeight: 350,
    minHeight: 0,
    fontSize: 15,
    color: ' #343a40',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingBottom: `${theme.spacing.xs}px`
  },

  footer: {
    padding: `0 ${theme.spacing.lg}px ${theme.spacing.xs}px ${
      theme.spacing.lg
    }px`,
    marginTop: theme.spacing.md
  }
}));

export default function PostCard({
  user,
  content,
  title,
  sticky,
  likes,
  poll,
  modFavored,
  commentCount,
  createdAt,
  lastCommentedAt,
  poster,
  postId,
  posterPhoto,
  posterUsername,
  posterId,
  oldPagesArray,
  posterProfileName,
  posterRole,
  withBorder,
  notFunctional,
  noHoverCard
}) {
  const { classes, theme } = useStyles();

  const navigate = useNavigate();

  const { mutate: handleDeletePost, status: deleteStatus } = useDeletePost();

  // const navigateToPostId = () => {
  //   navigate(`/posts/${postId}`);
  // };

  const navigateToUserProfile = e => {
    e.preventDefault();
    navigate(`/users/${posterUsername}`);
  };

  return (
    <div>
      {posterPhoto && (
        <Card
          radius="md"
          className={classes.card}
          component={Link}
          to={`/posts/${postId}`}
          // onClick={() => navigateToPostId()}
          withBorder={withBorder}
        >
          <Group>
            <AvatarComponent
              creator={poster}
              username={posterUsername}
              profileName={posterProfileName}
              role={posterRole}
              photo={posterPhoto}
              id={posterId}
              creationId={postId}
              myId={user?.id}
              noHoverCard={noHoverCard}
            />

            <div>
              <Text
                weight={400}
                color={theme.colors.dark[8]}
                size="sm"
                onClick={e => navigateToUserProfile(e)}
                // component={Link}
                // to={`/users/${posterUsername}`}
              >
                {posterProfileName}
              </Text>
              <Text size="xs" color="dimmed">
                {calcTimeAgo(createdAt)}
              </Text>
            </div>
          </Group>

          <Title
            order={4}
            className={classes.title}
            mt="md"
            id={`postCardTitle${postId}`}
          >
            {modFavored && (
              <Tooltip label="Recommended">
                <span style={{ marginRight: 5 }}>
                  <ThumbUp size={16} strokeWidth={2} color={'orange'} />
                </span>
              </Tooltip>
            )}
            {sticky && (
              <Tooltip label="Announcement">
                <span style={{ marginRight: 5 }}>
                  <Speakerphone size={16} strokeWidth={2} color={'#228BE6'} />
                </span>
              </Tooltip>
            )}

            {title}
          </Title>
          {content && !sticky && (
            <RichTextEditor
              value={content}
              readOnly
              id={`postCardContent${postId}`}
              className={classes.richTextEditor}
            />
          )}

          {poll?.length >= 2 && (
            <Button sx={{ marginLeft: 5, marginTop: 10 }} variant="outline">
              Vote now
            </Button>
          )}

          <Card.Section className={classes.footer}>
            <Group position="apart">
              <Group spacing="xs" align="bottom">
                {/* here */}

                <CommentsCountIconButton commentsCount={commentCount} />
                <Text size="xs">
                  {commentCount > 0 &&
                    `${'Someone commented ' + calcTimeAgo(lastCommentedAt)}`}
                </Text>
              </Group>

              {notFunctional ? (
                <BookmarkLikeMoreIconGroups
                  itemLikes={likes}
                  itemId={postId}
                  navigate={navigate}
                  user={user}
                  arrayMethod="Post"
                  patchEndPoint="posts"
                  userBookmarkedItems={user?.bookmarkedPosts}
                  userLikedItems={user?.likedPosts}
                  bookmarkAddMethod="addBookmarkedPost"
                  bookmarkRemoveMethod="removeBookmarkedPost"
                  queryName={['posts', 'sort=-lastCommentedAt,']}
                  likedProperty="likedPosts"
                  bookmarkedProperty="bookmarkedPosts"
                  itemModel="Post"
                  notFunctional={notFunctional}
                />
              ) : (
                <BookmarkLikeMoreIconGroups
                  itemLikes={likes}
                  itemId={postId}
                  navigate={navigate}
                  user={user}
                  arrayMethod="Post"
                  patchEndPoint="posts"
                  userBookmarkedItems={user?.bookmarkedPosts}
                  userLikedItems={user?.likedPosts}
                  bookmarkAddMethod="addBookmarkedPost"
                  bookmarkRemoveMethod="removeBookmarkedPost"
                  queryName={['posts', 'sort=-lastCommentedAt,']}
                  likedProperty="likedPosts"
                  bookmarkedProperty="bookmarkedPosts"
                  itemModel="Post"
                  moreMenu={
                    <PostStoryActionMenu
                      itemId={postId}
                      itemCreatorId={posterId}
                      itemEndpoint="posts"
                      userId={user?._id}
                      oldPagesArray={oldPagesArray}
                      handleDeleteItem={handleDeletePost}
                      deleteStatus={deleteStatus}
                      sticky={sticky}
                    />
                  }
                />
              )}
            </Group>
          </Card.Section>
        </Card>
      )}
    </div>
  );
}
