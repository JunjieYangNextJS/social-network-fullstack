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
  Indicator
} from '@mantine/core';
import { ArrowBigDown, ArrowBigTop } from 'tabler-icons-react';
import { useDebouncedValue, useDidUpdate } from '@mantine/hooks';
import isRichTextEmpty from './../../../../utility/isRichTextEmpty';
import calcTimeAgo from './../../../../utility/calcTimeAgo';

import BookmarkLikeMoreIconGroups from './../../../../components/IconGroups/BookmarkLikeMoreIconGroups';

import RichTextEditor from '@mantine/rte';
import ViewCountIconButton from './../../../../components/IconButtons/ViewCountIconButton';
import CommentsCountIconButton from './../../../../components/IconButtons/CommentsCountIconButton';
import useDeletePostComment from './../../../../react-query-hooks/usePostComments/useDeletePostComment';
import usePatchPostComment from './../../../../react-query-hooks/usePostComments/usePatchPostComment';
import CommentActionMenu from './../../../../components/Menus/CommentActionMenu';
import ReplyButton from './../../../../components/Buttons/ReplyButton';
import PostReplyCreateForm from './../../../../components/Forms/PostForms/PostReplyCreateForm';
import PostRepliesContainer from './PostReplies/PostRepliesContainer';
import { useGetHoverOtherUser } from '../../../../react-query-hooks/useOtherUsers/useOtherUser';
import {
  showChangesAreMemorized,
  showError
} from '../../../../utility/showNotifications';
import AvatarComponent from './../../../../components/AvatarComponent';

const useStyles = createStyles(theme => ({
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

const PostCommentContent = ({
  postComment,
  user,
  navigate,
  oldPagesArray,
  refetch,
  index,
  postId,
  posterId,
  pinned,
  willNotify
}) => {
  const {
    commenter,
    content,
    createdAt,
    editedAt,
    id,
    likes,
    post,
    postReplies,
    willNotifyCommenter,
    subscribers
  } = postComment;

  const { classes } = useStyles();
  const {
    mutate: handleDeletePostComment,
    status: deleteStatus
  } = useDeletePostComment(post?._id);

  const {
    mutate: patchPostComment,
    isLoading: patchIsLoading,
    isError: patchIsError
  } = usePatchPostComment(id);

  const edited = ' (edited)';

  // post comment
  const [readOnly, setReadOnly] = useState(true);
  const [doneEdit, setDoneEdit] = useState('');
  const [editTime, setEditTime] = useState('');
  const [richText, setRichText] = useState('');

  // post reply
  const [openReply, setOpenReply] = useState(false);
  const [expandReplies, setExpandReplies] = useState(true);

  useEffect(() => {
    setRichText(content);
  }, [content]);

  useDidUpdate(() => {
    if (patchIsError || deleteStatus === 'error') {
      showError('Something went wrong, please try again later');
    }
  }, [patchIsError, deleteStatus]);

  const handleCancelEdit = () => {
    if (richText !== content) showChangesAreMemorized();
    setRichText(content);
    setReadOnly(true);
  };

  const handleConfirmEdit = () => {
    patchPostComment({ content: richText });
    setReadOnly(true);
    setDoneEdit(edited);
    setEditTime(Date.now());
  };

  const handleNavigateToComment = () => {
    if (!readOnly) return;
    navigate(`/post-comment/${id}`);
  };

  return (
    <div style={{ paddingTop: 25 }}>
      {postComment && commenter && (
        <>
          {pinned !== id && (
            <>
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

              <div className={classes.commentBody}>
                <RichTextEditor
                  onClick={e =>
                    e.target.currentSrc
                      ? window.open(e.target.currentSrc, '_blank', 'noopener')
                      : handleNavigateToComment()
                  }
                  // placeholder="Post comment content"

                  id={`postCommentContent${id}`}
                  name={`postCommentContent${id}`}
                  key={`postCommentContent${id}`}
                  value={content}
                  onChange={setRichText}
                  readOnly={readOnly || user?.id !== commenter?.id}
                  sx={{
                    border: 'none',
                    fontSize: 15,
                    color: ' #343a40',
                    cursor: readOnly ? 'pointer' : 'default'
                  }}
                />
                {!readOnly && user?.id === commenter?.id && (
                  <Group spacing="xs">
                    <Button
                      variant="light"
                      color="gray"
                      size="xs"
                      disabled={isRichTextEmpty(richText) || patchIsLoading}
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
                <Group spacing="xs">
                  <Button
                    variant="subtle"
                    color="gray"
                    size="xs"
                    onClick={() => setOpenReply(!openReply)}
                  >
                    Reply
                  </Button>
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
                    queryName={['post', post._id, 'comments']}
                    likedProperty="likedPostComments"
                    bookmarkedProperty="bookmarkedPostComments"
                    itemModel="PostComment"
                    moreMenu={
                      <CommentActionMenu
                        itemId={id}
                        itemCreatorId={commenter.id}
                        setDataName={['post', post.id, 'comments']}
                        itemEndpoint="postComments"
                        userId={user?._id}
                        userItems={user?.myPostComments}
                        handleDeleteItem={handleDeletePostComment}
                        deleteStatus={deleteStatus}
                        setReadOnly={setReadOnly}
                        oldPagesArray={oldPagesArray}
                        postOrStoryCreatorId={posterId}
                        postOrStoryId={postId}
                        postOrStoryRoute="posts"
                        willNotifyCommenter={willNotifyCommenter}
                        pinned={pinned}
                        refetch={refetch}
                        index={index}
                        subscribers={subscribers}
                      />
                    }
                  />
                </Group>
                {openReply && (
                  <PostReplyCreateForm
                    user={user}
                    postId={post?.id}
                    postCommentId={id}
                    setOpenReply={setOpenReply}
                    refetch={refetch}
                    index={index}
                  />
                )}
                <Button
                  variant="subtle"
                  color="gray"
                  size="xs"
                  onClick={() => setExpandReplies(!expandReplies)}
                >
                  <Group spacing={3}>
                    {expandReplies ? (
                      <ArrowBigTop size={14} />
                    ) : (
                      <ArrowBigDown size={14} />
                    )}
                    <Text size={14} color="gray">
                      Replies {postReplies?.length}
                    </Text>
                  </Group>
                </Button>
                {expandReplies && (
                  <PostRepliesContainer
                    replies={postReplies}
                    user={user}
                    refetch={refetch}
                    index={index}
                    // post={post}
                  />
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PostCommentContent;
