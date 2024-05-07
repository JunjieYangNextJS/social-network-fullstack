import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  createStyles,
  Text,
  Avatar,
  Group,
  TextInput,
  Button,
  Menu,
  Center,
  Loader
} from '@mantine/core';
import calcTimeAgo from '../../utility/calcTimeAgo';
import BookmarkLikeMoreIconGroups from '../../components/IconGroups/BookmarkLikeMoreIconGroups';

import RichTextEditor from '@mantine/rte';

import isRichTextEmpty from '../../utility/isRichTextEmpty';
import usePatchPostComment from '../../react-query-hooks/usePostComments/usePatchPostComment';
import useDeletePostComment from '../../react-query-hooks/usePostComments/useDeletePostComment';
import CommentActionMenu from './../../components/Menus/CommentActionMenu';
import { useDebouncedValue, useDidUpdate } from '@mantine/hooks';
import {
  showChangesAreMemorized,
  showChangesAreUpdated,
  showError
} from '../../utility/showNotifications';
import { showSuccess } from './../../utility/showNotifications';
import AvatarComponent from './../../components/AvatarComponent';

const useStyles = createStyles(theme => ({
  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm
  }
}));

export default function SinglePostCommentContent({ comment, user, navigate }) {
  const {
    likes,
    id,
    editedAt,
    content,
    commenter,
    post,
    poster,
    createdAt,
    subscribers,
    postReplies
  } = comment;

  const { classes } = useStyles();

  const {
    mutate: deletePostComment,
    status: deleteStatus,
    isSuccess: isDeleteSuccess
  } = useDeletePostComment();
  const {
    mutate: patchPostComment,
    isLoading: patchIsLoading,
    status: patchStatus
  } = usePatchPostComment(id);

  const edited = ' (edited)';

  const [readOnly, setReadOnly] = useState(true);
  const [doneEdit, setDoneEdit] = useState('');
  const [editTime, setEditTime] = useState('');
  const [richTextContent, setRichTextContent] = useState('');
  const richTextRef = useRef('');

  useDidUpdate(() => {
    if (patchStatus === 'error' || deleteStatus === 'error') {
      showError('Something went wrong, please try again later.');
    }
    if (deleteStatus === 'success') {
      showSuccess('It was successfully deleted.');
    }

    if (patchStatus === 'success') {
      showChangesAreUpdated();
    }
  }, [patchStatus, deleteStatus]);

  useEffect(() => {
    setRichTextContent(content);
    richTextRef.current.value = content;
  }, [content]);

  const handleCancelEdit = () => {
    if (richTextRef.current.value !== content) showChangesAreMemorized();
    setRichTextContent(content);
    setReadOnly(true);
  };

  const handleConfirmEdit = () => {
    patchPostComment({ content: richTextContent });
    setReadOnly(true);
    setDoneEdit(edited);
    setEditTime(Date.now());
  };

  return (
    <Container>
      {commenter?._id === '62d88288dcf0582d700a323f' ? (
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
              {doneEdit
                ? calcTimeAgo(editTime) + doneEdit
                : editedAt
                ? calcTimeAgo(editedAt) + edited
                : calcTimeAgo(createdAt)}
            </Text>
          </div>
        </Group>
      )}
      <RichTextEditor
        placeholder="Post content"
        mt="md"
        onClick={e =>
          e.target.currentSrc &&
          window.open(e.target.currentSrc, '_blank', 'noopener')
        }
        id={`commentContent${id}`}
        name={`commentContent${id}`}
        key={`commentContent${id}`}
        value={content}
        ref={richTextRef}
        onChange={setRichTextContent}
        readOnly={readOnly || user?.id !== commenter.id}
        sx={{ border: 'none' }}
      />
      {!readOnly && user?.id === commenter.id && (
        <Group spacing="xs">
          <Button
            variant="light"
            color="gray"
            size="xs"
            disabled={isRichTextEmpty(richTextContent)}
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
        itemLikes={likes}
        itemId={id}
        navigate={navigate}
        user={user}
        userLikedItems={user?.likedPostComments}
        arrayMethod="PostComment"
        patchEndPoint="postComments"
        userBookmarkedItems={user?.bookmarkedPostComments}
        bookmarkAddMethod="addBookmarkedPostComment"
        bookmarkRemoveMethod="removeBookmarkedPostComment"
        queryName={['postComment', id]}
        likedProperty="likedPostComments"
        bookmarkedProperty="bookmarkedPostComments"
        itemModel="PostComment"
        moreMenu={
          <CommentActionMenu
            itemId={id}
            itemCreatorId={commenter.id}
            setDataName={['postComment', id]}
            itemEndpoint="postComments"
            userId={user?._id}
            userItems={user?.myPostComments}
            handleDeleteItem={deletePostComment}
            deleteStatus={deleteStatus}
            setReadOnly={setReadOnly}
            postOrStoryCreatorId={poster}
            postOrStoryId={post._id}
            postOrStoryRoute="posts"
            subscribers={subscribers}
          />
        }
      />
    </Container>
  );
}
