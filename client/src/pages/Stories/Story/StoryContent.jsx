import React, { useEffect, useState } from 'react';
import {
  Container,
  createStyles,
  Text,
  Avatar,
  Group,
  TextInput,
  Stack,
  Button,
  Title,
  Indicator,
  Center,
  Loader,
  Menu
} from '@mantine/core';
import calcTimeAgo from './../../../utility/calcTimeAgo';
import PostStoryActionMenu from './../../../components/Menus/PostStoryActionMenu';
import BookmarkLikeMoreIconGroups from './../../../components/IconGroups/BookmarkLikeMoreIconGroups';
import useDeleteStory from './../../../react-query-hooks/useStories/useDeleteStory';
import RichTextEditor from '@mantine/rte';
import CommentsCountIconButton from './../../../components/IconButtons/CommentsCountIconButton';

import usePatchStory from './../../../react-query-hooks/useStories/usePatchStory';
import isRichTextEmpty from './../../../utility/isRichTextEmpty';
import { useDebouncedValue, useDidUpdate } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { Check } from 'tabler-icons-react';
import { Link } from 'react-router-dom';
import AvatarComponent from './../../../components/AvatarComponent';
import { showChangesAreMemorized } from '../../../utility/showNotifications';

const useStyles = createStyles(theme => ({
  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm
  }
}));

const StoryContent = ({ story, user, navigate }) => {
  const { classes } = useStyles();
  const {
    mutate: handleDeleteStory,
    status: deleteStatus,
    isSuccess: isDeleteSuccess
  } = useDeleteStory();
  const {
    mutate: patchStory,
    isLoading: patchIsLoading,
    isSuccess: isPatchSuccess
  } = usePatchStory(story?.id);

  const edited = ' (edited)';

  const [readOnly, setReadOnly] = useState(true);
  const [doneEdit, setDoneEdit] = useState('');
  const [editTime, setEditTime] = useState('');
  const [richTextContent, setRichTextContent] = useState('');
  const [richTextTitle, setRichTextTitle] = useState('');

  useEffect(() => {
    setRichTextContent(story?.content);
    setRichTextTitle(story?.title);
  }, [story?.content, story?.title]);

  useDidUpdate(() => {
    if (isPatchSuccess)
      showNotification({
        title: 'Awesome',
        message: 'Your story has been updated!',
        color: 'teal',
        icon: <Check />,
        autoClose: 5000
      });
  }, [isPatchSuccess]);

  const handleCancelEdit = () => {
    if (richTextContent !== story?.content) showChangesAreMemorized();

    setRichTextContent(story?.content);
    setRichTextTitle(story?.title);
    setReadOnly(true);
  };

  const handleConfirmEdit = () => {
    patchStory({
      content: richTextContent,
      title: richTextTitle,
      editedAt: Date.now()
    });
    setReadOnly(true);
    setDoneEdit(edited);
    setEditTime(Date.now());
  };

  return (
    <Container>
      <Center sx={{ paddingBottom: 20 }}>
        {!readOnly && user?.id === story?.storyTeller.id ? (
          <TextInput
            value={richTextTitle}
            onChange={event => setRichTextTitle(event.currentTarget.value)}
            id={`storyTitle${story?.id}`}
            name={`storyTitle${story?.id}`}

            // readOnly={readOnly || user?.id !== story?.storyTeller.id}
          />
        ) : (
          <Title sx={theme => ({ color: theme.colors.black[0] })} order={3}>
            {richTextTitle}
          </Title>
        )}
      </Center>

      <Group>
        <AvatarComponent
          creator={story?.storyTeller}
          username={story?.storyTeller.username}
          profileName={story?.storyTeller.profileName}
          role={story?.storyTeller.role}
          photo={story?.storyTeller.photo}
          id={story?.storyTeller._id}
          creationId={story?.id}
          myId={user?.id}
        />

        <div>
          <Text size="sm">{story?.storyTeller.profileName}</Text>
          <Text size="xs" color="dimmed">
            {doneEdit
              ? calcTimeAgo(editTime) + doneEdit
              : story?.editedAt
              ? calcTimeAgo(story?.editedAt) + edited
              : calcTimeAgo(story?.createdAt)}
          </Text>
        </div>
      </Group>
      <RichTextEditor
        placeholder="[ No content ]"
        // mt="xs"
        onClick={e =>
          e.target.currentSrc &&
          window.open(e.target.currentSrc, '_blank', 'noopener')
        }
        id={`storyContent${story?.id}`}
        name={`storyContent${story?.id}`}
        key={`storyContent${story?.id}`}
        value={story?.content}
        onChange={setRichTextContent}
        readOnly={readOnly || user?.id !== story?.storyTeller.id}
        sx={theme => ({
          border: 'none',
          fontSize: 15,
          color: theme.colors.black[0]
        })}
      />
      {!readOnly && user?.id === story?.storyTeller.id && (
        <Group spacing="xs">
          <Button
            variant="light"
            color="gray"
            size="xs"
            disabled={isRichTextEmpty(richTextTitle) || patchIsLoading}
            onClick={() => handleConfirmEdit()}
          >
            Confirm
          </Button>
          <Button
            variant="subtle"
            color="gray"
            size="xs"
            onClick={() => handleCancelEdit()}
          >
            Cancel
          </Button>
        </Group>
      )}
      <BookmarkLikeMoreIconGroups
        itemLikes={story?.likes}
        itemId={story?._id}
        navigate={navigate}
        user={user}
        arrayMethod="Story"
        patchEndPoint="stories"
        single="story"
        userBookmarkedItems={user?.bookmarkedStories}
        bookmarkAddMethod="addBookmarkedStory"
        bookmarkRemoveMethod="removeBookmarkedStory"
        userLikedItems={user?.likedStories}
        likedProperty="likedStories"
        bookmarkedProperty="bookmarkedStories"
        // setUserLikedItems={setUserLikedStories}
        moreMenu={
          <>
            {/* <ViewCountIconButton viewCount={story?.viewCount} /> */}
            <CommentsCountIconButton commentsCount={story?.commentCount} />
            <PostStoryActionMenu
              itemCreatorId={story?.storyTeller.id}
              itemId={story?._id}
              willNotify={story?.willNotify}
              subscribers={story?.subscribers}
              openComments={story?.openComments}
              itemEndpoint="stories"
              userId={user?._id}
              userItems={user?.myStories}
              handleDeleteItem={handleDeleteStory}
              deleteStatus={deleteStatus}
              navigateToOrigin={true}
              setReadOnly={setReadOnly}
            />
          </>
        }
      />
    </Container>
  );
};

export default StoryContent;
