import React from 'react';
import { createStyles, Card, Group, Text, Title } from '@mantine/core';

import calcTimeAgo from './../../utility/calcTimeAgo';

import { useNavigate, Link } from 'react-router-dom';

import BookmarkLikeMoreIconGroups from '../IconGroups/BookmarkLikeMoreIconGroups';
import PostStoryActionMenu from './../Menus/PostStoryActionMenu';
import useDeleteStory from '../../react-query-hooks/useStories/useDeleteStory';
import CommentsCountIconButton from '../IconButtons/CommentsCountIconButton';
import RichTextEditor from '@mantine/rte';
import AvatarComponent from './../AvatarComponent';

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

    // "&::before": {
    //   content: '""',
    //   position: "absolute",
    //   top: 0,
    //   bottom: 0,
    //   left: 0,
    //   width: 6,
    //   backgroundImage: theme.fn.linearGradient(
    //     0,
    //     theme.colors.pink[6],
    //     theme.colors.orange[6]
    //   ),
    // },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.colors.dark[6],
    padding: 10,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },

  richTextEditor: {
    border: 'none',
    maxHeight: 150,
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
    // borderTop: `1px solid ${
    //   theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    // }`,
  }
}));

export default function StoryCard({
  user,
  content,
  title,
  images,
  likes,
  commentCount,
  createdAt,
  lastCommentedAt,
  storyId,
  storyTeller,
  storyTellerPhoto,
  storyTellerUsername,
  storyTellerId,
  oldPagesArray,
  storyTellerProfileName,
  storyTellerRole,
  withBorder,
  notFunctional,
  noHoverCard
}) {
  const { classes, theme } = useStyles();

  const navigate = useNavigate();

  const { mutate: handleDeleteStory, status: deleteStatus } = useDeleteStory();

  // const navigateToStoryId = () => {
  //   navigate(`/stories/${storyId}`);
  // };

  const navigateToUserProfile = e => {
    e.preventDefault();
    navigate(`/users/${storyTellerUsername}`);
  };

  return (
    <Card
      radius="md"
      className={classes.card}
      component={Link}
      to={`/stories/${storyId}`}
      withBorder={withBorder}
    >
      <Group>
        <AvatarComponent
          creator={storyTeller}
          username={storyTellerUsername}
          profileName={storyTellerProfileName}
          role={storyTellerRole}
          photo={storyTellerPhoto}
          id={storyTellerId}
          creationId={storyId}
          myId={user?.id}
          noHoverCard={noHoverCard}
        />

        <div>
          <Text
            weight={400}
            color={theme.colors.dark[8]}
            size="sm"
            // component={Link}
            // to={`/users/${storyTellerUsername}`}
            onClick={e => navigateToUserProfile(e)}
          >
            {storyTellerProfileName}
          </Text>
          <Text size="xs" color="dimmed">
            {// (lastCommentedAt && calcTimeAgo(lastCommentedAt)) ||
            calcTimeAgo(createdAt)}
          </Text>
        </div>
      </Group>
      {/* <Card.Section mb="sm">
        <Image src={image} alt={title} height={180} />
      </Card.Section> */}

      {/* <Badge>{category}</Badge> */}

      <Title
        order={4}
        className={classes.title}
        mt="md"
        id={`storyCardTitle${storyId}`}
      >
        {title}
      </Title>
      {content !== '<p><br></br></p>' && (
        <RichTextEditor
          value={content}
          readOnly
          id={`storyCardContent${storyId}`}
          className={classes.richTextEditor}
        />
      )}

      <Card.Section className={classes.footer}>
        <Group position="apart">
          <Group>
            {/* <Text size="xs" color="#5C5F66">
              {viewCount} views
            </Text> */}
            <CommentsCountIconButton commentsCount={commentCount} />
          </Group>

          {notFunctional ? (
            <BookmarkLikeMoreIconGroups
              itemLikes={likes}
              itemId={storyId}
              navigate={navigate}
              user={user}
              arrayMethod="Story"
              patchEndPoint="stories"
              userBookmarkedItems={user?.bookmarkedStories}
              userLikedItems={user?.likedStories}
              bookmarkAddMethod="addBookmarkedStory"
              bookmarkRemoveMethod="removeBookmarkedStory"
              queryName={['stories', 'sort=-lastCommentedAt,']}
              likedProperty="likedStories"
              bookmarkedProperty="bookmarkedStories"
              itemModel="Story"
              notFunctional={notFunctional}
            />
          ) : (
            <BookmarkLikeMoreIconGroups
              itemLikes={likes}
              itemId={storyId}
              navigate={navigate}
              user={user}
              arrayMethod="Story"
              patchEndPoint="stories"
              userBookmarkedItems={user?.bookmarkedStories}
              userLikedItems={user?.likedStories}
              bookmarkAddMethod="addBookmarkedStory"
              bookmarkRemoveMethod="removeBookmarkedStory"
              queryName={['stories', 'sort=-lastCommentedAt,']}
              likedProperty="likedStories"
              bookmarkedProperty="bookmarkedStories"
              itemModel="Story"
              moreMenu={
                <PostStoryActionMenu
                  itemId={storyId}
                  itemCreatorId={storyTellerId}
                  itemEndpoint="stories"
                  userId={user?._id}
                  oldPagesArray={oldPagesArray}
                  handleDeleteItem={handleDeleteStory}
                  deleteStatus={deleteStatus}
                />
              }
            />
          )}
        </Group>
      </Card.Section>
    </Card>
  );
}
